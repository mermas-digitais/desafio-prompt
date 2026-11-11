import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Share2 } from 'lucide-react';
import { AvatarBadge } from '../AvatarBadge';
import type { PlayerRoundEvaluation } from '../../../shared/types';

export interface PlayMobilePodiumProps {
  evaluations: PlayerRoundEvaluation[];
  myPlayerId: string | undefined;
  onOpenShareCard: () => void;
}

const STEP_STYLES: Record<number, { height: string; bg: string; label: string }> = {
  1: {
    height: 'h-24',
    bg: 'bg-gradient-to-b from-[#FFCD34] to-[#FFB020] text-[#5A3A00]',
    label: '1º',
  },
  2: {
    height: 'h-16',
    bg: 'bg-gradient-to-b from-[#E8E2F2] to-[#CFC4E0] text-[#3F3550]',
    label: '2º',
  },
  3: {
    height: 'h-12',
    bg: 'bg-gradient-to-b from-[#FFC9A3] to-[#F59E6B] text-[#5A2A0A]',
    label: '3º',
  },
};

export const PlayMobilePodium: React.FC<PlayMobilePodiumProps> = React.memo(
  ({ evaluations, myPlayerId, onOpenShareCard }) => {
    const sorted = [...evaluations].sort((a, b) => b.totalScore - a.totalScore);
    const top = sorted.slice(0, 3);
    const rest = sorted.slice(3);
    const order =
      top.length === 3
        ? [
            { ev: top[1], rank: 2 },
            { ev: top[0], rank: 1 },
            { ev: top[2], rank: 3 },
          ]
        : top.map((ev, i) => ({ ev, rank: i + 1 }));

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mermas-card p-4 flex flex-col gap-3 overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider text-[#9747FF]">
              Resultado da Partida
            </div>
            <h3 className="font-display text-lg text-[#330043] leading-tight">
              Pódio dos Mestres do Prompt
            </h3>
          </div>
          <img src="/marca/competicoes.svg" alt="" className="w-9 h-9 object-contain" />
        </div>

        {/* Degraus */}
        <div className="grid grid-cols-3 gap-2 items-end pt-2">
          {order.map(({ ev, rank }, idx) => {
            const step = STEP_STYLES[rank];
            const isMe = ev.playerId === myPlayerId;
            return (
              <motion.div
                key={ev.playerId}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: rank === 1 ? 0.35 : 0.1 + idx * 0.1,
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                }}
                className="flex flex-col items-center min-w-0"
              >
                {rank === 1 && <Crown className="w-5 h-5 text-[#FFB020] mb-0.5" />}
                <AvatarBadge
                  avatar={ev.avatar}
                  size={rank === 1 ? 'md' : 'sm'}
                  isBot={ev.isBot}
                  highlight={rank === 1 || isMe}
                />
                <span
                  className={`font-display text-xs mt-1 truncate max-w-full ${
                    isMe ? 'text-[#FF4A97]' : 'text-[#330043]'
                  }`}
                >
                  {isMe ? 'Você' : ev.nickname}
                </span>
                <span className="font-orbitron font-bold text-[11px] text-[#9747FF]">
                  {ev.totalScore} pts
                </span>
                <div
                  className={`w-full mt-1.5 rounded-t-2xl flex items-start justify-center pt-1.5 font-display text-lg ${step.height} ${step.bg} ${
                    isMe ? 'ring-2 ring-[#FF4A97] ring-offset-2 ring-offset-white' : ''
                  }`}
                >
                  {step.label}
                </div>
              </motion.div>
            );
          })}
        </div>

        {rest.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {rest.map((ev, i) => {
              const isMe = ev.playerId === myPlayerId;
              return (
                <div
                  key={ev.playerId}
                  className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl border ${
                    isMe ? 'bg-[#FFF0F7] border-[#FF4A97]/40' : 'bg-[#FAF7FF] border-[#EDE2FF]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-display text-xs text-[#6E4F7D] w-6">{i + 4}º</span>
                    <AvatarBadge avatar={ev.avatar} size="sm" isBot={ev.isBot} />
                    <span className="font-display text-xs text-[#330043] truncate">
                      {isMe ? 'Você' : ev.nickname}
                    </span>
                  </div>
                  <span className="font-orbitron font-bold text-[11px] text-[#9747FF]">
                    {ev.totalScore} pts
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <motion.button
          type="button"
          onClick={onOpenShareCard}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full mt-1 bg-purple-pink bg-gradient-to-r from-[#9747FF] to-[#FF4A97] py-3.5 rounded-2xl font-semibold text-sm text-white shadow-[0_10px_24px_rgba(255,74,151,0.25)] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Criar meu card para as redes</span>
        </motion.button>
      </motion.div>
    );
  }
);
