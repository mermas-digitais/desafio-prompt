import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';

export const TVCountdownView: React.FC = React.memo(() => {
  const countdownLeft = useGameStore((s) => s.roomState.countdownLeft);

  return (
    <motion.div
      key="phase-countdown"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.08 }}
      className="flex-1 flex flex-col items-center justify-center text-center py-10 relative"
    >
      <img
        src="/mermas/ondasTimer.svg"
        alt=""
        aria-hidden="true"
        decoding="async"
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-35 select-none"
      />

      <span className="px-4 py-1.5 rounded-full bg-white border border-[#DDC7F8] text-[#9747FF] font-semibold text-sm shadow-xs mb-6">
        Preparem seus prompts
      </span>

      <motion.div
        key={countdownLeft}
        initial={{ scale: 0.45, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 18 }}
        className="font-orbitron font-black text-[130px] md:text-[180px] leading-none bg-gradient-to-r from-[#9747FF] to-[#FF4A97] bg-clip-text text-transparent select-none"
      >
        {countdownLeft > 0 ? countdownLeft : 'Valendo!'}
      </motion.div>

      <p className="text-lg md:text-xl text-[#545454] mt-6 max-w-xl">
        Observe a imagem e descreva o <strong className="text-[#330043]">sujeito</strong>, o{' '}
        <strong className="text-[#330043]">estilo visual</strong> e o{' '}
        <strong className="text-[#330043]">cenário</strong>.
      </p>
    </motion.div>
  );
});
