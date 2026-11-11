import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Crown,
  Eye,
  Flame,
  Lock,
  Sparkles,
  Sprout,
  Unlock,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { formatTimer, getPromptWordCount } from '../../helpers/formatters';
import { resolveChallengeImageUrl } from '../../helpers/imageHelpers';
import { AvatarBadge } from '../AvatarBadge';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import { getPlayerPowerTier } from '../../../shared/achievements';

export const TVPlayingView: React.FC = React.memo(() => {
  const challenge = useGameStore((s) => s.roomState.challenge);
  const roundTimeLeft = useGameStore((s) => s.roomState.roundTimeLeft);
  const blurPx = useGameStore((s) => s.roomState.blurPx);
  const players = useGameStore((s) => s.roomState.players);

  const lockOrderBySlot = useMemo(() => {
    const locked = players
      .filter((p) => p.hasLockedPrompt && p.lockedAtRemainingSeconds !== null)
      .sort((a, b) => (b.lockedAtRemainingSeconds || 0) - (a.lockedAtRemainingSeconds || 0));

    const map = new Map<number, number>();
    locked.forEach((p, idx) => {
      map.set(p.slot, idx + 1);
    });
    return map;
  }, [players]);

  if (!challenge) return null;

  const imageFrameBorderClass =
    roundTimeLeft <= 15
      ? 'border-rose-400 shadow-[0_16px_42px_rgba(244,63,94,0.26)]'
      : roundTimeLeft <= 30
      ? 'border-amber-400 shadow-[0_14px_36px_rgba(245,158,11,0.2)]'
      : 'border-[#DDC7F8] shadow-[0_14px_36px_rgba(51,0,67,0.1)]';

  return (
    <motion.div
      key="phase-playing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between gap-3"
    >
      {/* Topo: Imagem Cinematográfica Preenchendo Todo o Container (50%) + Prompt & Dicas (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch flex-1 min-h-0 overflow-hidden">
        {/* ESQUERDA (6 cols): Imagem Preenchendo 100% do Container (Sem Bordas Internas Extras e Sem Scanner) */}
        <div
          className={`lg:col-span-6 relative rounded-3xl overflow-hidden border-2 ${imageFrameBorderClass} bg-[#1E002B] transition-all duration-500 min-h-0`}
        >
          <img
            src={resolveChallengeImageUrl(challenge.id, challenge.imageUrl)}
            alt="Imagem gerada por IA"
            decoding="async"
            className="w-full h-full object-cover select-none"
          />

          {/* Gradiente sutil apenas no topo para leitura perfeita das badges sobre a arte */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 via-black/15 to-transparent"
          />

          {/* Badges Flutuantes Diretamente Sobre a Imagem */}
          <div className="pointer-events-none absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#DDC7F8] text-xs font-bold text-[#330043] shadow-sm">
              <img
                src="/marca/ia.svg"
                alt="IA"
                decoding="async"
                className="w-4 h-4 object-contain"
              />
              <span>{challenge.category}</span>
            </span>

            <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FF4A97] text-white text-xs font-bold shadow-sm border border-white/30">
              Dificuldade: {challenge.difficulty}
            </span>
          </div>
        </div>

        {/* DIREITA (6 cols): Relógio Grande + Prompt Embaçado Contínuo + Dicas */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-2.5 min-h-0 overflow-hidden">
          {/* 1. Cabeçalho Direito + Relógio Regressivo */}
          <div className="flex items-center justify-between gap-4 bg-white px-4 py-2.5 rounded-3xl border border-[#DDC7F8] shadow-xs shrink-0">
            <div>
              <span className="text-xs font-semibold text-[#9747FF]">Desafio em Andamento</span>
              <h2 className="font-display text-lg lg:text-xl text-[#330043]">
                Qual prompt gerou esta imagem?
              </h2>
            </div>

            <div
              className={`px-4 py-1.5 rounded-2xl border font-orbitron text-2xl lg:text-3xl font-bold flex items-center gap-2 transition-all ${
                roundTimeLeft <= 15
                  ? 'bg-rose-50 border-rose-300 text-rose-600 scale-105 shadow-sm'
                  : 'bg-[#FAF5FF] border-[#DDC7F8] text-[#330043]'
              }`}
            >
              <Clock
                className={`w-5 h-5 ${
                  roundTimeLeft <= 15 ? 'text-rose-500 animate-spin' : 'text-[#9747FF]'
                }`}
              />
              <span>{formatTimer(roundTimeLeft)}</span>
            </div>
          </div>

          {/* 2. Card do Prompt Original Embaçado (Texto Contínuo Natural) */}
          <div className="bg-[#FAF5FF] p-4 rounded-3xl border border-[#DDC7F8] shadow-xs flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs text-[#545454] mb-1.5">
              <span className="font-semibold text-[#330043] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4A97]" />
                <span>Prompt original (desembaça progressivamente)</span>
              </span>
              <span className="font-semibold text-[#9747FF]">{challenge.wordCount} palavras</span>
            </div>

            <p className="font-prompt text-sm lg:text-base leading-relaxed text-[#330043] select-none">
              {challenge.maskedPromptTokens.map((token, idx) => (
                <React.Fragment key={idx}>
                  <span
                    style={{
                      filter: token.isRevealed
                        ? 'blur(0px)'
                        : `blur(${Math.max(5, blurPx)}px)`,
                      transition: 'filter 0.7s ease',
                    }}
                    className={`inline-block rounded px-1 transition-colors ${
                      token.isRevealed
                        ? 'text-[#330043] font-semibold bg-[#FF4A97]/15'
                        : 'text-[#330043]/75'
                    }`}
                  >
                    {token.text}
                  </span>{' '}
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* 3. Dicas Desbloqueadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 shrink-0">
            {[0, 1].map((hintIdx) => {
              const hintText = challenge.unlockedHints[hintIdx];
              return (
                <div
                  key={hintIdx}
                  className={`rounded-2xl px-3.5 py-2.5 text-xs border flex items-start gap-2 transition-colors ${
                    hintText
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
                      : 'bg-white/80 border-[#E9D8FD] text-[#545454]'
                  }`}
                >
                  {hintText ? (
                    <Unlock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  ) : (
                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-[#9747FF]/50" />
                  )}
                  <div>
                    <div className="text-xs font-bold">
                      {hintText
                        ? `Dica ${hintIdx + 1} Liberada`
                        : `Dica ${hintIdx + 1} (${hintIdx === 0 ? '01:00' : '00:30'})`}
                    </div>
                    <div className="text-[11px] leading-snug mt-0.5">
                      {hintText || 'Liberada automaticamente conforme o relógio avança.'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ARENA COMPETITIVA DAS 5 PARTICIPANTES */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 shrink-0">
        {players.map((player) => {
          const wordCount = getPromptWordCount(player.submittedPrompt);
          const progressPct = Math.min(100, Math.round((wordCount / 18) * 100));
          const lockRank = lockOrderBySlot.get(player.slot);
          const potentialSpeedBonus = player.lockedAtRemainingSeconds
            ? Math.round((player.lockedAtRemainingSeconds / 90) * 150)
            : 0;
          const tier = getPlayerPowerTier({
            highScore: player.highScore,
            winsCount: player.winsCount,
            matchesPlayed: player.matchesPlayed,
          });

          const StageIcon =
            wordCount === 0
              ? Eye
              : wordCount <= 5
              ? Sprout
              : wordCount <= 11
              ? Zap
              : Flame;

          const stageLabel =
            wordCount === 0
              ? 'Analisando...'
              : wordCount <= 5
              ? `Rascunhando (${wordCount}p)`
              : wordCount <= 11
              ? `Detalhando (${wordCount}p)`
              : `Completo! (${wordCount}p)`;

          return (
            <div
              key={player.slot}
              className={`rounded-3xl p-3 bg-white border-2 transition-colors relative overflow-hidden ${
                player.hasLockedPrompt
                  ? 'border-emerald-400 shadow-[0_10px_28px_rgba(16,185,129,0.16)]'
                  : player.isTyping
                  ? 'border-[#FF4A97] shadow-[0_10px_28px_rgba(255,74,151,0.15)]'
                  : 'border-[#DDC7F8] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <AvatarBadge
                    avatar={player.avatar}
                    size="sm"
                    isBot={player.isBot}
                    highlight={player.hasLockedPrompt}
                    frameId={tier.frameId}
                    powerLevel={tier.level}
                  />
                  <div className="min-w-0 flex flex-col items-start">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-bold border whitespace-nowrap ${tier.pillClass}`}
                    >
                      <BadgeVectorIcon iconKey={tier.icon} className="w-2.5 h-2.5 shrink-0" />
                      <span>{tier.shortTitle}</span>
                    </span>
                    <div className="font-display text-sm text-[#330043] truncate max-w-full mt-0.5">
                      {player.nickname}
                    </div>
                  </div>
                </div>

                {player.hasLockedPrompt && lockRank ? (
                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-[10px] shrink-0 whitespace-nowrap">
                    <Crown className="w-3 h-3 text-amber-600" />
                    <span>{lockRank}º</span>
                  </span>
                ) : player.isTyping ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF5FF] border border-[#FF4A97]/50 text-[#FF4A97] text-[10px] font-bold shrink-0 whitespace-nowrap animate-pulse">
                    <span>Digitando</span>
                  </span>
                ) : null}
              </div>

              {player.hasLockedPrompt ? (
                <div className="p-2 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-left min-w-0">
                      <div className="text-[10px] font-bold text-emerald-900 truncate">
                        TRAVADO ({wordCount}p)
                      </div>
                      <div className="text-[10px] text-emerald-700 truncate">
                        Restando {player.lockedAtRemainingSeconds ?? 0}s
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-white border border-emerald-200 font-orbitron font-bold text-[10px] text-emerald-700 shrink-0 whitespace-nowrap">
                    <Zap className="w-2.5 h-2.5 text-emerald-500" />
                    <span>+{potentialSpeedBonus}</span>
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#330043] truncate">
                      <StageIcon className="w-3 h-3 text-[#9747FF] shrink-0" />
                      <span className="truncate">{stageLabel}</span>
                    </span>
                    <span className="text-[10px] text-[#9747FF] font-semibold shrink-0">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF5FF] border border-[#E9D8FD] overflow-hidden">
                    <div
                      style={{ width: `${progressPct}%` }}
                      className="h-full bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#FFCD34] rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
});
