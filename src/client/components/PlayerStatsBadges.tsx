import React from 'react';
import { Zap, Crown, Gamepad2 } from 'lucide-react';
import {
  ACHIEVEMENTS_CATALOG,
  getCareerAchievements,
  getPlayerPowerTier,
} from '../../shared/achievements';
import { BadgeVectorIcon } from './BadgeVectorIcon';

interface PlayerStatsBadgesProps {
  highScore: number;
  totalScore?: number;
  winsCount: number;
  matchesPlayed: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showLabels?: boolean;
  showTitleBadge?: boolean;
  showPowerScore?: boolean;
  showCareerAchievements?: boolean;
}

export const PlayerStatsBadges: React.FC<PlayerStatsBadgesProps> = React.memo(
  ({
    highScore = 0,
    totalScore,
    winsCount = 0,
    matchesPlayed = 0,
    size = 'sm',
    className = '',
    showTitleBadge = true,
    showPowerScore = false,
    showCareerAchievements = false,
  }) => {
    const powerTier = getPlayerPowerTier({
      highScore,
      totalScore,
      winsCount,
      matchesPlayed,
    });

    const careerAchievements = showCareerAchievements
      ? getCareerAchievements({ highScore, totalScore, winsCount, matchesPlayed })
      : [];

    const sizeStyles = {
      xs: 'px-2 py-1 text-[11px] gap-1 rounded-full',
      sm: 'px-2.5 py-1 text-xs gap-1 rounded-full',
      md: 'px-3 py-1.5 text-xs gap-1.5 rounded-full',
      lg: 'px-3.5 py-1.5 text-sm gap-1.5 rounded-full',
    }[size];

    const iconSize = {
      xs: 'w-3 h-3 shrink-0',
      sm: 'w-3.5 h-3.5 shrink-0',
      md: 'w-3.5 h-3.5 shrink-0',
      lg: 'w-4 h-4 shrink-0',
    }[size];

    return (
      <div
        className={`flex items-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0 select-none ${className}`}
      >
        {showTitleBadge && (
          <div
            className={`whitespace-nowrap shrink-0 inline-flex items-center leading-none font-quicksand font-bold border ${powerTier.pillClass} ${sizeStyles}`}
            title={`${powerTier.title} (${powerTier.powerScore} PWR)`}
          >
            <BadgeVectorIcon iconKey={powerTier.icon} className="w-3 h-3 shrink-0" />
            <span>{powerTier.shortTitle}</span>
          </div>
        )}

        {showPowerScore && (
          <div
            className={`whitespace-nowrap shrink-0 inline-flex items-center leading-none font-quicksand font-bold bg-[#FAF0FF] border border-[#9747FF]/30 text-[#4C1D95] ${sizeStyles}`}
            title={`Poder Acumulado: ${powerTier.powerScore} PWR`}
          >
            <Zap className={`${iconSize} text-[#9747FF] fill-[#9747FF]`} />
            <span>{powerTier.powerScore} PWR</span>
          </div>
        )}

        <div
          className={`whitespace-nowrap shrink-0 inline-flex items-center leading-none font-quicksand font-bold bg-amber-50 border border-amber-200 text-amber-900 ${sizeStyles}`}
          title={`Maior pontuação: ${highScore} pts`}
        >
          <Zap className={`${iconSize} text-amber-500 fill-amber-400`} />
          <span>{highScore} pts</span>
        </div>

        <div
          className={`whitespace-nowrap shrink-0 inline-flex items-center leading-none font-quicksand font-bold bg-pink-50 border border-pink-200 text-[#D01F6B] ${sizeStyles}`}
          title={`${winsCount} ${winsCount === 1 ? 'vitória' : 'vitórias'}`}
        >
          <Crown className={`${iconSize} text-[#FF4A97] fill-[#FF4A97]/20`} />
          <span>{winsCount}</span>
        </div>

        <div
          className={`whitespace-nowrap shrink-0 inline-flex items-center leading-none font-quicksand font-bold bg-[#F5F0FF] border border-[#DDC7F8] text-[#4C1D95] ${sizeStyles}`}
          title={`${matchesPlayed} ${matchesPlayed === 1 ? 'partida' : 'partidas'}`}
        >
          <Gamepad2 className={`${iconSize} text-[#9747FF]`} />
          <span>{matchesPlayed}</span>
        </div>

        {showCareerAchievements &&
          careerAchievements.map((achId) => {
            const def = ACHIEVEMENTS_CATALOG[achId];
            if (!def) return null;
            return (
              <span
                key={achId}
                title={`${def.title}: ${def.description}`}
                className={`whitespace-nowrap shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full border ${def.badgeBgClass}`}
              >
                <BadgeVectorIcon iconKey={def.icon} className="w-3 h-3" />
              </span>
            );
          })}
      </div>
    );
  }
);
