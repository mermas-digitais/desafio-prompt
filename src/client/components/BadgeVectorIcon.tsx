import React from 'react';
import {
  Sprout,
  Sparkles,
  Compass,
  Zap,
  Flame,
  Crown,
  Gem,
  Target,
  Palette,
  Cpu,
  Star,
  Globe,
  Trophy,
  Rocket,
  Gamepad2,
} from 'lucide-react';
import type { BadgeIconKey } from '../../shared/achievements';

export interface BadgeVectorIconProps {
  iconKey: BadgeIconKey | string;
  className?: string;
}

export const BadgeVectorIcon: React.FC<BadgeVectorIconProps> = ({
  iconKey,
  className = 'w-3.5 h-3.5 shrink-0',
}) => {
  switch (iconKey) {
    case 'sprout':
      return <Sprout className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'crown':
      return <Crown className={className} />;
    case 'gem':
      return <Gem className={className} />;
    case 'target':
      return <Target className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'star':
      return <Star className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'trophy':
      return <Trophy className={className} />;
    case 'rocket':
      return <Rocket className={className} />;
    case 'gamepad':
      return <Gamepad2 className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};
