import type { BadgeIconKey } from '../../shared/achievements';

export const DEFAULT_CREATIVE_SUGGESTIONS = [
  'Mermã Cyber',
  'AdaTech',
  'Estrela STEAM',
  'Robô Bumba',
  'Pixel Mermã',
  'Cientista IA',
];

export const STYLE_KEYWORDS = [
  '3d',
  'estilo',
  'neon',
  'aquarela',
  'ilustra',
  'pixel',
  'cyber',
  'pintura',
  'realista',
  'cartoon',
  'anime',
  'vibrante',
  'digital',
  'futurista',
  'pixar',
];

export function formatTimer(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getPromptWordCount(text?: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function evaluatePromptThermometer(promptText: string, roundTimeLeft: number) {
  const wordsList = promptText.trim().split(/\s+/).filter(Boolean);
  const wordCount = wordsList.length;
  const lowerPrompt = promptText.toLowerCase();
  const hasSubjectLayer = wordCount >= 3;
  const hasStyleLayer =
    wordCount >= 7 || STYLE_KEYWORDS.some((kw) => lowerPrompt.includes(kw));
  const hasSceneLayer = wordCount >= 12;
  const liveSpeedBonus = Math.max(10, Math.round((roundTimeLeft / 90) * 150));
  const timeProgressPercent = Math.max(0, Math.min(100, (roundTimeLeft / 90) * 100));

  return {
    wordCount,
    hasSubjectLayer,
    hasStyleLayer,
    hasSceneLayer,
    liveSpeedBonus,
    timeProgressPercent,
  };
}

export function getVerdictStamp(score: number): {
  label: string;
  iconKey: BadgeIconKey;
  badgeClass: string;
} {
  if (score >= 800) {
    return {
      label: 'ENGENHEIRA DE PROMPT LENDÁRIA',
      iconKey: 'gem',
      badgeClass:
        'bg-gradient-to-r from-[#9747FF] via-[#FF4A97] to-[#F59E0B] text-white border-amber-300 shadow-[0_8px_24px_rgba(255,74,151,0.28)]',
    };
  }
  if (score >= 600) {
    return {
      label: 'MANDOU MUITO BEM',
      iconKey: 'flame',
      badgeClass:
        'bg-gradient-to-r from-[#FF4A97] to-[#9747FF] text-white border-[#DDC7F8] shadow-sm',
    };
  }
  if (score >= 400) {
    return {
      label: 'BOA VISÃO DE IA',
      iconKey: 'sparkles',
      badgeClass: 'bg-[#FAF5FF] text-[#9747FF] border-[#DDC7F8]',
    };
  }
  return {
    label: 'CONTINUE EXPLORANDO',
    iconKey: 'rocket',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
  };
}

export function getRarityLabel(rarity: 'comum' | 'raro' | 'epico' | 'lendario'): {
  text: string;
  pill: string;
} {
  if (rarity === 'lendario') {
    return {
      text: 'LENDÁRIO',
      pill: 'bg-gradient-to-r from-[#FF4A97] to-[#F59E0B] text-white',
    };
  }
  if (rarity === 'epico') {
    return {
      text: 'ÉPICO',
      pill: 'bg-[#9747FF] text-white',
    };
  }
  if (rarity === 'raro') {
    return {
      text: 'RARO',
      pill: 'bg-amber-200 text-amber-950',
    };
  }
  return {
    text: 'COMUM',
    pill: 'bg-emerald-100 text-emerald-800',
  };
}
