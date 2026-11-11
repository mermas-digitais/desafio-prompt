import React from 'react';
import { motion } from 'framer-motion';
import { Award, Crown, Sparkles, Tv, Zap } from 'lucide-react';
import { AvatarBadge } from '../AvatarBadge';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import { getPlayerPowerTier } from '../../../shared/achievements';
import type { GamePhase, PlayerRoundEvaluation } from '../../../shared/types';

export interface PlayRoomRoundRankingProps {
  evaluations: PlayerRoundEvaluation[];
  myPlayerId?: string;
  currentRevealIndex?: number;
  phase: GamePhase;
}

export const PlayRoomRoundRanking: React.FC<PlayRoomRoundRankingProps> = React.memo(
  ({ evaluations, myPlayerId, currentRevealIndex = 0, phase }) => {
    if (!evaluations || evaluations.length === 0) return null;

    // Ordena do maior para o menor total de pontos da rodada
    const sorted = [...evaluations].sort((a, b) => b.totalScore - a.totalScore);

    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mermas-card p-4 md:p-5 flex flex-col gap-3 overflow-hidden border-2 border-[#DDC7F8]"
      >
        {/* Topo do Placar da Partida */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#F3E8FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#FF4A97]" />
            </div>
            <div>
              <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider text-[#9747FF]">
                {phase === 'PODIUM' ? 'Classificação Final da Partida' : 'Acompanhando o Telão'}
              </div>
              <h3 className="font-display text-base md:text-lg text-[#330043] leading-tight">
                Pontuação Geral da Sala ({evaluations.length} jogadoras)
              </h3>
            </div>
          </div>

          {phase === 'REVEALING' && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF5FF] border border-[#DDC7F8] text-[10px] font-bold text-[#9747FF]">
              <Tv className="w-3 h-3 text-[#FF4A97]" />
              <span>Revelando 1 a 1</span>
            </span>
          )}
        </div>

        {/* Lista de Jogadoras Ordenadas */}
        <div className="flex flex-col gap-2">
          {sorted.map((ev, idx) => {
            const rank = idx + 1;
            const isMe = ev.playerId === myPlayerId;
            const isCurrentlyOnTv =
              phase === 'REVEALING' &&
              evaluations[currentRevealIndex]?.playerId === ev.playerId;

            const tier = getPlayerPowerTier({
              highScore: ev.totalScore,
              winsCount: rank === 1 ? 1 : 0,
              matchesPlayed: 1,
            });

            const rankBadgeStyle =
              rank === 1
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : rank === 2
                ? 'bg-slate-100 text-slate-700 border-slate-300'
                : rank === 3
                ? 'bg-orange-100 text-orange-900 border-orange-300'
                : 'bg-[#FAF5FF] text-[#6E4F7D] border-[#DDC7F8]';

            return (
              <motion.div
                key={ev.playerId}
                layout="position"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`relative overflow-hidden flex items-center justify-between gap-2.5 p-2.5 rounded-2xl border transition-all ${
                  isMe
                    ? 'bg-gradient-to-r from-[#FFF5FA] to-[#F7F0FF] border-[#FF4A97]/60 shadow-[0_4px_16px_rgba(255,74,151,0.12)] ring-1 ring-[#FF4A97]/30'
                    : 'bg-white border-[#EDE2FF] hover:bg-[#FAF7FF]'
                } ${isCurrentlyOnTv ? 'ring-2 ring-[#9747FF] shadow-sm' : ''}`}
              >
                {/* Lado Esquerdo: Posição + Avatar + Nick/Título */}
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg border font-display text-xs flex items-center justify-center shrink-0 ${rankBadgeStyle}`}
                  >
                    {rank === 1 ? <Crown className="w-3.5 h-3.5 text-amber-600" /> : `${rank}º`}
                  </span>

                  <AvatarBadge
                    avatar={ev.avatar}
                    size="sm"
                    isBot={ev.isBot}
                    highlight={rank === 1 || isMe}
                  />

                  <div className="flex flex-col items-start min-w-0">
                    <div className="flex items-center gap-1.5 max-w-full">
                      <span className="font-display text-sm text-[#330043] truncate">
                        {ev.nickname}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#FF4A97] text-white text-[9px] font-quicksand font-extrabold uppercase shrink-0">
                          Você
                        </span>
                      )}
                      {isCurrentlyOnTv && (
                        <span className="hidden xs:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#FAF5FF] border border-[#9747FF] text-[#9747FF] text-[9px] font-bold shrink-0">
                          <Tv className="w-2.5 h-2.5" />
                          <span>No Telão</span>
                        </span>
                      )}
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-bold border ${tier.pillClass} mt-0.5`}
                    >
                      <BadgeVectorIcon iconKey={tier.icon} className="w-2 h-2 shrink-0" />
                      <span className="truncate max-w-[120px]">
                        {ev.newTitle || tier.shortTitle}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Lado Direito: Scores das 3 camadas + Total */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-[10px] font-quicksand font-bold">
                    <span className="px-1.5 py-0.5 rounded-md bg-pink-50 text-[#FF4A97] border border-pink-100" title="Sujeito">
                      S:{ev.subjectScore}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-[#9747FF] border border-purple-100" title="Estilo">
                      E:{ev.styleScore}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100" title="Cenário">
                      C:{ev.detailsScore}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-orbitron font-extrabold text-sm md:text-base text-[#330043]">
                      {ev.totalScore}{' '}
                      <span className="text-[10px] font-sans font-normal text-[#6E4F7D]">pts</span>
                    </div>
                    {ev.speedBonus > 0 && (
                      <div className="text-[9px] font-quicksand font-bold text-emerald-600 flex items-center justify-end gap-0.5">
                        <Zap className="w-2.5 h-2.5" />
                        <span>+{ev.speedBonus} spd</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rodapé informativo */}
        <div className="pt-2 border-t border-[#F3E8FF] flex items-center justify-between text-[11px] font-quicksand text-[#6E4F7D]">
          <span>
            {phase === 'PODIUM'
              ? '🏆 Pódio finalizado no telão'
              : '⚡ Acompanhe as reações e o pódio no telão da arena!'}
          </span>
          <span className="font-bold text-[#9747FF]">MDX STEAM 2026</span>
        </div>
      </motion.div>
    );
  }
);
