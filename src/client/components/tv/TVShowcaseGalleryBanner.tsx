import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { ARENA_SHOWCASE_ITEMS, type ShowcaseItem } from '../../../shared/showcaseData';
import { shuffleArray } from '../../helpers/formatters';
import { preloadChallengeImage } from '../../helpers/imageHelpers';

export const TVShowcaseGalleryBanner: React.FC = React.memo(() => {
  const [showcaseItems] = useState<ShowcaseItem[]>(() => shuffleArray(ARENA_SHOWCASE_ITEMS));
  const [showcaseIdx, setShowcaseIdx] = useState<number>(0);

  // Ciclo isolado a cada 5s (não re-renderiza o restante da TV!)
  useEffect(() => {
    const interval = setInterval(() => {
      setShowcaseIdx((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [showcaseItems.length]);

  const currentShowcase = showcaseItems[showcaseIdx % showcaseItems.length] || showcaseItems[0];
  const nextShowcase = showcaseItems[(showcaseIdx + 1) % showcaseItems.length];

  // Pré-carrega de forma assíncrona a próxima imagem WebP para transição instantânea
  useEffect(() => {
    if (nextShowcase?.imageUrl) {
      preloadChallengeImage(nextShowcase.imageUrl);
    }
  }, [nextShowcase?.imageUrl]);

  return (
    <div className="shrink-0 rounded-2xl bg-white px-4 py-2.5 border border-[#DDC7F8] shadow-[0_8px_24px_rgba(51,0,67,0.05)] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentShowcase.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-3.5"
        >
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#DDC7F8] shrink-0 bg-[#FAF5FF]">
            <img
              src={currentShowcase.imageUrl}
              alt={currentShowcase.title}
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9747FF] bg-[#FAF5FF] px-2.5 py-0.5 rounded-full border border-[#E9D8FD] whitespace-nowrap">
                <Sparkles className="w-3 h-3 text-[#FF4A97]" />
                <span>
                  Galeria IA ({(showcaseIdx % showcaseItems.length) + 1}/{showcaseItems.length}) •{' '}
                  {currentShowcase.category}
                </span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF4A97] whitespace-nowrap">
                <Lock className="w-3 h-3 shrink-0" />
                <span className="hidden xl:inline">{currentShowcase.title} • </span>
                <span>Prompt Secreto</span>
              </span>
            </div>

            {/* O prompt permanece 100% do tempo com blur fixo — nunca remove o blur na Home! */}
            <div className="relative bg-[#FAF7FF] px-3 py-1 rounded-xl border border-[#F3E8FF] overflow-hidden">
              <p
                aria-hidden="true"
                className="font-prompt text-xs text-[#545454] truncate blur-[6px] select-none pointer-events-none"
              >
                •••• •••••• •••• •••••• •••• •••••• ••••
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
