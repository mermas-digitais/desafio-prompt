import React from 'react';
import { motion } from 'framer-motion';

export const TVEvaluatingView: React.FC = React.memo(() => {
  return (
    <motion.div
      key="phase-evaluating"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex items-center justify-center py-10"
    >
      <div className="bg-white rounded-3xl border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] p-10 max-w-lg w-full flex flex-col items-center text-center">
        <img
          src="/marca/ia.svg"
          alt="Mermã IA"
          decoding="async"
          className="w-24 h-24 object-contain mb-5 mdx-float"
        />
        <h2 className="font-display text-2xl md:text-3xl text-[#330043]">
          Analisando a intenção dos prompts...
        </h2>
        <p className="text-sm text-[#545454] mt-2 leading-relaxed">
          Comparando sujeito principal, estilo visual, detalhes do cenário e calculando as
          conquistas desbloqueadas na rodada!
        </p>
      </div>
    </motion.div>
  );
});
