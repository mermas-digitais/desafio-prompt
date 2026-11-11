import React from 'react';
import { motion } from 'framer-motion';
import { Award, Crown } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { AvatarBadge } from '../AvatarBadge';
import { PlayerStatsBadges } from '../PlayerStatsBadges';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import { AchievementMarqueeStrip } from '../AchievementMarqueeStrip';
import {
  getCareerAchievements,
  getPlayerPowerTier,
  type AvatarFrameId,
  type PlayerPowerLevel,
} from '../../../shared/achievements';

export const TVPodiumView: React.FC = React.memo(() => {
  const evaluations = useGameStore((s) => s.roomState.evaluations);
  const players = useGameStore((s) => s.roomState.players);
  const revealStepTimer = useGameStore((s) => s.roomState.revealStepTimer);

  const sorted = [...evaluations].sort((a, b) => b.totalScore - a.totalScore);
  const topThree = sorted.slice(0, 3);
  const honorableMentions = sorted.slice(3, 5);
  const podiumOrder =
    topThree.length === 3
      ? [
          { ev: topThree[1], rank: 2 },
          { ev: topThree[0], rank: 1 },
          { ev: topThree[2], rank: 3 },
        ]
      : topThree.map((ev, i) => ({ ev, rank: i + 1 }));

  return (
    <motion.div
      key="phase-podium"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between items-center text-center py-1 gap-3 relative"
    >
      {/* Cabeçalho Festivo do Pódio com Assets do Evento */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4 mb-1">
          <img
            src="/marca/competicoes.svg"
            alt=""
            decoding="async"
            className="w-11 h-11 object-contain mdx-gpu-tilt-a"
          />
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white border border-[#DDC7F8] text-xs font-semibold text-[#9747FF] shadow-xs">
            <Crown className="w-4 h-4 text-[#FF4A97]" />
            <span>Resultado Oficial da Arena MDX 2026</span>
          </span>
          <img
            src="/marca/robo-sozinho.svg"
            alt=""
            decoding="async"
            className="w-10 h-10 object-contain mdx-gpu-tilt-b"
          />
        </div>
        <h2 className="font-display text-3xl lg:text-4xl text-[#330043]">
          Pódio dos Mestres do Prompt!
        </h2>
      </div>

      {/* Palco de 3 Degraus */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl items-end">
        {podiumOrder.map(({ ev, rank }, idx) => {
          const roomPlayer = players.find((p) => p.slot === ev.slot);
          const isWinner = rank === 1;
          const tier = getPlayerPowerTier({
            highScore: roomPlayer?.highScore || ev.totalScore,
            winsCount: roomPlayer?.winsCount || (isWinner ? 1 : 0),
            matchesPlayed: roomPlayer?.matchesPlayed || 1,
          });
          const careerBadges = getCareerAchievements({
            highScore: roomPlayer?.highScore || ev.totalScore,
            winsCount: roomPlayer?.winsCount || (isWinner ? 1 : 0),
            matchesPlayed: roomPlayer?.matchesPlayed || 1,
          });

          return (
            <motion.div
              key={ev.playerId}
              initial={{ opacity: 0, y: 40, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: isWinner ? 0.25 : idx * 0.12,
                type: 'spring',
                stiffness: 240,
                damping: 18,
              }}
              className={`bg-white rounded-3xl p-6 flex flex-col items-center justify-between text-center relative ${
                isWinner
                  ? 'border-gradient border-2 border-[#FF4A97] shadow-[0_20px_48px_rgba(255,74,151,0.2)] md:pb-10 md:-translate-y-3 z-10'
                  : 'border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)]'
              }`}
            >
              {isWinner ? (
                <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-[#9747FF] to-[#FF4A97] text-white text-xs font-bold mb-2 shadow-xs whitespace-nowrap">
                  <Crown className="w-4 h-4 text-[#FFCD34]" />
                  <span>1º Lugar Campeã • +1 Vitória</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF5FF] border border-[#E9D8FD] text-[#545454] text-xs font-semibold mb-2 whitespace-nowrap">
                  <Award className="w-3.5 h-3.5 text-[#9747FF]" />
                  <span>{rank}º Lugar</span>
                </span>
              )}

              <AvatarBadge
                avatar={ev.avatar}
                size={isWinner ? 'xl' : 'lg'}
                isBot={ev.isBot}
                rank={rank}
                highlight={isWinner}
                frameId={(ev.newFrameId as AvatarFrameId) || tier.frameId}
                powerLevel={(ev.newPowerLevel as PlayerPowerLevel) || tier.level}
                className="my-2"
              />

              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border mt-1 whitespace-nowrap ${tier.pillClass}`}
              >
                <BadgeVectorIcon iconKey={tier.icon} className="w-3 h-3" />
                <span>{ev.newTitle || tier.title}</span>
              </span>

              <h3 className="font-display text-2xl text-[#330043] mt-1">{ev.nickname}</h3>

              <div className="font-orbitron font-black text-3xl lg:text-4xl bg-gradient-to-r from-[#9747FF] to-[#FF4A97] bg-clip-text text-transparent my-1.5">
                {ev.totalScore}{' '}
                <span className="text-xs font-sans font-semibold text-[#545454]">pts</span>
              </div>

              {careerBadges.length > 0 && (
                <div className="w-full px-3 mb-2">
                  <AchievementMarqueeStrip
                    achievementIds={careerBadges}
                    size="md"
                    className="justify-center"
                  />
                </div>
              )}

              {roomPlayer && (
                <PlayerStatsBadges
                  highScore={roomPlayer.highScore}
                  winsCount={roomPlayer.winsCount}
                  matchesPlayed={roomPlayer.matchesPlayed}
                  size="xs"
                  showTitleBadge={false}
                  className="justify-center mt-1"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Participantes de 4º e 5º Lugar na Sala */}
      {honorableMentions.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-4xl">
          {honorableMentions.map((ev, idx) => {
            const rank = idx + 4;
            const roomPlayer = players.find((p) => p.slot === ev.slot);
            const tier = getPlayerPowerTier({
              highScore: roomPlayer?.highScore || ev.totalScore,
              winsCount: roomPlayer?.winsCount || 0,
              matchesPlayed: roomPlayer?.matchesPlayed || 1,
            });
            return (
              <div
                key={ev.playerId}
                className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-[#DDC7F8] shadow-2xs"
              >
                <span className="px-2.5 py-1 rounded-xl bg-[#FAF5FF] border border-[#DDC7F8] font-display text-xs text-[#6E4F7D]">
                  {rank}º Lugar
                </span>
                <AvatarBadge
                  avatar={ev.avatar}
                  size="sm"
                  isBot={ev.isBot}
                  frameId={(ev.newFrameId as AvatarFrameId) || tier.frameId}
                  powerLevel={(ev.newPowerLevel as PlayerPowerLevel) || tier.level}
                />
                <div className="flex flex-col items-start text-left">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-[1px] rounded-full text-[9px] font-bold border ${tier.pillClass}`}
                  >
                    <BadgeVectorIcon iconKey={tier.icon} className="w-2.5 h-2.5" />
                    <span>{tier.shortTitle}</span>
                  </span>
                  <span className="font-display text-sm text-[#330043]">{ev.nickname}</span>
                </div>
                <span className="font-orbitron font-bold text-sm text-[#9747FF] ml-2">
                  {ev.totalScore} pts
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="px-6 py-2.5 rounded-full bg-white border border-[#DDC7F8] text-xs md:text-sm text-[#545454] shadow-xs">
        Retornando ao Ranking Geral em <strong className="text-[#330043]">{revealStepTimer}s</strong>
        ...
      </div>
    </motion.div>
  );
});
