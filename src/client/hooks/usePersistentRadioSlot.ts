import { useEffect, useRef, useState } from 'react';
import type { GamePhase } from '../../shared/types';

export interface RadioSlotRect {
  top: number;
  left: number;
  width: number;
}

export function usePersistentRadioSlot(phase: GamePhase) {
  const idleRadioSlotRef = useRef<HTMLDivElement | null>(null);
  const headerRadioSlotRef = useRef<HTMLDivElement | null>(null);
  const [radioRect, setRadioRect] = useState<RadioSlotRect | null>(null);

  useEffect(() => {
    const updateRadioPosition = () => {
      const targetEl =
        phase === 'IDLE' ? idleRadioSlotRef.current : headerRadioSlotRef.current;
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const nextTop = Math.round(rect.top);
        const nextLeft = Math.round(rect.left);
        const nextWidth = Math.round(rect.width);
        setRadioRect((prev) => {
          if (
            prev &&
            prev.top === nextTop &&
            prev.left === nextLeft &&
            prev.width === nextWidth
          ) {
            return prev;
          }
          return { top: nextTop, left: nextLeft, width: nextWidth };
        });
      }
    };

    updateRadioPosition();
    const t1 = setTimeout(updateRadioPosition, 40);
    const t2 = setTimeout(updateRadioPosition, 180);
    const t3 = setTimeout(updateRadioPosition, 380);

    window.addEventListener('resize', updateRadioPosition);
    window.addEventListener('scroll', updateRadioPosition, true);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateRadioPosition);
      if (idleRadioSlotRef.current) observer.observe(idleRadioSlotRef.current);
      if (headerRadioSlotRef.current) observer.observe(headerRadioSlotRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', updateRadioPosition);
      window.removeEventListener('scroll', updateRadioPosition, true);
      if (observer) observer.disconnect();
    };
  }, [phase]);

  return {
    idleRadioSlotRef,
    headerRadioSlotRef,
    radioRect,
  };
}
