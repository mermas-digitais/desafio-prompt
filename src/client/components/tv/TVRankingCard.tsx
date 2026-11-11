import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Award,
  Crown,
  Gamepad2,
  Minus,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useTVUiStore } from '../../store/useTVUiStore';
import { AvatarBadge } from '../AvatarBadge';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import { AchievementMarqueeStrip } from '../AchievementMarqueeStrip';
import {
  RankingMovementBadge,
  useLeaderboardMovements,
} from '../RankingMovementBadge';
import {
  getCareerAchievements,
  getPlayerPowerTier,
} from '../../../shared/achievements';
import type { LeaderboardEntry } from '../../../shared/types';

export const TVRankingCard: React.FC = React.memo(() => {
  const leaderboards = useGameStore((s) => s.roomState.leaderboards);
  const isConnected = useGameStore((s) => s.isConnected);
  const isSyncing = useGameStore((s) => s.isSyncing);
  const activeTab = useTVUiStore((s) => s.activeTab);
  const selectTab = useTVUiStore((s) => s.selectTab);
  const cycleNextTabIfIdle = useTVUiStore((s) => s.cycleNextTabIfIdle);

  const [shimmerWaveKey, setShimmerWaveKey] = useState<number>(0);
  const [isShimmering, setIsShimmering] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(50);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<number | null>(null);
  const prevTabRef = useRef(activeTab);

  const currentLeaderboard: LeaderboardEntry[] =
    leaderboards[activeTab] || leaderboards.general || [];
  const totalEntries = currentLeaderboard.length;
  const visibleLeaderboard = currentLeaderboard.slice(0, displayLimit);
  const isInitialLoading = !isConnected && isSyncing && totalEntries === 0;
  const movementsByPlayer = useLeaderboardMovements(leaderboards, activeTab);

  // Pausa o auto-scroll quando o usuário interage (mouse hover, wheel ou touch)
  const handleUserInteraction = useCallback(() => {
    setIsPaused(true);
    if (pauseTimerRef.current) {
      window.clearTimeout(pauseTimerRef.current);
    }
    pauseTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, 12000);
  }, []);

  // Auto-scroll contínuo pelo telão: avança seções da lista a cada 7 segundos
  useEffect(() => {
    if (isPaused) return undefined;

    const interval = setInterval(() => {
      const container = listContainerRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      // Se não há overflow suficiente para rolar, não faz nada
      if (scrollHeight <= clientHeight + 10) return;

      const maxScroll = scrollHeight - clientHeight;
      const isAtBottom = scrollTop >= maxScroll - 16;

      if (isAtBottom) {
        // Ao alcançar o final da lista, rola suavemente para o topo e rotaciona o filtro
        container.scrollTo({ top: 0, behavior: 'smooth' });
        cycleNextTabIfIdle();
      } else {
        // Rola para a próxima seção (cerca de 72% da altura visível para manter contexto)
        const scrollStep = Math.min(clientHeight * 0.72, maxScroll - scrollTop);
        container.scrollBy({ top: scrollStep, behavior: 'smooth' });
      }
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, cycleNextTabIfIdle]);

  // Ao trocar de filtro (Geral / Só Pontos / Só Vitórias), reseta o scroll para o topo e dispara Shimmer
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      setDisplayLimit(50);
      listContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      setShimmerWaveKey((k) => k + 1);
      setIsShimmering(true);
      const timer = window.setTimeout(() => {
        setIsShimmering(false);
      }, 650);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [activeTab]);

  return (
    <div className="flex-1 min-h-0 overflow-hidden rounded-3xl bg-white border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] p-4 lg:p-5 flex flex-col justify-between gap-2.5">
      {/* Topo do Card de Ranking + Segmented Control Suave */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[#F3E8FF] shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/marca/competicoes.svg"
            alt="Competições MDX"
            decoding="async"
            className="w-9 h-9 object-contain shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#9747FF] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#FF4A97]" />
              <span>Hall da Fama • MDX STEAM 2026</span>
            </div>
            <h1 className="font-display text-xl lg:text-2xl text-[#330043] leading-tight">
              Ranking de Participantes
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#F5F0FF] p-1 rounded-2xl border border-[#DDC7F8] inline-flex items-center gap-1">
            {(
              [
                { id: 'general', label: 'Poder (PWR)', Icon: Zap },
                { id: 'points', label: 'Recorde', Icon: Trophy },
                { id: 'wins', label: 'Vitórias', Icon: Crown },
              ] as const
            ).map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectTab(id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive ? 'text-[#330043]' : 'text-[#6E4F7D] hover:text-[#330043]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tvRankingSegmentActive"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-xl bg-white shadow-sm border border-[#DDC7F8]/80"
                    />
                  )}
                  <Icon
                    className={`relative z-10 w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-[#FF4A97]' : 'text-[#9747FF]/70'
                    }`}
                  />
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lista com Rolagem Contínua e Auto-scroll para Telão */}
      <div
        ref={listContainerRef}
        onMouseEnter={handleUserInteraction}
        onWheel={handleUserInteraction}
        onTouchStart={handleUserInteraction}
        className="flex-1 min-h-0 overflow-y-auto pr-1.5 space-y-1.5 overscroll-contain"
      >
        {isInitialLoading ? (
          <div className="space-y-1.5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border border-[#E9D8FD] bg-white mdx-skeleton-shimmer"
              >
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-[#EDE2FF]" />
                  <div className="w-10 h-10 rounded-xl bg-[#EDE2FF]" />
                  <div className="space-y-1.5">
                    <div className="w-24 h-3.5 rounded-full bg-[#EDE2FF]" />
                    <div className="w-32 h-4 rounded-full bg-[#E2D4F8]" />
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-1.5 px-3">
                  <div className="w-7 h-7 rounded-xl bg-[#F3E8FF]" />
                  <div className="w-7 h-7 rounded-xl bg-[#F3E8FF]" />
                  <div className="w-7 h-7 rounded-xl bg-[#F3E8FF]" />
                  <div className="w-7 h-7 rounded-xl bg-[#F3E8FF]" />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-20 h-7 rounded-xl bg-[#F3E8FF]" />
                  <div className="w-12 h-7 rounded-xl bg-[#F3E8FF]" />
                  <div className="w-12 h-7 rounded-xl bg-[#F3E8FF]" />
                </div>
              </div>
            ))}
          </div>
        ) : visibleLeaderboard.length === 0 ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-[#FAF7FF]/60 rounded-2xl border border-dashed border-[#DDC7F8]">
            <div className="w-12 h-12 rounded-2xl bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center mb-2 shadow-2xs">
              <Trophy className="w-6 h-6 text-[#9747FF]" />
            </div>
            <p className="font-display text-lg lg:text-xl text-[#330043] max-w-xl">
              O Ranking Oficial MDX 2026 está aberto!
            </p>
            <p className="text-xs lg:text-sm text-[#545454] mt-1 max-w-lg">
              Escaneie o QR Code ao lado, jogue a primeira rodada e inaugure o topo do placar!
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {visibleLeaderboard.map((entry, idx) => {
              const pos = entry.rank;
              const tier = getPlayerPowerTier({
                highScore: entry.highScore,
                totalScore: entry.totalScore,
                winsCount: entry.winsCount,
                matchesPlayed: entry.matchesPlayed,
              });
              const unlockedAchievements = getCareerAchievements({
                highScore: entry.highScore,
                totalScore: entry.totalScore,
                winsCount: entry.winsCount,
                matchesPlayed: entry.matchesPlayed,
              });

              const posBadgeStyle =
                pos === 1
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : pos === 2
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : pos === 3
                  ? 'bg-orange-100 text-orange-900 border-orange-300'
                  : 'bg-[#FAF5FF] text-[#6E4F7D] border-[#DDC7F8]';

              return (
                <motion.div
                  layout="position"
                  key={entry.playerId}
                  transition={{
                    layout: { type: 'spring', stiffness: 420, damping: 34 },
                  }}
                  className={`relative overflow-hidden flex items-center justify-between gap-3 px-3.5 py-2 rounded-2xl border transition-colors ${
                    pos === 1
                      ? 'bg-[#FAF5FF]/90 border-[#9747FF]/50 shadow-xs'
                      : 'bg-white border-[#DDC7F8]/80 hover:bg-[#FAF7FF]'
                  }`}
                >
                  {isShimmering && (
                    <span
                      key={`shimmer-${shimmerWaveKey}`}
                      aria-hidden="true"
                      style={{ animationDelay: `${idx * 30}ms` }}
                      className="mdx-shimmer-overlay"
                    />
                  )}
                  {/* Bloco Esquerdo: Indicador Discreto ANTES da Posição + Avatar (com Lv na moldura) + Badge de Título ACIMA do Nickname */}
                  <div className="flex items-center gap-2 min-w-0 shrink-0">
                    <div className="flex items-center gap-1 shrink-0">
                      <RankingMovementBadge
                        movement={movementsByPlayer[entry.playerId]}
                        size="md"
                      />

                      <span
                        className={`w-9 h-9 rounded-xl border font-display text-xs flex items-center justify-center gap-0.5 shrink-0 whitespace-nowrap ${posBadgeStyle}`}
                      >
                        {pos === 1 ? (
                          <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                        ) : pos <= 3 ? (
                          <Award className="w-3 h-3 shrink-0" />
                        ) : null}
                        <span>{pos}º</span>
                      </span>
                    </div>

                    <AvatarBadge
                      avatar={entry.avatar}
                      size="sm"
                      highlight={pos === 1}
                      frameId={tier.frameId}
                      powerLevel={tier.level}
                    />

                    <div className="flex flex-col items-start min-w-[140px] max-w-[190px]">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-[1px] rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 border leading-tight ${tier.pillClass}`}
                      >
                        <BadgeVectorIcon iconKey={tier.icon} className="w-2.5 h-2.5 shrink-0" />
                        <span>{tier.shortTitle}</span>
                      </span>

                      <span className="font-display text-sm lg:text-base text-[#330043] truncate max-w-full leading-tight mt-0.5">
                        {entry.nickname}
                      </span>
                    </div>
                  </div>

                  {/* Extensão Central da Linha: Marquee contínuo de Conquistas */}
                  <div className="flex-1 min-w-0 px-2 overflow-hidden">
                    <AchievementMarqueeStrip
                      achievementIds={unlockedAchievements}
                      size="md"
                    />
                  </div>

                  {/* Bloco Direito: Estatísticas de Pontos, Vitórias e Partidas */}
                  <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    {activeTab === 'general' ? (
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-[#FAF0FF] to-[#F5E6FF] border border-[#9747FF]/40 text-[#4C1D95] font-display text-xs lg:text-sm font-bold shadow-2xs whitespace-nowrap"
                        title={`Poder Acumulado: ${entry.powerScore ?? tier.powerScore} PWR (${entry.totalScore} pts acumulados)`}
                      >
                        <Zap className="w-3.5 h-3.5 text-[#9747FF] fill-[#9747FF] shrink-0" />
                        <span>{entry.powerScore ?? tier.powerScore} PWR</span>
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-display text-xs lg:text-sm whitespace-nowrap"
                        title="Maior Pontuação da Rodada"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                        <span>{entry.highScore} pts</span>
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl border font-display text-xs lg:text-sm whitespace-nowrap ${
                        activeTab === 'wins'
                          ? 'bg-gradient-to-r from-pink-100 to-rose-100 border-[#FF4A97] text-[#D01F6B] font-bold shadow-2xs'
                          : 'bg-pink-50 border-pink-200 text-[#D01F6B]'
                      }`}
                      title="Vitórias"
                    >
                      <Crown className="w-3.5 h-3.5 text-[#FF4A97] fill-[#FF4A97]/20 shrink-0" />
                      <span>{entry.winsCount}</span>
                    </span>

                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-[#F5F0FF] border border-[#DDC7F8] text-[#4C1D95] font-display text-xs lg:text-sm whitespace-nowrap"
                      title="Partidas Jogadas"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-[#9747FF] shrink-0" />
                      <span>{entry.matchesPlayed}</span>
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Botão de Exibir Mais se houver mais de 50 no ranking */}
            {totalEntries > displayLimit && (
              <div className="pt-2 pb-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    handleUserInteraction();
                    setDisplayLimit((prev) => prev + 50);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#DDC7F8] text-xs font-bold text-[#9747FF] transition-colors cursor-pointer shadow-2xs"
                >
                  Exibir mais participantes ({displayLimit} de {totalEntries})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rodapé limpo do Card de Ranking */}
      <div className="pt-2 border-t border-[#F3E8FF] flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E4F7D] shrink-0">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Maior pontuação do evento:{' '}
            <strong className="text-[#330043]">
              {leaderboards.stats.highestScoreEver || 0} pts
            </strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#9747FF]" />
            Participantes:{' '}
            <strong className="text-[#330043]">{leaderboards.stats.totalPlayers || 0}</strong>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold">
          <span className="inline-flex items-center gap-1 text-emerald-700">
            <ArrowUp className="w-3 h-3 stroke-[2.75] text-emerald-600" /> Subiu
          </span>
          <span className="inline-flex items-center gap-1 text-rose-600">
            <ArrowDown className="w-3 h-3 stroke-[2.75] text-rose-500" /> Desceu
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <Minus className="w-3 h-3 stroke-[2.5] text-slate-400" /> Manteve
          </span>
          <span className="text-[#DDC7F8]">•</span>
          <span className="inline-flex items-center gap-1 text-[#4C1D95]">
            <Zap className="w-3.5 h-3.5 text-[#9747FF] fill-[#9747FF]" /> Poder (PWR)
          </span>
          <span className="inline-flex items-center gap-1 text-amber-800">
            <Trophy className="w-3.5 h-3.5 text-amber-500" /> Recorde
          </span>
          <span className="inline-flex items-center gap-1 text-[#D01F6B]">
            <Crown className="w-3.5 h-3.5 text-[#FF4A97]" /> Vitórias
          </span>
          <span className="inline-flex items-center gap-1 text-[#6E4F7D]">
            <Gamepad2 className="w-3.5 h-3.5 text-[#9747FF]" /> Partidas
          </span>
        </div>
      </div>
    </div>
  );
});
