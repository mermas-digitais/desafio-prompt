import React from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronRight, Crown, History, Sparkles, Trophy, Zap } from 'lucide-react';
import { resolveChallengeImageUrl } from '../../helpers/imageHelpers';
import { formatRelativeTime, type SavedPersonalMatch } from '../../lib/personalMatchHistory';

export interface PlayPersonalMatchHistoryProps {
  history: SavedPersonalMatch[];
  onSelectMatch: (match: SavedPersonalMatch) => void;
}

export const PlayPersonalMatchHistory: React.FC<PlayPersonalMatchHistoryProps> = ({
  history,
  onSelectMatch,
}) => {
  if (!history || history.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full flex flex-col gap-2.5"
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <History className="w-4 h-4 text-[#9747FF]" />
          <h3 className="font-display text-sm text-[#330043]">
            Suas Últimas Partidas
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-[#F5F0FF] border border-[#DDC7F8] text-[10px] font-bold text-[#9747FF]">
            {history.length}
          </span>
        </div>
        <span className="font-quicksand text-[11px] text-[#6E4F7D]">
          Toque para rever o pódio
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {history.map((match, idx) => {
          const isWinner = match.myRank === 1;
          const rankBadge =
            match.myRank === 1
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : match.myRank === 2
              ? 'bg-slate-100 text-slate-700 border-slate-300'
              : match.myRank === 3
              ? 'bg-orange-100 text-orange-900 border-orange-300'
              : 'bg-[#FAF5FF] text-[#6E4F7D] border-[#DDC7F8]';

          return (
            <motion.button
              key={match.id}
              type="button"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectMatch(match)}
              className="w-full p-3 rounded-2xl bg-white border border-[#EDE2FF] hover:border-[#DDC7F8] shadow-xs hover:shadow-md flex items-center justify-between gap-3 text-left cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Miniatura da Arte + Badge de Posição */}
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#DDC7F8] bg-[#F5F0FF]">
                  <img
                    src={resolveChallengeImageUrl(match.challenge.id, match.challenge.imageUrl)}
                    alt={match.challenge.title}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 px-1 py-0.2 rounded-tl-lg font-display text-[9px] border-t border-l ${rankBadge}`}
                  >
                    {isWinner ? '1º 🏆' : `${match.myRank}º`}
                  </span>
                </div>

                {/* Detalhes da Partida */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-display text-xs text-[#330043] truncate max-w-[170px]">
                      {match.challenge.title}
                    </span>
                    <span className="font-quicksand text-[10px] text-[#6E4F7D]">
                      • {formatRelativeTime(match.timestamp)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-orbitron font-bold text-xs text-[#9747FF]">
                      {match.myEvaluation.totalScore} pts
                    </span>

                    {match.shareData.totalPwr > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md border border-emerald-200">
                        <Zap className="w-2.5 h-2.5 text-emerald-600" />
                        <span>+{match.shareData.totalPwr} PWR</span>
                      </span>
                    )}

                    {match.myEvaluation.isNewHighScore && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded-md border border-amber-200">
                        <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                        <span>Recorde</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botão de Ação à Direita */}
              <div className="flex items-center gap-1 shrink-0 text-[#9747FF]">
                <span className="hidden sm:inline font-quicksand text-xs font-bold">
                  Rever
                </span>
                <div className="w-7 h-7 rounded-xl bg-[#FAF5FF] border border-[#DDC7F8] flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
};
