export type PlayerPowerLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type AvatarFrameId =
  | 'frame-starter'      // Nível 1: Curiosa Digital
  | 'frame-explorer'     // Nível 2: Exploradora IA
  | 'frame-apprentice'   // Nível 3: Aprendiz de Prompt
  | 'frame-engineer'     // Nível 4: Engenheira Criativa
  | 'frame-director'     // Nível 5: Diretora de Visão
  | 'frame-architect'    // Nível 6: Arquiteta Neural
  | 'frame-master'       // Nível 7: Mestra da Síntese IA
  | 'frame-oracle'       // Nível 8: Oráculo STEAM
  | 'frame-singularity'  // Nível 9: Guardiã da Singularidade
  | 'frame-legend';      // Nível 10: Lenda Mermã Digital

export type BadgeIconKey =
  | 'sprout'
  | 'sparkles'
  | 'zap'
  | 'flame'
  | 'crown'
  | 'gem'
  | 'target'
  | 'palette'
  | 'globe'
  | 'trophy'
  | 'rocket'
  | 'gamepad'
  | 'compass'
  | 'cpu'
  | 'star';

export type AchievementId =
  | 'first_spark'      // Primeira Faísca (1ª partida concluída)
  | 'speed_demon'      // Mermã Flash (Travou faltando >= 50s com boa nota)
  | 'sniper_subject'   // Olho Clínico (Sujeito >= 330/400)
  | 'art_director'     // Diretora de Arte (Estilo >= 240/300)
  | 'world_builder'    // Arquiteta de Mundos (Cenário >= 240/300)
  | 'triple_crown'     // Tríade Perfeita (Sujeito, Estilo e Cenário >= 75%)
  | 'first_victory'    // Campeã da Arena (Venceu 1º lugar na rodada)
  | 'unstoppable_3'    // Tricampeã STEAM (3+ vitórias na carreira)
  | 'high_roller_800'  // Clube dos 800+ (Pontuação >= 800 na rodada)
  | 'legendary_950'    // Oráculo da IA (Pontuação >= 950 na rodada)
  | 'record_breaker'   // Superação Pessoal (Bateu seu próprio High Score)
  | 'veteran_5';       // Veterana MDX (5+ partidas jogadas)

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  icon: BadgeIconKey;
  rarity: 'comum' | 'raro' | 'epico' | 'lendario';
  powerBonus: number;
  colorClass: string;
  badgeBgClass: string;
}

export interface PlayerPowerTierInfo {
  level: PlayerPowerLevel;
  title: string;
  shortTitle: string;
  icon: BadgeIconKey;
  frameId: AvatarFrameId;
  powerScore: number;
  progressPercent: number; // 0..100 para o próximo nível
  nextTierTitle: string | null;
  auraGradient: string;
  pillClass: string;
}

export const ACHIEVEMENTS_CATALOG: Record<AchievementId, AchievementDefinition> = {
  first_spark: {
    id: 'first_spark',
    title: 'Primeira Faísca',
    description: 'Participou do desafio de IA no estande Mermãs Digitais!',
    icon: 'sprout',
    rarity: 'comum',
    powerBonus: 50,
    colorClass: 'text-emerald-700',
    badgeBgClass: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  speed_demon: {
    id: 'speed_demon',
    title: 'Mermã Flash',
    description: 'Travou um ótimo prompt faltando mais de 50s no relógio!',
    icon: 'zap',
    rarity: 'raro',
    powerBonus: 120,
    colorClass: 'text-amber-700',
    badgeBgClass: 'bg-amber-50 border-amber-300 text-amber-900',
  },
  sniper_subject: {
    id: 'sniper_subject',
    title: 'Olho Clínico',
    description: 'Capturou a intenção do Sujeito e Ação com precisão cirúrgica!',
    icon: 'target',
    rarity: 'raro',
    powerBonus: 110,
    colorClass: 'text-[#9747FF]',
    badgeBgClass: 'bg-[#F5F0FF] border-[#DDC7F8] text-[#4C1D95]',
  },
  art_director: {
    id: 'art_director',
    title: 'Diretora de Arte',
    description: 'Identificou com maestria o Estilo Visual e estética da obra!',
    icon: 'palette',
    rarity: 'raro',
    powerBonus: 110,
    colorClass: 'text-[#D01F6B]',
    badgeBgClass: 'bg-pink-50 border-pink-200 text-[#D01F6B]',
  },
  world_builder: {
    id: 'world_builder',
    title: 'Arquiteta de Mundos',
    description: 'Descreveu o Cenário, atmosfera e iluminação nos mínimos detalhes!',
    icon: 'globe',
    rarity: 'raro',
    powerBonus: 110,
    colorClass: 'text-indigo-700',
    badgeBgClass: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  },
  triple_crown: {
    id: 'triple_crown',
    title: 'Tríade Perfeita',
    description: 'Dominou Sujeito, Estilo e Cenário acima de 75% na mesma rodada!',
    icon: 'crown',
    rarity: 'epico',
    powerBonus: 220,
    colorClass: 'text-amber-800',
    badgeBgClass: 'bg-gradient-to-r from-amber-50 to-pink-50 border-amber-300 text-[#330043]',
  },
  first_victory: {
    id: 'first_victory',
    title: 'Campeã da Arena',
    description: 'Conquistou o 1º Lugar da rodada no Desafio de Prompt!',
    icon: 'trophy',
    rarity: 'epico',
    powerBonus: 200,
    colorClass: 'text-amber-700',
    badgeBgClass: 'bg-amber-50 border-amber-300 text-amber-900',
  },
  unstoppable_3: {
    id: 'unstoppable_3',
    title: 'Tricampeã STEAM',
    description: 'Acumulou 3 ou mais vitórias na Arena MDX 2026!',
    icon: 'flame',
    rarity: 'epico',
    powerBonus: 300,
    colorClass: 'text-rose-700',
    badgeBgClass: 'bg-rose-50 border-rose-300 text-rose-900',
  },
  high_roller_800: {
    id: 'high_roller_800',
    title: 'Clube dos 800+',
    description: 'Superou a marca de 800 pontos em uma única rodada!',
    icon: 'gem',
    rarity: 'epico',
    powerBonus: 250,
    colorClass: 'text-[#9747FF]',
    badgeBgClass: 'bg-purple-50 border-purple-300 text-[#330043]',
  },
  legendary_950: {
    id: 'legendary_950',
    title: 'Oráculo da IA (950+)',
    description: 'Alcançou 950+ pontos — leitura mental quase perfeita do prompt!',
    icon: 'sparkles',
    rarity: 'lendario',
    powerBonus: 400,
    colorClass: 'text-[#FF4A97]',
    badgeBgClass: 'bg-gradient-to-r from-[#F5F0FF] via-pink-50 to-amber-50 border-[#FF4A97] text-[#330043]',
  },
  record_breaker: {
    id: 'record_breaker',
    title: 'Superação Pessoal',
    description: 'Quebrou seu próprio Recorde Pessoal na Arena!',
    icon: 'rocket',
    rarity: 'raro',
    powerBonus: 150,
    colorClass: 'text-[#D01F6B]',
    badgeBgClass: 'bg-pink-50 border-pink-300 text-[#D01F6B]',
  },
  veteran_5: {
    id: 'veteran_5',
    title: 'Veterana MDX',
    description: 'Disputou 5 ou mais partidas no espaço de IA das Mermãs Digitais!',
    icon: 'gamepad',
    rarity: 'raro',
    powerBonus: 180,
    colorClass: 'text-[#4C1D95]',
    badgeBgClass: 'bg-[#F5F0FF] border-[#DDC7F8] text-[#4C1D95]',
  },
};

interface TierSpec {
  level: PlayerPowerLevel;
  minPower: number;
  title: string;
  shortTitle: string;
  icon: BadgeIconKey;
  frameId: AvatarFrameId;
  auraGradient: string;
  pillClass: string;
}

export const POWER_TIERS: TierSpec[] = [
  {
    level: 1,
    minPower: 0,
    title: 'Curiosa Digital',
    shortTitle: 'Curiosa Digital',
    icon: 'sprout',
    frameId: 'frame-starter',
    auraGradient: 'from-[#DDC7F8] to-[#F5F0FF]',
    pillClass: 'bg-[#FAF7FF] border-[#DDC7F8] text-[#6E4F7D]',
  },
  {
    level: 2,
    minPower: 700,
    title: 'Exploradora IA',
    shortTitle: 'Exploradora IA',
    icon: 'sparkles',
    frameId: 'frame-explorer',
    auraGradient: 'from-[#9747FF] to-[#DDC7F8]',
    pillClass: 'bg-[#F5F0FF] border-[#9747FF]/40 text-[#4C1D95]',
  },
  {
    level: 3,
    minPower: 1800,
    title: 'Aprendiz de Prompt',
    shortTitle: 'Aprendiz de Prompt',
    icon: 'compass',
    frameId: 'frame-apprentice',
    auraGradient: 'from-sky-400 to-[#9747FF]',
    pillClass: 'bg-sky-50 border-sky-300 text-sky-900',
  },
  {
    level: 4,
    minPower: 3500,
    title: 'Engenheira Criativa',
    shortTitle: 'Engenheira Criativa',
    icon: 'zap',
    frameId: 'frame-engineer',
    auraGradient: 'from-[#9747FF] via-[#FF4A97] to-[#9747FF]',
    pillClass: 'bg-pink-50 border-pink-300 text-[#D01F6B]',
  },
  {
    level: 5,
    minPower: 6000,
    title: 'Diretora de Visão',
    shortTitle: 'Diretora de Visão',
    icon: 'palette',
    frameId: 'frame-director',
    auraGradient: 'from-fuchsia-500 via-[#FF4A97] to-[#9747FF]',
    pillClass: 'bg-fuchsia-50 border-fuchsia-300 text-[#701A75]',
  },
  {
    level: 6,
    minPower: 9500,
    title: 'Arquiteta Neural',
    shortTitle: 'Arquiteta Neural',
    icon: 'cpu',
    frameId: 'frame-architect',
    auraGradient: 'from-indigo-500 via-[#9747FF] to-[#FF4A97]',
    pillClass: 'bg-indigo-50 border-indigo-300 text-indigo-950',
  },
  {
    level: 7,
    minPower: 14000,
    title: 'Mestra da Síntese IA',
    shortTitle: 'Mestra da Síntese',
    icon: 'flame',
    frameId: 'frame-master',
    auraGradient: 'from-[#FF4A97] via-[#FFD500] to-[#9747FF]',
    pillClass: 'bg-amber-50 border-amber-300 text-amber-900',
  },
  {
    level: 8,
    minPower: 20000,
    title: 'Oráculo STEAM',
    shortTitle: 'Oráculo STEAM',
    icon: 'crown',
    frameId: 'frame-oracle',
    auraGradient: 'from-[#FFD500] via-[#FF4A97] to-[#9747FF]',
    pillClass: 'bg-gradient-to-r from-amber-50 to-pink-50 border-amber-400 text-[#330043]',
  },
  {
    level: 9,
    minPower: 27500,
    title: 'Guardiã da Singularidade',
    shortTitle: 'Singularidade IA',
    icon: 'star',
    frameId: 'frame-singularity',
    auraGradient: 'from-rose-500 via-[#FFCD34] to-[#9747FF]',
    pillClass: 'bg-rose-50 border-rose-300 text-rose-900',
  },
  {
    level: 10,
    minPower: 36000,
    title: 'Lenda Mermã Digital',
    shortTitle: 'Lenda Mermã Digital',
    icon: 'gem',
    frameId: 'frame-legend',
    auraGradient: 'from-[#9747FF] via-[#FF4A97] to-[#00E5FF]',
    pillClass: 'bg-gradient-to-r from-[#9747FF] to-[#FF4A97] border-amber-300 text-white shadow-xs',
  },
];

/**
 * Calcula a pontuação acumulada de Poder (PWR) de uma jogadora.
 * O PWR representa o amontoado acumulado de pontos obtidos em todas as partidas,
 * recompensando a assiduidade e consistência, somado a bônus por vitórias (+100 PWR)
 * e partidas completadas (+25 PWR).
 */
export function calculatePlayerPowerScore(stats: {
  highScore?: number;
  totalScore?: number;
  winsCount?: number;
  matchesPlayed?: number;
}): number {
  const highScore = stats.highScore || 0;
  const matchesPlayed = stats.matchesPlayed || 0;
  // Se totalScore não estiver disponível ou for 0 em contas antigas, projeta pelo highScore e partidas
  const totalScore =
    typeof stats.totalScore === 'number' && stats.totalScore > 0
      ? stats.totalScore
      : highScore * Math.max(1, matchesPlayed);
  const winsCount = stats.winsCount || 0;

  return Math.round(totalScore + winsCount * 100 + matchesPlayed * 25);
}

export function getPlayerPowerTier(stats: {
  highScore?: number;
  totalScore?: number;
  winsCount?: number;
  matchesPlayed?: number;
}): PlayerPowerTierInfo {
  const powerScore = calculatePlayerPowerScore(stats);

  let currentTier = POWER_TIERS[0];
  let nextTier: TierSpec | null = POWER_TIERS[1];

  for (let i = 0; i < POWER_TIERS.length; i++) {
    if (powerScore >= POWER_TIERS[i].minPower) {
      currentTier = POWER_TIERS[i];
      nextTier = POWER_TIERS[i + 1] || null;
    }
  }

  let progressPercent = 100;
  if (nextTier) {
    const span = Math.max(1, nextTier.minPower - currentTier.minPower);
    const gained = Math.max(0, powerScore - currentTier.minPower);
    progressPercent = Math.min(100, Math.round((gained / span) * 100));
  }

  return {
    level: currentTier.level,
    title: currentTier.title,
    shortTitle: currentTier.shortTitle,
    icon: currentTier.icon,
    frameId: currentTier.frameId,
    powerScore,
    progressPercent,
    nextTierTitle: nextTier ? nextTier.title : null,
    auraGradient: currentTier.auraGradient,
    pillClass: currentTier.pillClass,
  };
}

export function getCareerAchievements(stats: {
  highScore?: number;
  totalScore?: number;
  winsCount?: number;
  matchesPlayed?: number;
}): AchievementId[] {
  const list: AchievementId[] = [];
  const highScore = stats.highScore || 0;
  const totalScore = stats.totalScore || highScore;
  const winsCount = stats.winsCount || 0;
  const matchesPlayed = stats.matchesPlayed || 0;

  if (matchesPlayed >= 1 || highScore > 0) list.push('first_spark');
  if (highScore >= 320) list.push('sniper_subject');
  if (highScore >= 500) list.push('art_director');
  if (highScore >= 620 || totalScore >= 1000) list.push('speed_demon');
  if (highScore >= 680) list.push('world_builder');
  if (winsCount >= 1) list.push('first_victory');
  if (matchesPlayed >= 2 && highScore >= 550) list.push('record_breaker');
  if (highScore >= 800) list.push('high_roller_800');
  if (highScore >= 860) list.push('triple_crown');
  if (winsCount >= 3) list.push('unstoppable_3');
  if (matchesPlayed >= 5) list.push('veteran_5');
  if (highScore >= 950) list.push('legendary_950');

  return list;
}

export function evaluateRoundAchievements(params: {
  subjectScore: number;
  styleScore: number;
  detailsScore: number;
  speedBonus: number;
  totalScore: number;
  lockedAtRemainingSeconds: number;
  isWinner: boolean;
  isNewHighScore: boolean;
  matchesPlayedAfter: number;
  winsCountAfter: number;
}): AchievementId[] {
  const earned: AchievementId[] = [];

  if (params.matchesPlayedAfter === 1) {
    earned.push('first_spark');
  }
  if (params.isWinner) {
    earned.push('first_victory');
  }
  if (params.isNewHighScore && params.totalScore >= 350) {
    earned.push('record_breaker');
  }
  if (params.lockedAtRemainingSeconds >= 50 && params.totalScore >= 500) {
    earned.push('speed_demon');
  }
  if (params.subjectScore >= 330) {
    earned.push('sniper_subject');
  }
  if (params.styleScore >= 240) {
    earned.push('art_director');
  }
  if (params.detailsScore >= 240) {
    earned.push('world_builder');
  }
  if (
    params.subjectScore >= 300 &&
    params.styleScore >= 225 &&
    params.detailsScore >= 225
  ) {
    earned.push('triple_crown');
  }
  if (params.totalScore >= 800) {
    earned.push('high_roller_800');
  }
  if (params.totalScore >= 950) {
    earned.push('legendary_950');
  }
  if (params.winsCountAfter >= 3 && params.isWinner) {
    earned.push('unstoppable_3');
  }
  if (params.matchesPlayedAfter === 5) {
    earned.push('veteran_5');
  }

  if (earned.length === 0 && params.totalScore >= 300) {
    earned.push('first_spark');
  }

  return earned.slice(0, 4);
}
