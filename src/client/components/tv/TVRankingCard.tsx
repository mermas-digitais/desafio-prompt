import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Crown,
  Gamepad2,
  ListOrdered,
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

const PAGE_SIZE = 5;

export const TVRankingCard: React.FC = React.memo(() => {
  const leaderboards = useGameStore((s) => s.roomState.leaderboards);
  const isConnected = useGameStore((s) => s.isConnected);
  const isSyncing = useGameStore((s) => s.isSyncing);
  const activeTab = useTVUiStore((s) => s.activeTab);
  const selectTab = useTVUiStore((s) => s.selectTab);
  const cycleNextTabIfIdle = useTVUiStore((s) => s.cycleNextTabIfIdle);

  const [shimmerWaveKey, setShimmerWaveKey] = useState<number>(0);
  const [isShimmering, setIsShimmering] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(50);
  const prevTabRef = useRef(activeTab);

  const currentLeaderboard: LeaderboardEntry[] =
    leaderboards[activeTab] || leaderboards.general || [];
  const totalEntries = currentLeaderboard.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages - 1);
  const startIdx = safePage * PAGE_SIZE;

  // Em modo telão exibe 5 por vez com transição suave; em modo expandido exibe a lista completa de até 50+
  const visibleLeaderboard = isExpandedView
    ? currentLeaderboard.slice(0, displayLimit)
    : currentLeaderboard.slice(startIdx, startIdx + PAGE_SIZE);

  const isInitialLoading = !isConnected && isSyncing && totalEntries === 0;
  const movementsByPlayer = useLeaderboardMovements(leaderboards, activeTab);

  // Ciclo automático de páginas a cada 8 segundos em modo telão
  useEffect(() => {
    if (isExpandedView || totalPages <= 1) return undefined;
    const interval = setInterval(() => {
      setCurrentPage((prev) => {
        const next = prev + 1;
        if (next >= totalPages) {
          cycleNextTabIfIdle();
          return 0;
        }
        return next;
      });
    }, 7500);
    return () => clearInterval(interval);
  }, [totalPages, isExpandedView, cycleNextTabIfIdle]);

  // Ao trocar de filtro (Geral / Só Pontos / Só Vitórias), reseta para a página 1 e dispara Shimmer
  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      prevTabRef.current = activeTab;
      setCurrentPage(0);
      setShimmerWaveKey((k) => k + 1);
      setIsShimmering(true);
      const timer = window.setTimeout(() => {
        setIsShimmering(false);
      }, 680);
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
          {/* Controles de Paginação (1–5, 6–10...) no Modo Telão */}
          {totalPages > 1 && !isExpandedView && (
            <div className="bg-[#FAF5FF] px-2 py-1 rounded-2xl border border-[#DDC7F8] flex items-center gap-1 text-xs text-[#6E4F7D]">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                title="Página anterior"
                className="p-1 rounded-lg hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold whitespace-nowrap px-1">
                {startIdx + 1}–{Math.min(totalEntries, startIdx + PAGE_SIZE)}{' '}
                <span className="text-[#9747FF]">de {totalEntries}</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage >= totalPages - 1}
                title="Próxima página"
                className="p-1 rounded-lg hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Botão de Alternar entre Modo Telão (1-5) e Modo Expandido (Até 50) */}
          {totalEntries > 5 && (
            <button
              type="button"
              onClick={() => setIsExpandedView((v) => !v)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                isExpandedView
                  ? 'bg-[#330043] text-white border-[#330043] shadow-xs'
                  : 'bg-white text-[#6E4F7D] hover:text-[#330043] border-[#DDC7F8]'
              }`}
              title={isExpandedView ? 'Voltar para modo automático' : 'Expandir lista completa com rolagem'}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>{isExpandedView ? 'Modo Telão (1–5)' : `Ver Todos (${Math.min(50, totalEntries)})`}</span>
            </button>
          )}

          <div className="bg-[#F5F0FF] p-1 rounded-2xl border border-[#DDC7F8] inline-flex items-center gap-1">
            {(
              [
                { id: 'general', label: 'Geral', Icon: Trophy },
                { id: 'points', label: 'Só Pontos', Icon: Zap },
                { id: 'wins', label: 'Só Vitórias', Icon: Crown },
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

      {/* Linhas do Ranking (Sem AnimatePresence mode="wait" para NUNCA piscar a tela) */}
      <div
        className={`flex-1 min-h-0 ${
          isExpandedView
            ? 'overflow-y-auto pr-1 space-y-1.5'
            : 'overflow-hidden flex flex-col justify-center'
        }`}
      >
        {isInitialLoading ? (
          <div className="space-y-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
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
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center bg-[#FAF7FF]/60 rounded-2xl border border-dashed border-[#DDC7F8]">
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
                      style={{ animationDelay: `${idx * 45}ms` }}
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

                  {/* Extensão Central da Linha: Usa TODO o espaço disponível e faz Loop Contínuo (Marquee) se ultrapassar o limite (Sem barra de scroll!) */}
                  <div className="flex-1 min-w-0 px-2 overflow-hidden">
                    <AchievementMarqueeStrip
                      achievementIds={unlockedAchievements}
                      size="md"
                    />
                  </div>

                  {/* Bloco Direito: Estatísticas de Pontos, Vitórias e Partidas */}
                  <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-display text-xs lg:text-sm whitespace-nowrap"
                      title="Maior Pontuação"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                      <span>{entry.highScore} pts</span>
                    </span>

                    <span
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-pink-50 border border-pink-200 text-[#D01F6B] font-display text-xs lg:text-sm whitespace-nowrap"
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

            {/* Botão de Exibir Mais Participantes ao rolar no modo expandido */}
            {isExpandedView && totalEntries > displayLimit && (
              <div className="pt-2 pb-1 flex justify-center">
                <button
                  type="button"
                  onClick={() => setDisplayLimit((prev) => prev + 25)}
                  className="px-4 py-1.5 rounded-full bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#DDC7F8] text-xs font-bold text-[#9747FF] transition-colors cursor-pointer"
                >
                  Exibir mais participantes (+25)
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
          <span className="inline-flex items-center gap-1 text-amber-800">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Pontos
          </span>
          <span className="inline-flex items-center gap-1 text-[#D01F6B]">
            <Crown className="w-3.5 h-3.5 text-[#FF4A97]" /> Vitórias
          </span>
          <span className="inline-flex items-center gap-1 text-[#4C1D95]">
            <Gamepad2 className="w-3.5 h-3.5 text-[#9747FF]" /> Partidas
          </span>
        </div>
      </div>
    </div>
  );
});
