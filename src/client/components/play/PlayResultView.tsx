import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Crown,
  Flame,
  Globe,
  MessageSquareHeart,
  Palette,
  Share2,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { AvatarBadge } from '../AvatarBadge';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import {
  ACHIEVEMENTS_CATALOG,
  type AchievementId,
  type AvatarFrameId,
  type PlayerPowerTierInfo,
} from '../../../shared/achievements';
import type { PlayerRoundEvaluation } from '../../../shared/types';

export interface PlayResultViewProps {
  myEvaluation: PlayerRoundEvaluation | undefined;
  myPowerTier: PlayerPowerTierInfo;
  onOpenRanking: () => void;
  onOpenShareCard?: () => void;
  fullPrompt?: string;
}

export const PlayResultView: React.FC<PlayResultViewProps> = React.memo(
  ({ myEvaluation, myPowerTier, onOpenRanking, onOpenShareCard, fullPrompt: customFullPrompt }) => {
    const storePrompt = useGameStore((s) => s.roomState.challenge?.fullPrompt);
    const fullPrompt = customFullPrompt ?? storePrompt;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col gap-4"
      >
        {myEvaluation ? (
          <div className="mermas-card p-5 md:p-6 flex flex-col gap-5">
            {myEvaluation.leveledUpTitle && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                className="p-3.5 rounded-2xl bg-pink-yellow text-white shadow-md flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider opacity-95 inline-flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Subiu de Título & Moldura!</span>
                  </div>
                  <div className="font-display text-sm md:text-base leading-tight mt-0.5">
                    {myEvaluation.previousTitle} → {myEvaluation.newTitle}
                  </div>
                </div>
                <AvatarBadge
                  avatar={myEvaluation.avatar}
                  size="sm"
                  frameId={(myEvaluation.newFrameId as AvatarFrameId) || myPowerTier.frameId}
                  powerLevel={myEvaluation.newPowerLevel || myPowerTier.level}
                  isPoweringUp
                />
              </motion.div>
            )}

            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full font-quicksand font-bold text-xs whitespace-nowrap ${
                  myEvaluation.isWinner
                    ? 'bg-pink-yellow text-white shadow-xs'
                    : 'bg-[#F5F0FF] border border-[#DDC7F8] text-[#6E4F7D]'
                }`}
              >
                {myEvaluation.isWinner && <Crown className="w-3.5 h-3.5 shrink-0" />}
                <span>
                  {myEvaluation.isWinner ? '1º Lugar na Rodada!' : 'Resultado da Rodada'}
                </span>
              </span>

              {myEvaluation.isNewHighScore && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-quicksand font-bold text-xs whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Novo Recorde!</span>
                </span>
              )}
            </div>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="text-center py-4 px-3 rounded-2xl bg-[#FAF7FF] border border-[#DDC7F8]"
            >
              <div className="font-quicksand text-xs font-bold text-[#6E4F7D]">
                Sua pontuação final
              </div>
              <div className="font-display text-4xl text-[#330043] mt-0.5">
                {myEvaluation.totalScore}{' '}
                <span className="text-base font-quicksand font-bold text-[#9747FF]">pts</span>
              </div>
              {myEvaluation.speedBonus > 0 && (
                <div className="text-xs font-quicksand font-bold text-emerald-700 mt-1 inline-flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inclui +{myEvaluation.speedBonus} pts de bônus de velocidade</span>
                </div>
              )}
            </motion.div>

            {myEvaluation.roundAchievements && myEvaluation.roundAchievements.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-quicksand font-bold text-[#330043]">
                  <span className="inline-flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#FF4A97]" />
                    <span>Conquistas ganhas nesta rodada:</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {myEvaluation.roundAchievements.map((achKey, idx) => {
                    const ach = ACHIEVEMENTS_CATALOG[achKey as AchievementId];
                    if (!ach) return null;
                    return (
                      <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.12 }}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 ${ach.badgeBgClass}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-white/85 border border-current/15 flex items-center justify-center shrink-0">
                            <BadgeVectorIcon iconKey={ach.icon} className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-display text-xs text-[#330043] truncate">
                                {ach.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-full bg-white/80 text-[9px] font-quicksand font-extrabold uppercase">
                                {ach.rarity}
                              </span>
                            </div>
                            <p className="font-quicksand text-[11px] opacity-90 leading-snug">
                              {ach.description}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-white/90 border border-[#DDC7F8] font-quicksand font-extrabold text-xs text-[#9747FF] whitespace-nowrap">
                          +{ach.powerBonus} PWR
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              {[
                {
                  label: 'Sujeito',
                  icon: <Target className="w-3.5 h-3.5 text-[#FF4A97]" />,
                  score: myEvaluation.subjectScore,
                  max: 400,
                  barClass: 'bg-[#FF4A97]',
                },
                {
                  label: 'Estilo',
                  icon: <Palette className="w-3.5 h-3.5 text-[#9747FF]" />,
                  score: myEvaluation.styleScore,
                  max: 300,
                  barClass: 'bg-[#9747FF]',
                },
                {
                  label: 'Cenário',
                  icon: <Globe className="w-3.5 h-3.5 text-amber-500" />,
                  score: myEvaluation.detailsScore,
                  max: 300,
                  barClass: 'bg-amber-400',
                },
              ].map((item) => {
                const pct = Math.max(
                  0,
                  Math.min(100, Math.round((item.score / item.max) * 100))
                );
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-quicksand font-bold">
                      <span className="inline-flex items-center gap-1.5 text-[#330043]">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>
                      <span className="text-[#6E4F7D]">
                        {item.score} / {item.max} pts
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#F5F0FF] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className={`h-full rounded-full ${item.barClass}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {myEvaluation.intentMatched.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-quicksand font-bold text-[#6E4F7D]">
                  Elementos que você mandou super bem:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {myEvaluation.intentMatched.map((concept, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-quicksand font-bold text-xs"
                    >
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>{concept}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#FEF0ED] border border-pink-200 flex items-start gap-3">
              <img
                src="/marca/menina-mdx.svg"
                alt="Mermã IA"
                decoding="async"
                className="w-12 h-12 object-contain shrink-0"
              />
              <div className="text-xs font-quicksand text-[#330043] leading-relaxed">
                <strong className="text-[#D01F6B] inline-flex items-center gap-1 mb-0.5">
                  <MessageSquareHeart className="w-3.5 h-3.5 shrink-0" />
                  <span>Comentário da Mermã IA:</span>
                </strong>
                <p>{myEvaluation.aiFeedback}</p>
              </div>
            </div>

            {fullPrompt && (
              <div className="p-3.5 rounded-2xl bg-[#FAF7FF] border border-[#DDC7F8] text-xs font-quicksand">
                <div className="font-bold text-[#6E4F7D] mb-1">Prompt original da imagem:</div>
                <p className="text-[#330043] italic">“{fullPrompt}”</p>
              </div>
            )}

            <div className="flex flex-col gap-2.5 pt-1">
              {onOpenShareCard && (
                <button
                  type="button"
                  onClick={onOpenShareCard}
                  className="w-full bg-gradient-to-r from-[#FF4A97] via-[#9747FF] to-[#FFCD34] py-3.5 px-5 rounded-2xl font-display text-sm text-white shadow-[0_10px_24px_rgba(151,71,255,0.25)] flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 transition-all active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4 text-white" />
                  <span>Criar Card para Redes Sociais</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenRanking}
                className="w-full bg-white hover:bg-[#F5F0FF] border-2 border-[#DDC7F8] py-3 px-5 rounded-2xl font-quicksand font-bold text-sm text-[#4C1D95] shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trophy className="w-4 h-4 text-[#9747FF]" />
                <span>Ver Ranking Geral</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mermas-card p-6 text-center space-y-2">
            <h3 className="font-display text-xl text-[#330043]">Rodada finalizando no telão</h3>
            <p className="font-quicksand text-xs text-[#545454]">
              Em instantes a sala abrirá para a próxima partida!
            </p>
          </div>
        )}
      </motion.div>
    );
  }
);
