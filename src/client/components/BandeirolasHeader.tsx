import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useGameStore } from '../store/useGameStore';
import { playJoinSound, soundEngine } from '../lib/soundEngine';

interface BandeirolasHeaderProps {
  compact?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  rightSlot?: React.ReactNode;
  headerMusicSlot?: React.ReactNode;
  mode?: 'tv' | 'play' | 'home';
}

export const BandeirolasHeader: React.FC<BandeirolasHeaderProps> = React.memo(
  ({
    compact = false,
    isMuted = false,
    onToggleMute,
    rightSlot,
    headerMusicSlot,
  }) => {
    const roomCode = useGameStore((s) => s.roomState.roomCode);
    const isConnected = useGameStore((s) => s.isConnected);

    const handleSoundToggle = () => {
      if (onToggleMute) {
        const wasMuted = isMuted;
        onToggleMute();
        if (wasMuted) {
          soundEngine.setMuted(false);
          playJoinSound();
        }
      } else {
        const nextMuted = soundEngine.toggleMute();
        if (!nextMuted) {
          playJoinSound();
        }
      }
    };

    return (
      <header className="relative z-30 w-full max-w-full overflow-hidden select-none">
        {/* Fina linha superior de 3px em gradiente oficial Mermãs Digitais */}
        <div className="h-[3px] w-full bg-purple-pink" />

        {/* Navbar branca responsiva (nunca corta na lateral direita no celular) */}
        <div
          className={`w-full max-w-full bg-white/95 backdrop-blur-md border-b border-[#DDC7F8]/70 shadow-2xs px-3 sm:px-5 md:px-6 ${
            compact ? 'py-2' : 'py-2.5'
          } flex items-center justify-between gap-2`}
        >
          {/* Esquerda: Logos Oficiais Mermãs Digitais + MDX 2026 */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group min-w-0 shrink">
            <img
              src="/mermas/logo.svg"
              onError={(e) => {
                e.currentTarget.src = '/marca/logo-mermas.svg';
              }}
              alt="Mermãs Digitais"
              decoding="async"
              className={`${
                compact ? 'h-7 sm:h-8' : 'h-8 sm:h-9 md:h-10'
              } w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105`}
            />

            {!compact && (
              <img
                src="/marca/titulo.svg"
                alt="MDX STEAM 2026"
                decoding="async"
                className="hidden md:block h-8 md:h-9 w-auto object-contain shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
            )}

            <div className="h-5 w-[1px] bg-[#DDC7F8] hidden sm:block shrink-0" />

            <div className="flex flex-col min-w-0">
              <span className="font-display text-xs sm:text-sm md:text-base text-[#330043] leading-tight truncate">
                Desafio de Prompt
              </span>
              <span className="font-quicksand text-[10px] md:text-xs font-semibold text-[#6E4F7D] leading-tight hidden sm:inline truncate">
                Mermãs Digitais • MDX 2026
              </span>
            </div>
          </Link>

          {/* Slot central/direito de música no Header (apenas Telão TV durante o jogo) */}
          {headerMusicSlot && (
            <div className="hidden lg:flex items-center justify-center shrink-0">
              {headerMusicSlot}
            </div>
          )}

          {/* Direita: Badge Único Combinado (Sala + Status) + RightSlot + Botão Circular de Volume */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#FAF7FF] border border-[#DDC7F8] text-[11px] sm:text-xs font-quicksand font-bold text-[#330043] whitespace-nowrap">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isConnected ? 'bg-emerald-500' : 'bg-rose-400'
                }`}
              />
              <span>
                <span className="hidden sm:inline">Sala </span>
                {roomCode}
              </span>
            </div>

            {rightSlot}

            <button
              type="button"
              onClick={handleSoundToggle}
              aria-label={isMuted ? 'Ativar som' : 'Silenciar som'}
              title={isMuted ? 'Ativar som' : 'Silenciar som'}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-[#FAF7FF] border border-[#DDC7F8] flex items-center justify-center text-[#330043] transition-colors cursor-pointer shrink-0"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#9747FF]" />
              )}
            </button>
          </div>
        </div>
      </header>
    );
  }
);
