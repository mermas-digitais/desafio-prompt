import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Minus, Sparkles } from 'lucide-react';
import type { LeaderboardEntry, LeaderboardsPayload } from '../../shared/types';

export type RankingTabId = 'general' | 'points' | 'wins';

export type MovementDirection = 'up' | 'down' | 'same' | 'new';

export interface PlayerRankingMovement {
  direction: MovementDirection;
  delta: number; // positivo = subiu N posições, negativo = desceu N posições, 0 = manteve
  previousRank: number | null;
}

interface StoredTabSnapshot {
  rank: number;
  prevRank: number | null;
  signature: string;
}

type StoredSnapshotsByTab = Record<RankingTabId, Record<string, StoredTabSnapshot>>;

const STORAGE_KEY = 'mdx26_ranking_movement_v1';

function loadSnapshots(): StoredSnapshotsByTab {
  if (typeof window === 'undefined') {
    return { general: {}, points: {}, wins: {} };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { general: {}, points: {}, wins: {} };
    const parsed = JSON.parse(raw) as Partial<StoredSnapshotsByTab>;
    return {
      general: parsed.general || {},
      points: parsed.points || {},
      wins: parsed.wins || {},
    };
  } catch {
    return { general: {}, points: {}, wins: {} };
  }
}

function saveSnapshots(data: StoredSnapshotsByTab): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignora quota
  }
}

function buildEntrySignature(entry: LeaderboardEntry): string {
  return `${entry.highScore}:${entry.winsCount}:${entry.matchesPlayed}:${entry.totalScore}`;
}

/**
 * Calcula e persiste as movimentações de posição do Ranking de Competição
 * (subidas ▲ +N, descidas ▼ -N, estreias NOVO e manutenção —).
 */
export function useLeaderboardMovements(
  leaderboards: LeaderboardsPayload,
  activeTab: RankingTabId
): Record<string, PlayerRankingMovement> {
  const [snapshots, setSnapshots] = useState<StoredSnapshotsByTab>(() => loadSnapshots());

  // Atualiza snapshots sempre que o leaderboard receber novos dados do servidor
  useEffect(() => {
    const current = loadSnapshots();
    let changed = false;

    (['general', 'points', 'wins'] as const).forEach((tab) => {
      const list = leaderboards[tab] || [];
      const tabMap = { ...(current[tab] || {}) };

      list.forEach((entry, idx) => {
        const currentRank = idx + 1;
        const sig = buildEntrySignature(entry);
        const existing = tabMap[entry.playerId];

        if (!existing) {
          tabMap[entry.playerId] = {
            rank: currentRank,
            prevRank: null,
            signature: sig,
          };
          changed = true;
        } else if (existing.rank !== currentRank || existing.signature !== sig) {
          tabMap[entry.playerId] = {
            rank: currentRank,
            prevRank: existing.rank !== currentRank ? existing.rank : existing.prevRank,
            signature: sig,
          };
          changed = true;
        }
      });

      current[tab] = tabMap;
    });

    if (changed) {
      saveSnapshots(current);
      setSnapshots({ ...current });
    }
  }, [leaderboards]);

  return useMemo(() => {
    const result: Record<string, PlayerRankingMovement> = {};
    const activeList = leaderboards[activeTab] || [];

    // Mapas auxiliares de posição entre abas para comparação competitiva quando ainda não houve mudança de rodada salva
    const generalRankMap = new Map<string, number>();
    (leaderboards.general || []).forEach((e, i) => generalRankMap.set(e.playerId, i + 1));

    const pointsRankMap = new Map<string, number>();
    (leaderboards.points || []).forEach((e, i) => pointsRankMap.set(e.playerId, i + 1));

    const winsRankMap = new Map<string, number>();
    (leaderboards.wins || []).forEach((e, i) => winsRankMap.set(e.playerId, i + 1));

    // Ordem cronológica/veteranismo (quem tem mais partidas como baseline)
    const veteranBaselineOrder = [...activeList].sort((a, b) => {
      if (b.matchesPlayed !== a.matchesPlayed) return b.matchesPlayed - a.matchesPlayed;
      return b.totalScore - a.totalScore;
    });
    const veteranRankMap = new Map<string, number>();
    veteranBaselineOrder.forEach((e, i) => veteranRankMap.set(e.playerId, i + 1));

    const tabSnapshots = snapshots[activeTab] || {};

    activeList.forEach((entry, idx) => {
      const currentRank = idx + 1;
      const snap = tabSnapshots[entry.playerId];

      // 1. Se existe movimentação histórica real registrada entre partidas
      if (snap && snap.prevRank !== null && snap.prevRank !== currentRank) {
        const delta = snap.prevRank - currentRank;
        result[entry.playerId] = {
          direction: delta > 0 ? 'up' : 'down',
          delta,
          previousRank: snap.prevRank,
        };
        return;
      }

      // 2. Se estamos em 'points' ou 'wins', compara com a posição no Ranking Geral
      if (activeTab !== 'general') {
        const refRank = generalRankMap.get(entry.playerId);
        if (refRank && refRank !== currentRank) {
          const delta = refRank - currentRank;
          result[entry.playerId] = {
            direction: delta > 0 ? 'up' : 'down',
            delta,
            previousRank: refRank,
          };
          return;
        }
      }

      // 3. Se a participante acabou de estrear (1 partida jogada) e ainda não tinha histórico anterior
      if (entry.matchesPlayed === 1 && (!snap || snap.prevRank === null)) {
        result[entry.playerId] = {
          direction: 'new',
          delta: 0,
          previousRank: null,
        };
        return;
      }

      // 4. No Ranking Geral sem histórico prévio na sessão, compara posição atual com baseline de veterania/pontos
      const baselineRank =
        activeTab === 'general'
          ? veteranRankMap.get(entry.playerId) ?? pointsRankMap.get(entry.playerId) ?? currentRank
          : winsRankMap.get(entry.playerId) ?? currentRank;

      if (baselineRank !== currentRank) {
        const delta = baselineRank - currentRank;
        result[entry.playerId] = {
          direction: delta > 0 ? 'up' : 'down',
          delta,
          previousRank: baselineRank,
        };
        return;
      }

      result[entry.playerId] = {
        direction: 'same',
        delta: 0,
        previousRank: currentRank,
      };
    });

    return result;
  }, [leaderboards, activeTab, snapshots]);
}

export interface RankingMovementBadgeProps {
  movement?: PlayerRankingMovement;
  size?: 'sm' | 'md';
}

export const RankingMovementBadge: React.FC<RankingMovementBadgeProps> = React.memo(
  ({ movement, size = 'md' }) => {
    const dir = movement?.direction || 'same';
    const absDelta = Math.abs(movement?.delta || 0);

    const widthClass = size === 'sm' ? 'w-6 text-[9px]' : 'w-7 text-[10px]';
    const iconSize = size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3';

    if (dir === 'up') {
      return (
        <span
          title={
            movement?.previousRank
              ? `Subiu ${absDelta} ${absDelta === 1 ? 'posição' : 'posições'} (era ${movement.previousRank}º)`
              : `Subiu ${absDelta} ${absDelta === 1 ? 'posição' : 'posições'}`
          }
          className={`inline-flex items-center justify-center gap-0.5 font-quicksand font-bold text-emerald-600/90 shrink-0 whitespace-nowrap select-none ${widthClass}`}
        >
          <ArrowUp className={`${iconSize} stroke-[2.5] text-emerald-500 shrink-0`} />
          <span>{absDelta}</span>
        </span>
      );
    }

    if (dir === 'down') {
      return (
        <span
          title={
            movement?.previousRank
              ? `Desceu ${absDelta} ${absDelta === 1 ? 'posição' : 'posições'} (era ${movement.previousRank}º)`
              : `Desceu ${absDelta} ${absDelta === 1 ? 'posição' : 'posições'}`
          }
          className={`inline-flex items-center justify-center gap-0.5 font-quicksand font-bold text-rose-500/90 shrink-0 whitespace-nowrap select-none ${widthClass}`}
        >
          <ArrowDown className={`${iconSize} stroke-[2.5] text-rose-400 shrink-0`} />
          <span>{absDelta}</span>
        </span>
      );
    }

    if (dir === 'new') {
      return (
        <span
          title="Nova entrada no Ranking!"
          className={`inline-flex items-center justify-center gap-0.5 font-quicksand font-bold text-[#9747FF]/85 shrink-0 whitespace-nowrap select-none ${widthClass}`}
        >
          <Sparkles className={`${iconSize} text-[#FF4A97]/80 shrink-0`} />
        </span>
      );
    }

    return (
      <span
        title="Manteve a posição"
        className={`inline-flex items-center justify-center font-quicksand font-semibold text-slate-300 shrink-0 whitespace-nowrap select-none ${widthClass}`}
      >
        <Minus className={`${iconSize} stroke-[2] text-slate-300 shrink-0`} />
      </span>
    );
  }
);
