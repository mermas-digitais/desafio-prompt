import React from 'react';
import { AccessibleDialog } from '../AccessibleDialog';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import { InstagramLogoIcon } from '../InstagramLogoIcon';
import { PlayMobilePodium } from './PlayMobilePodium';
import { PlayResultView } from './PlayResultView';
import { PlayRoomRoundRanking } from './PlayRoomRoundRanking';
import { formatRelativeTime, type SavedPersonalMatch } from '../../lib/personalMatchHistory';
import { getPlayerPowerTier } from '../../../shared/achievements';
import type { ShareCardData } from '../../lib/shareCardRenderer';

export interface PlayMatchHistoryModalProps {
  match: SavedPersonalMatch | null;
  onClose: () => void;
  onOpenShareCard: (data: ShareCardData) => void;
}

export const PlayMatchHistoryModal: React.FC<PlayMatchHistoryModalProps> = ({
  match,
  onClose,
  onOpenShareCard,
}) => {
  if (!match) return null;

  const myPowerTier = getPlayerPowerTier({
    highScore: match.myEvaluation.totalScore,
    winsCount: match.myRank === 1 ? 1 : 0,
    matchesPlayed: 1,
  });

  return (
    <AccessibleDialog open={Boolean(match)} title={`Partida · ${match.roomCode}`} onClose={onClose}>
        <div className="w-full flex flex-col">
          {/* Header Fixo do Histórico */}
          <div className="sticky top-0 z-10 bg-[#FAF7FF]/95 backdrop-blur px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#F3E8FF]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Voltar ao lobby"
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-white border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider text-[#9747FF]">
                  Partida Gravada • {formatRelativeTime(match.timestamp)}
                </div>
                <h3 className="font-display text-base text-[#330043] leading-tight truncate max-w-[230px]">
                  {match.challenge.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="w-8 h-8 rounded-xl bg-white border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4">
            {/* 🌟 BOTÃO HERÓI: CRIAR CARD DO INSTAGRAM DESTA PARTIDA */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onOpenShareCard(match.shareData)}
              className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white shadow-[0_10px_28px_rgba(220,39,67,0.35)] border-2 border-white/40 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                  <InstagramLogoIcon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider text-white/90 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-200" />
                    <span>Card Oficial MDX26</span>
                  </div>
                  <div className="font-display text-sm sm:text-base text-white leading-tight truncate">
                    Postar no Instagram Stories
                  </div>
                  <div className="font-quicksand text-[11px] text-white/90 truncate">
                    {match.myEvaluation.totalScore} pts • {match.myRank}º lugar na rodada
                  </div>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-xl bg-white text-[#dc2743] font-display text-xs font-bold shrink-0 shadow-md">
                Abrir
              </span>
            </motion.button>

            {/* 1. PÓDIO DA PARTIDA */}
            {match.allEvaluations && match.allEvaluations.length > 0 && (
              <PlayMobilePodium
                evaluations={match.allEvaluations}
                myPlayerId={match.myEvaluation.playerId}
                onOpenShareCard={() => onOpenShareCard(match.shareData)}
              />
            )}

            {/* 2. RESULTADO DETALHADO DA JOGADORA */}
            <PlayResultView
              myEvaluation={match.myEvaluation}
              myPowerTier={myPowerTier}
              fullPrompt={match.challenge.fullPrompt}
              onOpenRanking={onClose}
              onOpenShareCard={() => onOpenShareCard(match.shareData)}
            />

            {/* 3. PLACAR COMPLETO DA SALA DAQUELA RODADA */}
            {match.allEvaluations && match.allEvaluations.length > 0 && (
              <PlayRoomRoundRanking
                evaluations={match.allEvaluations}
                myPlayerId={match.myEvaluation.playerId}
                phase="PODIUM"
              />
            )}

            {/* Botão de Fechar na Base */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] font-display text-sm text-[#4C1D95] shadow-xs cursor-pointer transition-colors"
            >
              Voltar ao Lobby
            </button>
          </div>
        </div>
    </AccessibleDialog>
  );
};
