import React, { useEffect, useRef, useState } from 'react';
import { ACHIEVEMENTS_CATALOG, type AchievementId } from '../../shared/achievements';
import { BadgeVectorIcon } from './BadgeVectorIcon';

export interface AchievementMarqueeStripProps {
  achievementIds: AchievementId[];
  size?: 'sm' | 'md';
  className?: string;
}

export const AchievementMarqueeStrip: React.FC<AchievementMarqueeStripProps> = React.memo(
  ({ achievementIds, size = 'md', className = '' }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const singleTrackRef = useRef<HTMLDivElement | null>(null);
    const [shouldLoop, setShouldLoop] = useState<boolean>(false);

    useEffect(() => {
      const checkOverflow = () => {
        const container = containerRef.current;
        const track = singleTrackRef.current;
        if (!container || !track) return;
        setShouldLoop(track.scrollWidth > container.clientWidth + 4);
      };

      checkOverflow();

      const observer =
        typeof ResizeObserver !== 'undefined' ? new ResizeObserver(checkOverflow) : null;
      if (observer && containerRef.current) {
        observer.observe(containerRef.current);
      }
      window.addEventListener('resize', checkOverflow);
      return () => {
        if (observer) observer.disconnect();
        window.removeEventListener('resize', checkOverflow);
      };
    }, [achievementIds]);

    if (!achievementIds || achievementIds.length === 0) {
      return null;
    }

    const boxClass =
      size === 'sm' ? 'w-6 h-6 rounded-lg' : 'w-7 h-7 lg:w-8 lg:h-8 rounded-xl';
    const iconClass = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 lg:w-4 lg:h-4';
    const durationSec = Math.max(10, achievementIds.length * 2.2);

    const renderBadges = (keyPrefix: string) =>
      achievementIds.map((achId, idx) => {
        const ach = ACHIEVEMENTS_CATALOG[achId];
        if (!ach) return null;
        return (
          <span
            key={`${keyPrefix}-${achId}-${idx}`}
            title={`${ach.title} — ${ach.description}`}
            className={`${boxClass} border flex items-center justify-center shrink-0 shadow-2xs transition-transform hover:scale-105 ${ach.badgeBgClass}`}
          >
            <BadgeVectorIcon iconKey={ach.icon} className={`${iconClass} shrink-0 ${ach.colorClass}`} />
          </span>
        );
      });

    return (
      <div
        ref={containerRef}
        className={`w-full overflow-hidden relative flex items-center select-none ${
          shouldLoop ? 'mdx-marquee-mask' : ''
        } ${className}`}
      >
        {/* Medidor invisível da largura real de 1 conjunto de badges */}
        <div
          ref={singleTrackRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute left-0 top-0 flex items-center gap-1.5 whitespace-nowrap"
        >
          {renderBadges('measure')}
        </div>

        {shouldLoop ? (
          <div
            style={{ ['--marquee-duration' as string]: `${durationSec}s` }}
            className="mdx-marquee-track items-center py-0.5"
          >
            <div className="flex items-center gap-1.5 pr-1.5">{renderBadges('loop-a')}</div>
            <div className="flex items-center gap-1.5 pr-1.5" aria-hidden="true">
              {renderBadges('loop-b')}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 py-0.5 overflow-hidden">
            {renderBadges('static')}
          </div>
        )}
      </div>
    );
  }
);
