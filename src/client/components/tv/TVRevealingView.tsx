import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  CheckCircle2,
  Globe,
  Palette,
  PenTool,
  Target,
  Trophy,
  Unlock,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useRevealScoreAnimation } from '../../hooks/useRevealScoreAnimation';
import { getRarityLabel, getVerdictStamp } from '../../helpers/formatters';
import { resolveChallengeImageUrl } from '../../helpers/imageHelpers';
import { AvatarBadge } from '../AvatarBadge';
import { PlayerStatsBadges } from '../PlayerStatsBadges';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import {
  ACHIEVEMENTS_CATALOG,
  evaluateRoundAchievements,
  getPlayerPowerTier,
  type AchievementId,
  type AvatarFrameId,
  type PlayerPowerLevel,
} from '../../../shared/achievements';

export const TVRevealingView: React.FC = React.memo(() => {
  const phase = useGameStore((s) => s.roomState.phase);
  const challenge = useGameStore((s) => s.roomState.challenge);
  const evaluations = useGameStore((s) => s.roomState.evaluations);
  const currentRevealIndex = useGameStore((s) => s.roomState.currentRevealIndex);
  const revealStepTimer = useGameStore((s) => s.roomState.revealStepTimer);
  const players = useGameStore((s) => s.roomState.players);

  const currentEvaluation = evaluations[currentRevealIndex] || evaluations[0] || null;
  const { animatedScore, currentEvalKey } = useRevealScoreAnimation(
    phase,
    currentRevealIndex,
    currentEvaluation
  );

  if (!challenge || !currentEvaluation) return null;

  const ev = currentEvaluation;
  const roomPlayer = players.find((p) => p.slot === ev.slot);
  const verdict = getVerdictStamp(ev.totalScore);
  const evalTier = getPlayerPowerTier({
    highScore: Math.max(roomPlayer?.highScore || 0, ev.totalScore),
    winsCount: (roomPlayer?.winsCount || 0) + (ev.isWinner ? 1 : 0),
    matchesPlayed: (roomPlayer?.matchesPlayed || 0) + 1,
  });

  const roundAchIds = (
    ev.roundAchievements && ev.roundAchievements.length > 0
      ? ev.roundAchievements
      : evaluateRoundAchievements({
          subjectScore: ev.subjectScore,
          styleScore: ev.styleScore,
          detailsScore: ev.detailsScore,
          speedBonus: ev.speedBonus,
          totalScore: ev.totalScore,
          lockedAtRemainingSeconds: ev.lockedAtRemainingSeconds,
          isWinner: ev.isWinner,
          isNewHighScore: ev.isNewHighScore,
          matchesPlayedAfter: (roomPlayer?.matchesPlayed || 0) + 1,
          winsCountAfter: (roomPlayer?.winsCount || 0) + (ev.isWinner ? 1 : 0),
        })
  ) as AchievementId[];

  const activeFrameId = (ev.newFrameId as AvatarFrameId) || evalTier.frameId;
  const activePowerLevel = (ev.newPowerLevel as PlayerPowerLevel) || evalTier.level;
  const activeTitle = ev.newTitle || evalTier.title;

  return (
    <motion.div
      key="phase-revealing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between gap-3"
    >
      {/* Topo: Miniatura da Arte + Prompt Original Oficial Desbloqueado */}
      <div className="bg-white rounded-3xl p-3.5 border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] flex items-center gap-3.5 shrink-0">
        <img
          src={resolveChallengeImageUrl(challenge.id, challenge.imageUrl)}
          alt={challenge.title}
          decoding="async"
          className="w-16 h-16 rounded-2xl object-cover border border-[#E9D8FD] shrink-0"
        />
        <div className="flex-1 min-w-0 text-left">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9747FF] bg-[#FAF5FF] px-3 py-0.5 rounded-full border border-[#E9D8FD]">
              <Unlock className="w-3.5 h-3.5 text-[#FF4A97]" />
              <span>Prompt Original Revelado • {challenge.title}</span>
            </span>
            <span className="text-xs font-semibold text-[#545454]">
              Revelando Participante {currentRevealIndex + 1} de {evaluations.length} (
              {revealStepTimer}s)
            </span>
          </div>
          <p className="font-prompt text-xs lg:text-sm text-[#330043] font-medium leading-snug line-clamp-2">
            “{challenge.fullPrompt}”
          </p>
        </div>
      </div>

      {/* Centro: Card Coreografado do Jogador da Vez */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentEvalKey}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="bg-white rounded-3xl p-4 lg:p-5 border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] flex-1 min-h-0 overflow-hidden flex flex-col justify-between gap-3"
        >
          {/* Banners Especiais: Novo Recorde Pessoal e/ou Promoção de Título */}
          <div className="flex flex-wrap gap-2">
            {ev.isNewHighScore && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                className="flex-1 min-w-[260px] py-2 px-4 rounded-2xl bg-gradient-to-r from-[#FFCD34] via-[#F59E0B] to-[#FF4A97] text-[#330043] font-display text-xs lg:text-sm flex items-center justify-center gap-2 shadow-xs"
              >
                <Trophy className="w-4 h-4 shrink-0" />
                <span>NOVO RECORDE PESSOAL BATIDO NA ARENA MDX!</span>
              </motion.div>
            )}

            {ev.leveledUpTitle && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 1.75,
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                }}
                className="flex-1 min-w-[260px] py-2 px-4 rounded-2xl bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#00E5FF] text-white font-display text-xs lg:text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <ArrowUpRight className="w-4 h-4 shrink-0" />
                <span>
                  PROMOÇÃO DE TÍTULO: {ev.previousTitle || 'Iniciante'} ➔ {activeTitle}
                </span>
              </motion.div>
            )}
          </div>

          {/* Cabeçalho do Card: Avatar Energizado + Evolução de Poder & Título + Contador Estável */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F3E8FF]">
            <div className="flex items-center gap-4">
              <AvatarBadge
                avatar={ev.avatar}
                size="lg"
                isBot={ev.isBot}
                highlight={ev.isWinner}
                frameId={activeFrameId}
                powerLevel={activePowerLevel}
                isPoweringUp={true}
              />
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-display text-2xl lg:text-3xl text-[#330043]">{ev.nickname}</h3>
                  <motion.span
                    initial={{ scale: 0.5, opacity: 0, rotate: -6 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{
                      delay: 1.4,
                      type: 'spring',
                      stiffness: 280,
                      damping: 15,
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${verdict.badgeClass}`}
                  >
                    <BadgeVectorIcon iconKey={verdict.iconKey} className="w-3.5 h-3.5" />
                    <span>{verdict.label}</span>
                  </motion.span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-0.5 rounded-full border whitespace-nowrap ${evalTier.pillClass}`}
                  >
                    <BadgeVectorIcon iconKey={evalTier.icon} className="w-3.5 h-3.5" />
                    <span>{activeTitle}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-orbitron font-bold text-xs text-[#9747FF] whitespace-nowrap">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{evalTier.powerScore} PWR</span>
                  </span>
                  <div className="w-28 h-2 rounded-full bg-[#FAF5FF] border border-[#DDC7F8] overflow-hidden">
                    <motion.div
                      initial={{ width: '15%' }}
                      animate={{ width: `${evalTier.progressPercent}%` }}
                      transition={{ delay: 1.2, duration: 0.9 }}
                      className="h-full bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#FFD500]"
                    />
                  </div>
                  {roomPlayer && (
                    <PlayerStatsBadges
                      highScore={roomPlayer.highScore}
                      winsCount={roomPlayer.winsCount}
                      matchesPlayed={roomPlayer.matchesPlayed}
                      size="xs"
                      showTitleBadge={false}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Contador de Pontos (Sobe 1 única vez em 1.4s e CRAVA na nota final!) */}
            <div className="text-right">
              <div className="text-xs font-medium text-[#545454]">
                Pontuação da Rodada ({ev.similarityPercent}% de proximidade)
              </div>
              <div className="font-orbitron font-black text-4xl lg:text-5xl bg-gradient-to-r from-[#9747FF] to-[#FF4A97] bg-clip-text text-transparent">
                {animatedScore} <span className="text-base font-sans">pts</span>
              </div>
            </div>
          </div>

          {/* Corpo Principal: Prompt + Mermã IA | 3 Barras + Conquistas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-5 flex flex-col gap-3.5">
              <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#E9D8FD]">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#545454] mb-1">
                  <PenTool className="w-3.5 h-3.5 text-[#9747FF]" />
                  <span>Prompt enviado por {ev.nickname}:</span>
                </div>
                <p className="font-prompt text-sm lg:text-base text-[#330043] italic">
                  “{ev.submittedPrompt || '(Nenhum prompt enviado)'}”
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ev.intentMatched.map((m, i) => (
                  <motion.span
                    key={`match-${i}`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [0.6, 1.08, 1], opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Acertou: {m}</span>
                  </motion.span>
                ))}
                {ev.intentMissed.map((m, i) => (
                  <motion.span
                    key={`miss-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Faltou: {m}</span>
                  </motion.span>
                ))}
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#DDC7F8] flex items-center gap-3">
                <img
                  src="/marca/menina-mdx.svg"
                  alt="Mermã IA"
                  decoding="async"
                  className="w-11 h-11 object-contain shrink-0"
                />
                <div className="text-xs text-[#330043] leading-relaxed">
                  <strong className="text-[#9747FF] block mb-0.5">Comentário da Mermã IA:</strong>
                  {ev.aiFeedback}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF7FF] border border-[#E9D8FD] space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#330043] mb-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#9747FF]" />
                      <span>Sujeito & Ação Principal</span>
                    </span>
                    <span className="font-orbitron text-[#9747FF]">
                      {ev.subjectScore} / 400 pts
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-purple-50 overflow-hidden border border-[#E9D8FD]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (ev.subjectScore / 400) * 100)}%`,
                      }}
                      transition={{ duration: 0.55, delay: 0.25 }}
                      className="h-full bg-gradient-to-r from-[#9747FF] to-[#FF4A97] rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#330043] mb-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#FF4A97]" />
                      <span>Estilo Visual & Estética</span>
                    </span>
                    <span className="font-orbitron text-[#9747FF]">{ev.styleScore} / 300 pts</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-purple-50 overflow-hidden border border-[#E9D8FD]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (ev.styleScore / 300) * 100)}%`,
                      }}
                      transition={{ duration: 0.55, delay: 0.65 }}
                      className="h-full bg-[#FF4A97] rounded-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#330043] mb-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#9747FF]" />
                      <span>Cenário & Iluminação</span>
                    </span>
                    <span className="font-orbitron text-[#9747FF]">
                      {ev.detailsScore} / 300 pts
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-purple-50 overflow-hidden border border-[#E9D8FD]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (ev.detailsScore / 300) * 100)}%`,
                      }}
                      transition={{ duration: 0.55, delay: 1.05 }}
                      className="h-full bg-[#9747FF] rounded-full"
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 1.35,
                    type: 'spring',
                    stiffness: 280,
                    damping: 16,
                  }}
                  className="pt-1 flex items-center justify-between"
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Bônus de Velocidade ({ev.lockedAtRemainingSeconds}s restantes)</span>
                  </span>
                  <span className="font-orbitron font-bold text-sm text-emerald-600">
                    +{ev.speedBonus} pts
                  </span>
                </motion.div>
              </div>

              <div>
                <div className="text-xs font-bold text-[#330043] mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#FF4A97]" />
                    <span>Conquistas Atribuídas nesta Rodada:</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#9747FF]">
                    Energizando Moldura & Poder da Jogadora
                  </span>
                </div>

                {roundAchIds.length === 0 ? (
                  <div className="p-3 rounded-2xl bg-[#FAF7FF] border border-[#E9D8FD] text-xs text-[#545454]">
                    Continue detalhando sujeito, estilo e cenário para desbloquear novas insígnias!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {roundAchIds.map((achId, idx) => {
                      const ach = ACHIEVEMENTS_CATALOG[achId];
                      if (!ach) return null;
                      const rarityMeta = getRarityLabel(ach.rarity);

                      return (
                        <motion.div
                          key={ach.id}
                          initial={{ opacity: 0, scale: 0.4, y: 24 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{
                            delay: 1.5 + idx * 0.4,
                            type: 'spring',
                            stiffness: 260,
                            damping: 18,
                          }}
                          className={`p-3 rounded-2xl border flex items-start gap-3 shadow-xs ${ach.badgeBgClass}`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/90 border border-[#DDC7F8] flex items-center justify-center shrink-0 mt-0.5">
                            <BadgeVectorIcon
                              iconKey={ach.icon}
                              className={`w-5 h-5 ${ach.colorClass}`}
                            />
                          </div>
                          <div className="min-w-0 flex-1 text-left">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-display text-xs lg:text-sm text-[#330043] truncate">
                                {ach.title}
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${rarityMeta.pill}`}
                              >
                                {rarityMeta.text}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#545454] leading-tight mt-0.5">
                              {ach.description}
                            </p>
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 border border-[#DDC7F8] font-orbitron font-bold text-[10px] text-[#9747FF]">
                              <Zap className="w-3 h-3 text-amber-500" />
                              <span>+{ach.powerBonus} PODER</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
});
