import React from 'react';
import { AccessibleDialog } from '../AccessibleDialog';
import { Crown, Gamepad2, Sparkles, Trophy, X, Zap } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { usePlayerSessionStore } from '../../store/usePlayerSessionStore';
import { resolveChallengeImageUrl } from '../../helpers/imageHelpers';
import { AvatarBadge } from '../AvatarBadge';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import { PlayerStatsBadges } from '../PlayerStatsBadges';
import { AchievementMarqueeStrip } from '../AchievementMarqueeStrip';
import {
  RankingMovementBadge,
  useLeaderboardMovements,
} from '../RankingMovementBadge';
import {
  getCareerAchievements,
  getPlayerPowerTier,
} from '../../../shared/achievements';

export const PlayImageZoomModal: React.FC = React.memo(() => {
  const isZoomOpen = usePlayerSessionStore((s) => s.isZoomOpen);
  const setIsZoomOpen = usePlayerSessionStore((s) => s.setIsZoomOpen);
  const challenge = useGameStore((s) => s.roomState.challenge);
  const imageUrl = challenge ? resolveChallengeImageUrl(challenge.id, challenge.imageUrl) : null;

  return (
    <AccessibleDialog open={Boolean(isZoomOpen && imageUrl)} title="Imagem ampliada" onClose={() => setIsZoomOpen(false)}>
      {imageUrl && (
        <div>
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="self-end mb-3 px-4 py-1.5 rounded-full bg-white text-[#330043] font-quicksand font-bold text-xs inline-flex items-center gap-1 shadow-md cursor-pointer"
          >
            <X className="w-4 h-4" /> Fechar
          </button>
          <img
            src={imageUrl}
            alt="Imagem ampliada"
            decoding="async"
            className="max-w-full max-h-[80vh] rounded-3xl border-2 border-white shadow-2xl object-contain"
          />
        </div>
      )}
    </AccessibleDialog>
  );
});

export const PlayRankingModal: React.FC = React.memo(() => {
  const isRankingModalOpen = usePlayerSessionStore((s) => s.isRankingModalOpen);
  const setIsRankingModalOpen = usePlayerSessionStore((s) => s.setIsRankingModalOpen);
  const mobileRankingTab = usePlayerSessionStore((s) => s.mobileRankingTab);
  const setMobileRankingTab = usePlayerSessionStore((s) => s.setMobileRankingTab);
  const profile = usePlayerSessionStore((s) => s.profile);
  const leaderboards = useGameStore((s) => s.roomState.leaderboards);

  const entries = leaderboards[mobileRankingTab] || [];
  const movementsByPlayer = useLeaderboardMovements(leaderboards, mobileRankingTab);

  return (
    <AccessibleDialog open={isRankingModalOpen} title="Ranking Mermãs Digitais" onClose={() => setIsRankingModalOpen(false)}>
      {isRankingModalOpen && (
        <div>
          <div className="w-full flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDC7F8]">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FF4A97]" />
                <h3 className="font-display text-lg text-[#330043]">Ranking Mermãs Digitais</h3>
              </div>
              <button
                type="button"
                aria-label="Fechar ranking"
                onClick={() => setIsRankingModalOpen(false)}
                className="buttonCircle w-8 h-8 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3">
              {(
                [
                  { id: 'general', label: 'Poder (PWR)', icon: <Zap className="w-3.5 h-3.5" /> },
                  { id: 'points', label: 'Recorde', icon: <Trophy className="w-3.5 h-3.5" /> },
                  { id: 'wins', label: 'Vitórias', icon: <Crown className="w-3.5 h-3.5" /> },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={mobileRankingTab === t.id}
                  onClick={() => setMobileRankingTab(t.id)}
                  className={`py-2 px-2 rounded-xl font-quicksand font-bold text-xs border inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    mobileRankingTab === t.id
                      ? 'bg-purple-pink text-white border-transparent shadow-xs'
                      : 'bg-[#FAF7FF] border-[#DDC7F8] text-[#6E4F7D] hover:text-[#330043]'
                  }`}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {entries.length === 0 ? (
                <div className="py-10 text-center font-quicksand text-xs text-[#6E4F7D] flex flex-col items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-[#9747FF]/60" />
                  <span>Nenhuma partida registrada ainda. Seja a primeira!</span>
                </div>
              ) : (
                entries.map((entry) => {
                  const isMe = profile && entry.playerId === profile.id;
                  const entryTier = getPlayerPowerTier(entry);
                  const unlockedAchievements = getCareerAchievements(entry);
                  return (
                    <div
                      key={entry.playerId}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                        isMe
                          ? 'bg-[#FEF0ED] border-[#FF4A97]'
                          : 'bg-[#FAF7FF] border-[#DDC7F8]/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex items-center gap-1 shrink-0">
                          <RankingMovementBadge
                            movement={movementsByPlayer[entry.playerId]}
                            size="sm"
                          />
                          <span
                            className={`w-6 h-6 rounded-full font-quicksand font-bold text-xs flex items-center justify-center shrink-0 ${
                              entry.rank === 1
                                ? 'bg-pink-yellow text-white'
                                : 'bg-white border border-[#DDC7F8] text-[#330043]'
                            }`}
                          >
                            {entry.rank}º
                          </span>
                        </div>
                        <AvatarBadge
                          avatar={entry.avatar}
                          size="sm"
                          frameId={entryTier.frameId}
                          powerLevel={entryTier.level}
                        />
                        <div className="min-w-0 flex-1 flex flex-col items-start">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-[1px] rounded-full text-[10px] font-bold border ${entryTier.pillClass}`}
                          >
                            <BadgeVectorIcon iconKey={entryTier.icon} className="w-2.5 h-2.5 shrink-0" />
                            <span>{entryTier.shortTitle}</span>
                          </span>
                          <div className="font-quicksand font-bold text-sm text-[#330043] truncate max-w-full mt-0.5">
                            {entry.nickname} {isMe && <span className="text-[#FF4A97]">(Você)</span>}
                          </div>
                          {mobileRankingTab === 'general' ? (
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FAF0FF] to-[#F5E6FF] border border-[#9747FF]/40 text-[#4C1D95] font-quicksand font-bold text-xs shadow-2xs">
                                <Zap className="w-3 h-3 text-[#9747FF] fill-[#9747FF]" />
                                {entry.powerScore ?? entryTier.powerScore} PWR
                              </span>
                              <span className="text-[10px] text-[#6E4F7D] font-medium">
                                ({entry.totalScore} pts acum. • {entry.matchesPlayed} {entry.matchesPlayed === 1 ? 'partida' : 'partidas'})
                              </span>
                            </div>
                          ) : null}
                          {unlockedAchievements.length > 0 && (
                            <div className="w-full mt-1">
                              <AchievementMarqueeStrip
                                achievementIds={unlockedAchievements}
                                size="sm"
                              />
                            </div>
                          )}
                          <div className="mt-1.5 overflow-x-auto no-scrollbar">
                            <PlayerStatsBadges
                              highScore={entry.highScore}
                              totalScore={entry.totalScore}
                              winsCount={entry.winsCount}
                              matchesPlayed={entry.matchesPlayed}
                              size="xs"
                              showTitleBadge={false}
                              showLabels={false}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {entries.length > 0 && (
                <div className="pt-2 text-center text-[11px] font-semibold text-[#6E4F7D]">
                  Exibindo {entries.length} {entries.length === 1 ? 'jogadora' : 'jogadoras'} no Ranking{' '}
                  {mobileRankingTab === 'general'
                    ? 'por Poder (PWR)'
                    : mobileRankingTab === 'points'
                    ? 'por Recorde'
                    : 'por Vitórias'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AccessibleDialog>
  );
});
