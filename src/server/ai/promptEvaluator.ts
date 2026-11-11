import OpenAI from 'openai';
import type { ChallengeSeedData, SemanticKeywordGroup } from '../db/challengesData.js';
import type { PlayerRoundEvaluation, RoomPlayer } from '../../shared/types.js';

interface AiSingleAssessment {
  subjectScore: number; // 0..400
  styleScore: number; // 0..300
  detailsScore: number; // 0..300
  intentMatched: string[];
  intentMissed: string[];
  aiFeedback: string;
}

function normalizeText(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

function computeSpeedBonus(baseScore: number, lockedAtRemainingSeconds: number): number {
  if (baseScore < 300) return 0;
  const clampedSeconds = Math.max(0, Math.min(90, lockedAtRemainingSeconds));
  return Math.round((clampedSeconds / 90) * 150);
}

function evaluateGroupCoverage(
  normalizedInput: string,
  groups: SemanticKeywordGroup[],
  maxCategoryPoints: number
): {
  score: number;
  matched: string[];
  missed: string[];
} {
  let achievedWeight = 0;
  let totalWeight = 0;
  const matched: string[] = [];
  const missed: string[] = [];

  for (const group of groups) {
    totalWeight += group.weight;
    let bestGroupMatch = 0;

    for (const syn of group.synonyms) {
      const normSyn = normalizeText(syn);
      if (!normSyn) continue;

      if (normalizedInput.includes(normSyn)) {
        bestGroupMatch = 1;
        break;
      }

      // Checa correspondência parcial de tokens para expressões compostas
      const synTokens = normSyn.split(' ').filter((w) => w.length >= 3);
      if (synTokens.length > 1) {
        const hits = synTokens.filter((t) => normalizedInput.includes(t)).length;
        const ratio = hits / synTokens.length;
        if (ratio > bestGroupMatch) {
          bestGroupMatch = ratio;
        }
      } else if (synTokens.length === 1 && synTokens[0].length >= 5) {
        const stem = synTokens[0].slice(0, 5);
        if (normalizedInput.includes(stem)) {
          bestGroupMatch = Math.max(bestGroupMatch, 0.85);
        }
      }
    }

    if (bestGroupMatch >= 0.5) {
      achievedWeight += group.weight * bestGroupMatch;
      matched.push(group.concept);
    } else {
      missed.push(group.concept);
    }
  }

  const normalizedRatio = totalWeight > 0 ? achievedWeight / totalWeight : 0;
  const score = clamp(normalizedRatio * maxCategoryPoints, 0, maxCategoryPoints);

  return { score, matched, missed };
}

export function evaluatePromptLocally(
  submittedPrompt: string,
  challenge: ChallengeSeedData
): AiSingleAssessment {
  const norm = normalizeText(submittedPrompt);

  if (!norm || norm.length < 3) {
    return {
      subjectScore: 0,
      styleScore: 0,
      detailsScore: 0,
      intentMatched: [],
      intentMissed: [
        ...challenge.keywords.subject.map((g) => g.concept),
        ...challenge.keywords.style.map((g) => g.concept),
      ],
      aiFeedback:
        'Mermã, seu prompt ficou em branco! Na próxima rodada, descreva o personagem principal, o cenário e o estilo visual!',
    };
  }

  const subjectEval = evaluateGroupCoverage(norm, challenge.keywords.subject, 400);
  const styleEval = evaluateGroupCoverage(norm, challenge.keywords.style, 300);
  const envEval = evaluateGroupCoverage(norm, challenge.keywords.environment, 300);

  // Bônus de riqueza descritiva / vocabulário coincidente com o prompt original
  const originalTokens = normalizeText(challenge.fullPrompt)
    .split(' ')
    .filter((w) => w.length >= 4);
  const userTokens = norm.split(' ').filter((w) => w.length >= 4);

  let tokenOverlap = 0;
  for (const ut of userTokens) {
    if (originalTokens.some((ot) => ot.includes(ut) || ut.includes(ot))) {
      tokenOverlap++;
    }
  }

  const richnessBoost = Math.min(45, tokenOverlap * 9);
  const subjectScore = clamp(
    subjectEval.score + (userTokens.length >= 4 ? richnessBoost * 0.45 : 0),
    0,
    400
  );
  const styleScore = clamp(
    styleEval.score + (userTokens.length >= 6 ? richnessBoost * 0.3 : 0),
    0,
    300
  );
  const detailsScore = clamp(
    envEval.score + (userTokens.length >= 5 ? richnessBoost * 0.4 : 0),
    0,
    300
  );

  const intentMatched = [
    ...subjectEval.matched,
    ...styleEval.matched,
    ...envEval.matched,
  ];
  const intentMissed = [
    ...subjectEval.missed,
    ...styleEval.missed,
    ...envEval.missed,
  ];

  const baseTotal = subjectScore + styleScore + detailsScore;
  let aiFeedback = '';

  if (baseTotal >= 800) {
    aiFeedback =
      'Arrasou demais, Mermã! Você capturou a intenção visual completa: sujeito, estética e atmosfera dignos de Engenheira de Prompt Sênior!';
  } else if (baseTotal >= 550) {
    aiFeedback = `Mandou super bem! Você acertou em cheio ${
      intentMatched.slice(0, 2).join(' e ') || 'a ideia central'
    }. Para chegar aos 1000 pontos, detalhe também ${
      intentMissed[0]?.toLowerCase() || 'a iluminação e estilo artístico'
    }!`;
  } else if (baseTotal >= 280) {
    aiFeedback = `Boa visão inicial! Você identificou ${
      intentMatched[0] || 'parte da cena'
    }, mas a IA precisava saber mais sobre ${
      intentMissed.slice(0, 2).join(' e ').toLowerCase() || 'o estilo visual e cenário'
    }.`;
  } else {
    aiFeedback =
      'Continue praticando! Uma boa engenharia de prompt combina 3 camadas: Quem faz a ação + Onde acontece + Qual o estilo artístico!';
  }

  return {
    subjectScore,
    styleScore,
    detailsScore,
    intentMatched: intentMatched.length > 0 ? intentMatched : ['Tentativa criativa de descrição'],
    intentMissed: intentMissed.slice(0, 4),
    aiFeedback,
  };
}

async function callLlmEvaluator(params: {
  client: OpenAI;
  model: string;
  timeoutMs: number;
  challenge: ChallengeSeedData;
  submittedPrompt: string;
}): Promise<AiSingleAssessment> {
  const { client, model, timeoutMs, challenge, submittedPrompt } = params;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const systemPrompt = `Você é a "Mermã IA", avaliadora oficial do jogo educativo de Engenharia de Prompt no evento MDX STEAM 2026 (Mermãs Digitais no Maranhão).
Sua missão é avaliar a PROXIMIDADE DE INTENÇÃO VISUAL E SEMÂNTICA entre o prompt original que gerou a imagem e o palpite do jogador.
IMPORTANTE:
- Avalie o SIGNIFICADO e a INTENÇÃO VISUAL (sinônimos, ideias equivalentes, descrição da mesma cena), NÃO exija as mesmas palavras exatas nem penalize pequenos erros de digitação.
- Pontue em 3 pilares:
  1. subjectScore (0 a 400): O personagem/sujeito principal e sua ação.
  2. styleScore (0 a 300): O estilo artístico, técnica visual (ex: Pixar 3D, aquarela, pixel art, afrofuturismo) e paleta de cores.
  3. detailsScore (0 a 300): O cenário, ambiente, iluminação e elementos secundários.
- Retorne APENAS um JSON válido com o formato:
{
  "subjectScore": number,
  "styleScore": number,
  "detailsScore": number,
  "intentMatched": ["conceito acertado 1", "conceito acertado 2"],
  "intentMissed": ["conceito que faltou 1", "conceito que faltou 2"],
  "aiFeedback": "Feedback curto (máx 2 frases), empolgante, acolhedor e educativo em português brasileiro."
}`;

    const userContent = `PROMPT ORIGINAL DA IMAGEM:
"${challenge.fullPrompt}"
- Camada Sujeito: ${challenge.subjectLayer}
- Camada Estilo: ${challenge.styleLayer}
- Camada Ambiente/Detalhes: ${challenge.environmentLayer}

PALPITE DO JOGADOR:
"${submittedPrompt}"`;

    const response = await client.chat.completions.create(
      {
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
      },
      { signal: controller.signal }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Resposta vazia do LLM');
    }

    const parsed = JSON.parse(content) as Partial<AiSingleAssessment>;
    return {
      subjectScore: clamp(Number(parsed.subjectScore ?? 0), 0, 400),
      styleScore: clamp(Number(parsed.styleScore ?? 0), 0, 300),
      detailsScore: clamp(Number(parsed.detailsScore ?? 0), 0, 300),
      intentMatched: Array.isArray(parsed.intentMatched)
        ? parsed.intentMatched.slice(0, 5).map(String)
        : [],
      intentMissed: Array.isArray(parsed.intentMissed)
        ? parsed.intentMissed.slice(0, 4).map(String)
        : [],
      aiFeedback:
        typeof parsed.aiFeedback === 'string' && parsed.aiFeedback.trim().length > 0
          ? parsed.aiFeedback.trim()
          : 'Ótima tentativa! Continue combinando sujeito, ambiente e estilo artístico nos seus prompts!',
    };
  } finally {
    clearTimeout(timer);
  }
}

async function evaluateSinglePlayerPrompt(
  submittedPrompt: string,
  challenge: ChallengeSeedData
): Promise<{ assessment: AiSingleAssessment; evaluatorUsed: 'openai' | 'groq' | 'local' }> {
  const trimmed = (submittedPrompt || '').trim();
  if (trimmed.length < 3) {
    return {
      assessment: evaluatePromptLocally(trimmed, challenge),
      evaluatorUsed: 'local',
    };
  }

  // 1º: OpenAI GPT (default gpt-4o-mini)
  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  if (openAiKey && openAiKey !== 'sua-chave-aqui') {
    try {
      const openai = new OpenAI({ apiKey: openAiKey });
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const assessment = await callLlmEvaluator({
        client: openai,
        model,
        timeoutMs: 4500,
        challenge,
        submittedPrompt: trimmed,
      });
      return { assessment, evaluatorUsed: 'openai' };
    } catch (err) {
      console.warn(
        '⚠️ [AI Evaluator] Falha ou timeout na OpenAI, tentando fallback Groq...',
        err instanceof Error ? err.message : err
      );
    }
  }

  // 2º: Groq (default llama-3.3-70b-versatile)
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey && groqKey !== 'sua-chave-aqui') {
    try {
      const groq = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
      const assessment = await callLlmEvaluator({
        client: groq,
        model,
        timeoutMs: 4000,
        challenge,
        submittedPrompt: trimmed,
      });
      return { assessment, evaluatorUsed: 'groq' };
    } catch (err) {
      console.warn(
        '⚠️ [AI Evaluator] Falha ou timeout na Groq, usando avaliador semântico local...',
        err instanceof Error ? err.message : err
      );
    }
  }

  // 3º: Fallback Local Semântico Determinístico
  return {
    assessment: evaluatePromptLocally(trimmed, challenge),
    evaluatorUsed: 'local',
  };
}

export async function evaluateRoundPrompts(
  players: RoomPlayer[],
  challenge: ChallengeSeedData
): Promise<PlayerRoundEvaluation[]> {
  const rawEvaluations = await Promise.all(
    players.map(async (player) => {
      const lockedSec = player.lockedAtRemainingSeconds ?? 0;
      const { assessment, evaluatorUsed } = await evaluateSinglePlayerPrompt(
        player.submittedPrompt,
        challenge
      );

      const baseScore =
        assessment.subjectScore + assessment.styleScore + assessment.detailsScore;
      const speedBonus = computeSpeedBonus(baseScore, lockedSec);
      const totalScore = baseScore + speedBonus;
      const similarityPercent = clamp((baseScore / 1000) * 100, 0, 100);

      const evaluation: PlayerRoundEvaluation = {
        playerId: player.id,
        nickname: player.nickname,
        avatar: player.avatar,
        slot: player.slot,
        isBot: player.isBot,
        submittedPrompt:
          player.submittedPrompt.trim() || '(Sem resposta enviada a tempo)',
        lockedAtRemainingSeconds: lockedSec,
        subjectScore: assessment.subjectScore,
        styleScore: assessment.styleScore,
        detailsScore: assessment.detailsScore,
        speedBonus,
        totalScore,
        similarityPercent,
        intentMatched: assessment.intentMatched,
        intentMissed: assessment.intentMissed,
        aiFeedback: assessment.aiFeedback,
        evaluatorUsed,
        isWinner: false,
        isNewHighScore: false,
      };

      return evaluation;
    })
  );

  // ============================================================================
  // Balanceamento Dinâmico (Adaptive Rubber-Banding) dos Bots Mermã:
  // Os bots equilibram seu nível de acordo com os jogadores humanos da sala,
  // mantendo a disputa acirrada sem roubar injustamente a vitória de humanos ativos.
  // ============================================================================
  const humanEvals = rawEvaluations.filter((e) => !e.isBot);
  const botEvals = rawEvaluations.filter((e) => e.isBot);

  if (humanEvals.length > 0 && botEvals.length > 0) {
    const activeHumans = humanEvals.filter((h) => h.totalScore >= 80);
    const bestHumanScore =
      activeHumans.length > 0
        ? Math.max(...activeHumans.map((h) => h.totalScore))
        : 0;

    botEvals.forEach((botEv, idx) => {
      if (bestHumanScore >= 80) {
        // Escala o bot para ficar próximo porém levemente abaixo do melhor humano da sala (72% a 88%)
        const targetFactor = idx === 0 ? 0.86 : 0.74;
        const targetTotal = clamp(
          Math.round(bestHumanScore * targetFactor),
          140,
          Math.max(140, bestHumanScore - 25)
        );

        // Distribui proporcionalmente entre as 3 camadas (sem bônus de velocidade artificial alto)
        const currentBase = Math.max(
          1,
          botEv.subjectScore + botEv.styleScore + botEv.detailsScore
        );
        const nextSpeedBonus = targetTotal >= 380 ? Math.min(45, Math.round(targetTotal * 0.08)) : 0;
        const targetBase = Math.max(100, targetTotal - nextSpeedBonus);
        const scale = targetBase / currentBase;

        botEv.subjectScore = clamp(botEv.subjectScore * scale, 50, 360);
        botEv.styleScore = clamp(botEv.styleScore * scale, 30, 260);
        botEv.detailsScore = clamp(
          targetBase - botEv.subjectScore - botEv.styleScore,
          20,
          260
        );
        botEv.speedBonus = nextSpeedBonus;
        botEv.totalScore =
          botEv.subjectScore + botEv.styleScore + botEv.detailsScore + botEv.speedBonus;
        botEv.similarityPercent = clamp(
          ((botEv.subjectScore + botEv.styleScore + botEv.detailsScore) / 1000) * 100,
          12,
          92
        );
      } else {
        // Caso nenhum humano tenha digitado nada na rodada, bot faz uma pontuação modesta de iniciante
        botEv.subjectScore = 160;
        botEv.styleScore = 90;
        botEv.detailsScore = 70;
        botEv.speedBonus = 0;
        botEv.totalScore = 320;
        botEv.similarityPercent = 32;
      }
    });
  }

  // Determina vencedor da rodada (maior totalScore; desempate priorizando jogadora humana e depois velocidade)
  let bestIdx = 0;
  for (let i = 1; i < rawEvaluations.length; i++) {
    const curr = rawEvaluations[i];
    const best = rawEvaluations[bestIdx];
    if (
      curr.totalScore > best.totalScore ||
      (curr.totalScore === best.totalScore && !curr.isBot && best.isBot) ||
      (curr.totalScore === best.totalScore &&
        curr.isBot === best.isBot &&
        curr.lockedAtRemainingSeconds > best.lockedAtRemainingSeconds)
    ) {
      bestIdx = i;
    }
  }

  if (rawEvaluations.length > 0 && rawEvaluations[bestIdx].totalScore > 0) {
    rawEvaluations[bestIdx].isWinner = true;
  } else if (rawEvaluations.length > 0) {
    rawEvaluations[0].isWinner = true;
  }

  // Ordena da menor pontuação para a maior pontuação (cria clímax dramático na TV: último colocado primeiro, vencedor por último)
  return rawEvaluations.sort((a, b) => a.totalScore - b.totalScore);
}
