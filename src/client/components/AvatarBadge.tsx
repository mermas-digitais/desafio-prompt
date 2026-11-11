import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Compass, Zap, Palette, Cpu, Flame, Crown, Star, Gem, Sprout } from 'lucide-react';
import type { AvatarId, PresetAvatarId } from '../../shared/types';
import type { AvatarFrameId } from '../../shared/achievements';

export interface AvatarOption {
  id: PresetAvatarId;
  label: string;
  src: string;
  accent: string;
  bgGradient: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  {
    id: 'menina-mdx',
    label: 'Mermã MDX',
    src: '/marca/menina-mdx.svg',
    accent: 'border-[#FF4A97]/50',
    bgGradient: 'bg-[#FEF0ED]',
  },
  {
    id: 'ia',
    label: 'Mente IA',
    src: '/marca/ia.svg',
    accent: 'border-[#DDC7F8]',
    bgGradient: 'bg-[#F5F0FF]',
  },
  {
    id: 'robo',
    label: 'Robô Bot',
    src: '/marca/robo-sozinho.svg',
    accent: 'border-[#DDC7F8]',
    bgGradient: 'bg-[#F5F0FF]',
  },
  {
    id: 'game',
    label: 'Gamer Pop',
    src: '/marca/game-sozinho.svg',
    accent: 'border-[#FF4A97]/50',
    bgGradient: 'bg-[#FEF0ED]',
  },
  {
    id: 'codigo',
    label: 'Dev Código',
    src: '/marca/codigo-sozinho.svg',
    accent: 'border-[#DDC7F8]',
    bgGradient: 'bg-[#F5F0FF]',
  },
  {
    id: 'lampada',
    label: 'Ideia STEAM',
    src: '/marca/lampada-sozinho.svg',
    accent: 'border-amber-300',
    bgGradient: 'bg-amber-50/80',
  },
  {
    id: 'ciencia',
    label: 'Cientista',
    src: '/marca/ciencia.svg',
    accent: 'border-[#DDC7F8]',
    bgGradient: 'bg-[#F5F0FF]',
  },
  {
    id: 'selo',
    label: 'Estrela MDX',
    src: '/marca/selo-sozinho.svg',
    accent: 'border-[#FF4A97]/50',
    bgGradient: 'bg-[#FEF0ED]',
  },
];

export function isCustomPhotoAvatar(avatar?: AvatarId | string): boolean {
  if (!avatar || typeof avatar !== 'string') return false;
  return avatar.startsWith('data:image/') || avatar.startsWith('http');
}

export function getAvatarMeta(avatar?: AvatarId | string): AvatarOption {
  return AVATAR_OPTIONS.find((a) => a.id === avatar) || AVATAR_OPTIONS[0];
}

interface AvatarBadgeProps {
  avatar: AvatarId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isBot?: boolean;
  rank?: number;
  highlight?: boolean;
  frameId?: AvatarFrameId;
  powerLevel?: number;
  isPoweringUp?: boolean;
  className?: string;
}

const SIZE_MAP = {
  sm: {
    box: 'w-10 h-10 rounded-xl',
    padSvg: 'p-1.5',
    outerRadius: 'rounded-xl',
    botTag: 'text-[9px] px-1.5 py-0.5 -bottom-2',
    rankBadge: 'w-5 h-5 text-[10px] -top-1.5 -right-1.5',
    levelTag: 'text-[9px] px-1.5 py-[1px] -bottom-1.5',
  },
  md: {
    box: 'w-14 h-14 rounded-2xl',
    padSvg: 'p-2',
    outerRadius: 'rounded-2xl',
    botTag: 'text-[10px] px-2 py-0.5 -bottom-2',
    rankBadge: 'w-6 h-6 text-xs -top-1.5 -right-1.5',
    levelTag: 'text-[9px] px-1.5 py-0.5 -bottom-2',
  },
  lg: {
    box: 'w-20 h-20 rounded-2xl',
    padSvg: 'p-2.5',
    outerRadius: 'rounded-2xl',
    botTag: 'text-[10px] px-2.5 py-0.5 -bottom-2.5',
    rankBadge: 'w-7 h-7 text-xs -top-2 -right-2',
    levelTag: 'text-[10px] px-2 py-0.5 -bottom-2.5',
  },
  xl: {
    box: 'w-24 h-24 rounded-3xl',
    padSvg: 'p-3',
    outerRadius: 'rounded-3xl',
    botTag: 'text-[11px] px-2.5 py-0.5 -bottom-2.5',
    rankBadge: 'w-8 h-8 text-sm -top-2 -right-2',
    levelTag: 'text-[10px] px-2.5 py-0.5 -bottom-2.5',
  },
};

function resolveFrameStyle(frameId?: AvatarFrameId, powerLevel?: number): {
  wrapperClass: string;
  levelNumber: number;
  levelBadgeClass: string;
} {
  const effectiveFrame: AvatarFrameId =
    frameId ||
    (powerLevel && powerLevel >= 10
      ? 'frame-legend'
      : powerLevel === 9
      ? 'frame-singularity'
      : powerLevel === 8
      ? 'frame-oracle'
      : powerLevel === 7
      ? 'frame-master'
      : powerLevel === 6
      ? 'frame-architect'
      : powerLevel === 5
      ? 'frame-director'
      : powerLevel === 4
      ? 'frame-engineer'
      : powerLevel === 3
      ? 'frame-apprentice'
      : powerLevel === 2
      ? 'frame-explorer'
      : 'frame-starter');

  switch (effectiveFrame) {
    case 'frame-legend':
      return {
        wrapperClass:
          'p-[3.5px] bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#00E5FF] shadow-[0_0_24px_rgba(151,71,255,0.45)]',
        levelNumber: powerLevel || 10,
        levelBadgeClass:
          'bg-gradient-to-r from-[#9747FF] to-[#FF4A97] text-white border border-amber-300',
      };
    case 'frame-singularity':
      return {
        wrapperClass:
          'p-[3px] bg-gradient-to-r from-rose-500 via-[#FFCD34] to-[#9747FF] shadow-[0_0_22px_rgba(244,63,94,0.42)]',
        levelNumber: powerLevel || 9,
        levelBadgeClass: 'bg-rose-600 text-white border border-amber-200',
      };
    case 'frame-oracle':
      return {
        wrapperClass:
          'p-[3px] bg-gradient-to-r from-[#FFD500] via-[#FF4A97] to-[#9747FF] shadow-[0_0_20px_rgba(255,213,0,0.45)]',
        levelNumber: powerLevel || 8,
        levelBadgeClass: 'bg-amber-400 text-[#330043] border border-white',
      };
    case 'frame-master':
      return {
        wrapperClass:
          'p-[3px] bg-gradient-to-tr from-[#FF4A97] via-[#FFD500] to-[#9747FF] shadow-[0_0_16px_rgba(255,74,151,0.3)]',
        levelNumber: powerLevel || 7,
        levelBadgeClass: 'bg-[#FF4A97] text-white border border-amber-200',
      };
    case 'frame-architect':
      return {
        wrapperClass:
          'p-[2.5px] bg-gradient-to-tr from-indigo-500 via-[#9747FF] to-[#FF4A97] shadow-[0_0_14px_rgba(99,102,241,0.32)]',
        levelNumber: powerLevel || 6,
        levelBadgeClass: 'bg-indigo-600 text-white border border-indigo-200',
      };
    case 'frame-director':
      return {
        wrapperClass:
          'p-[2.5px] bg-gradient-to-tr from-fuchsia-500 to-[#FF4A97] shadow-[0_0_12px_rgba(217,70,239,0.28)]',
        levelNumber: powerLevel || 5,
        levelBadgeClass: 'bg-fuchsia-600 text-white border border-pink-200',
      };
    case 'frame-engineer':
      return {
        wrapperClass: 'p-[2.5px] bg-gradient-to-tr from-[#9747FF] to-[#FF4A97] shadow-xs',
        levelNumber: powerLevel || 4,
        levelBadgeClass: 'bg-[#9747FF] text-white border border-white',
      };
    case 'frame-apprentice':
      return {
        wrapperClass: 'p-[2px] bg-gradient-to-tr from-sky-400 to-[#9747FF] shadow-2xs',
        levelNumber: powerLevel || 3,
        levelBadgeClass: 'bg-sky-500 text-white border border-white',
      };
    case 'frame-explorer':
      return {
        wrapperClass: 'p-[2px] bg-[#9747FF] ring-2 ring-[#DDC7F8]',
        levelNumber: powerLevel || 2,
        levelBadgeClass: 'bg-[#F5F0FF] text-[#4C1D95] border border-[#9747FF]/50',
      };
    case 'frame-starter':
    default:
      return {
        wrapperClass: 'p-[1.5px] bg-[#DDC7F8]',
        levelNumber: powerLevel || 1,
        levelBadgeClass: 'bg-white text-[#6E4F7D] border border-[#DDC7F8]',
      };
  }
}

function renderLevelVectorIcon(level: number) {
  const cls = 'w-2.5 h-2.5 shrink-0';
  if (level >= 10) return <Gem className={cls} />;
  if (level === 9) return <Star className={cls} />;
  if (level === 8) return <Crown className={cls} />;
  if (level === 7) return <Flame className={cls} />;
  if (level === 6) return <Cpu className={cls} />;
  if (level === 5) return <Palette className={cls} />;
  if (level === 4) return <Zap className={cls} />;
  if (level === 3) return <Compass className={cls} />;
  if (level === 2) return <Sparkles className={cls} />;
  return <Sprout className={cls} />;
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatar,
  size = 'md',
  isBot = false,
  rank,
  highlight = false,
  frameId,
  powerLevel,
  isPoweringUp = false,
  className = '',
}) => {
  const isCustomPhoto = isCustomPhotoAvatar(avatar);
  const meta = getAvatarMeta(avatar);
  const sz = SIZE_MAP[size];
  const hasCustomPower = Boolean(frameId || powerLevel);
  const frameSpec = resolveFrameStyle(frameId, powerLevel);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
    >
      {/* Anel pulsante especial quando ganha conquistas/poder no REVEALING */}
      {isPoweringUp && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.75, 0.15, 0.75] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute -inset-1.5 ${sz.outerRadius} bg-gradient-to-r from-[#FF4A97] via-[#FFD500] to-[#9747FF] blur-xs pointer-events-none`}
        />
      )}

      {hasCustomPower ? (
        <div className={`${sz.outerRadius} ${frameSpec.wrapperClass} relative z-10`}>
          <div
            className={`${sz.box} ${
              isCustomPhoto ? 'bg-white' : `${meta.bgGradient} ${sz.padSvg}`
            } flex items-center justify-center overflow-hidden`}
          >
            {isCustomPhoto ? (
              <img
                src={avatar}
                alt="Foto do perfil"
                className="w-full h-full object-cover rounded-[inherit]"
              />
            ) : (
              <img src={meta.src} alt={meta.label} className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      ) : (
        <div
          className={`${sz.box} ${
            isCustomPhoto ? 'bg-white' : `${meta.bgGradient} ${sz.padSvg}`
          } border ${
            highlight
              ? 'border-[#FF4A97] ring-4 ring-[#FF4A97]/15 shadow-sm'
              : `${meta.accent} shadow-xs`
          } flex items-center justify-center overflow-hidden transition-transform relative z-10`}
        >
          {isCustomPhoto ? (
            <img
              src={avatar}
              alt="Foto do perfil"
              className="w-full h-full object-cover rounded-[inherit]"
            />
          ) : (
            <img src={meta.src} alt={meta.label} className="w-full h-full object-contain" />
          )}
        </div>
      )}

      {/* Medalha elegante de posição no Pódio / Ranking */}
      {typeof rank === 'number' && rank >= 1 && rank <= 3 && (
        <span
          className={`absolute z-20 ${sz.rankBadge} rounded-full font-bold flex items-center justify-center border-2 border-white shadow-sm ${
            rank === 1
              ? 'bg-pink-yellow text-white'
              : rank === 2
              ? 'bg-slate-200 text-[#330043]'
              : 'bg-amber-200 text-amber-950'
          }`}
        >
          {rank}º
        </span>
      )}

      {/* Badge discreto de Bot Mermã ou Nível de Poder (sem emojis do sistema) */}
      {isBot ? (
        <span
          className={`absolute z-20 left-1/2 -translate-x-1/2 ${sz.botTag} whitespace-nowrap inline-flex items-center gap-1 rounded-full bg-white border border-[#DDC7F8] text-[#6E4F7D] font-quicksand font-bold tracking-tight shadow-xs leading-none`}
        >
          <Bot className="w-2.5 h-2.5 text-[#9747FF] shrink-0" />
          <span>Bot Mermã</span>
        </span>
      ) : (
        hasCustomPower && (
          <span
            className={`absolute z-20 left-1/2 -translate-x-1/2 ${sz.levelTag} whitespace-nowrap inline-flex items-center gap-0.5 rounded-full font-quicksand font-extrabold tracking-tight shadow-xs leading-none ${frameSpec.levelBadgeClass}`}
          >
            {renderLevelVectorIcon(frameSpec.levelNumber)}
            <span>Lv.{frameSpec.levelNumber}</span>
          </span>
        )
      )}
    </div>
  );
};
