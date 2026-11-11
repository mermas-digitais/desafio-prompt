import React, { useEffect, useRef, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useGameStore } from '../store/useGameStore';
import { usePlayerSessionStore } from '../store/usePlayerSessionStore';

export const TopLoadingBar: React.FC = React.memo(() => {
  const isRoutePending = useRouterState({
    select: (s) => s.isLoading || s.status === 'pending',
  });
  const isSyncing = useGameStore((s) => s.isSyncing);
  const phase = useGameStore((s) => s.roomState.phase);
  const currentRevealIndex = useGameStore((s) => s.roomState.currentRevealIndex);
  const isSubmittingJoin = usePlayerSessionStore((s) => s.isSubmittingJoin);

  const isBusy = isRoutePending || isSyncing || isSubmittingJoin || phase === 'EVALUATING';

  const [visible, setVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const prevPhaseRef = useRef(phase);
  const prevRevealRef = useRef(currentRevealIndex);
  const finishTimeoutRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const triggerQuickSweep = () => {
    if (finishTimeoutRef.current) window.clearTimeout(finishTimeoutRef.current);
    if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);

    setVisible(true);
    setProgress(35);

    finishTimeoutRef.current = window.setTimeout(() => {
      setProgress(100);
      hideTimeoutRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }, 120);
  };

  // Dispara a barra superior suave apenas ao trocar de fase do jogo ou card de revelação
  useEffect(() => {
    if (prevPhaseRef.current !== phase || prevRevealRef.current !== currentRevealIndex) {
      prevPhaseRef.current = phase;
      prevRevealRef.current = currentRevealIndex;
      triggerQuickSweep();
    }
  }, [phase, currentRevealIndex]);

  // Mantém a barra progredindo enquanto há requisição ou navegação em andamento
  useEffect(() => {
    if (isBusy) {
      if (finishTimeoutRef.current) window.clearTimeout(finishTimeoutRef.current);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);

      setVisible(true);
      setProgress((prev) => (prev < 25 ? 28 : prev));

      const interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 88) return prev;
          return prev + Math.max(2, Math.round((90 - prev) * 0.18));
        });
      }, 160);

      return () => window.clearInterval(interval);
    }

    if (visible) {
      setProgress(100);
      hideTimeoutRef.current = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 220);
    }
    return undefined;
  }, [isBusy, visible]);

  useEffect(() => {
    return () => {
      if (finishTimeoutRef.current) window.clearTimeout(finishTimeoutRef.current);
      if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 inset-x-0 z-[120] h-[3px] overflow-hidden transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        style={{
          width: `${progress}%`,
          transition:
            progress === 0
              ? 'none'
              : progress === 100
              ? 'width 160ms ease-out'
              : 'width 240ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className="h-full bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#FFCD34] shadow-[0_0_12px_rgba(255,74,151,0.75)] rounded-r-full"
      />
    </div>
  );
});
