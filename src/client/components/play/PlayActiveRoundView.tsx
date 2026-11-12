import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Lightbulb,
  Lock,
  Palette,
  PenLine,
  Send,
  Target,
  Unlock,
  Zap,
  ZoomIn,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { evaluatePromptThermometer, formatTimer } from '../../helpers/formatters';
import { resolveChallengeImageUrl } from '../../helpers/imageHelpers';
import { AvatarBadge } from '../AvatarBadge';
import { ALL_PLAYER_SLOTS, type PublicRoomPlayer } from '../../../shared/types';

export interface PlayActiveRoundViewProps {
  deviceId: string;
  myRoomSlot: PublicRoomPlayer;
  promptText: string;
  isLocked: boolean;
  onPromptChange: (val: string) => void;
  onLockPrompt: () => void;
  onUnlockForEdit: () => void;
  onOpenZoom: () => void;
}

export const PlayActiveRoundView: React.FC<PlayActiveRoundViewProps> = React.memo(
  ({
    deviceId,
    myRoomSlot,
    promptText,
    isLocked,
    onPromptChange,
    onLockPrompt,
    onUnlockForEdit,
    onOpenZoom,
  }) => {
    const players = useGameStore((s) => s.roomState.players);
    const challenge = useGameStore((s) => s.roomState.challenge);
    const roundTimeLeft = useGameStore((s) => s.roomState.roundTimeLeft);

    if (!challenge) return null;

    const {
      wordCount,
      hasSubjectLayer,
      hasStyleLayer,
      hasSceneLayer,
      liveSpeedBonus,
      timeProgressPercent,
    } = evaluatePromptThermometer(promptText, roundTimeLeft);

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3"
      >
        {/* BARRA DE STATUS DOS ADVERSÁRIOS AO VIVO (5 SLOTS) */}
        <div className="mermas-card px-2.5 py-2 grid grid-cols-5 gap-1.5">
          {ALL_PLAYER_SLOTS.map((slotNum) => {
            const p = players.find((pl) => pl.slot === slotNum);
            const isMe = p?.id === myRoomSlot.id;
            return (
              <div
                key={slotNum}
                className={`px-1.5 py-1.5 rounded-xl border flex items-center gap-1 min-w-0 ${
                  p?.hasLockedPrompt
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : isMe
                    ? 'bg-[#FEF0ED] border-pink-200 text-[#330043]'
                    : 'bg-[#FAF7FF] border-[#DDC7F8]/70 text-[#545454]'
                }`}
              >
                {p ? (
                  <>
                    <AvatarBadge avatar={p.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="font-quicksand font-bold text-[10px] truncate leading-tight">
                        {isMe ? 'Você' : p.nickname}
                      </div>
                      <div className="text-[9px] font-quicksand font-semibold leading-tight truncate flex items-center gap-0.5 mt-0.5">
                        {p.hasLockedPrompt ? (
                          <span className="inline-flex items-center gap-0.5 text-emerald-700 font-bold">
                            <Lock className="w-2.5 h-2.5 shrink-0" />
                            <span>OK</span>
                          </span>
                        ) : p.isTyping ? (
                          <span className="inline-flex items-center gap-0.5 text-[#FF4A97] animate-pulse">
                            <PenLine className="w-2.5 h-2.5 shrink-0" />
                            <span>...</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-[#6E4F7D]">
                            <Eye className="w-2.5 h-2.5 shrink-0" />
                            <span>Ver</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="text-[10px] font-quicksand text-[#6E4F7D] mx-auto">#{slotNum}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* ELEMENTO 1: Imagem Gerada por IA com barra de tempo integrada */}
        <div className="mermas-card overflow-hidden">
          <div className="w-full h-1.5 bg-[#F5F0FF]">
            <div
              className={`h-full transition-all duration-500 ${
                roundTimeLeft <= 15 ? 'bg-rose-500' : 'bg-purple-pink'
              }`}
              style={{ width: `${timeProgressPercent}%` }}
            />
          </div>

          <div className="px-4 py-2.5 flex items-center justify-between border-b border-[#DDC7F8]/60 bg-white">
            <span className="font-quicksand font-bold text-xs text-[#6E4F7D]">
              Slot #{myRoomSlot.slot} • {challenge.category}
            </span>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                roundTimeLeft <= 15
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                  : 'bg-[#F5F0FF] text-[#330043] border border-[#DDC7F8]'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-[#FF4A97]" />
              <span className="font-orbitron">{formatTimer(roundTimeLeft)}</span>
            </div>
          </div>

          <div
            onClick={onOpenZoom}
            className="relative h-48 w-full bg-[#FAF7FF] cursor-pointer group overflow-hidden"
          >
            <img
              src={resolveChallengeImageUrl(challenge.id, challenge.imageUrl)}
              alt="Imagem do Desafio"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenZoom();
              }}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#DDC7F8] text-[#330043] text-xs font-quicksand font-bold shadow-xs"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#9747FF]" />
              <span>Ampliar</span>
            </button>
          </div>
        </div>

        {/* ELEMENTO 2: Dicas desbloqueadas */}
        {challenge.unlockedHints.length > 0 && (
          <div className="px-4 py-3 rounded-2xl bg-[#FEF0ED] border border-pink-200 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#FF4A97] shrink-0 mt-0.5" />
            <div className="text-xs font-quicksand text-[#330043] space-y-0.5">
              <span className="font-bold text-[#D01F6B]">Dica da Mermã IA: </span>
              <span>{challenge.unlockedHints.join(' • ')}</span>
            </div>
          </div>
        )}

        {/* ELEMENTO 3: Caixa de texto + Termômetro de Qualidade em Tempo Real */}
        <div className="mermas-card p-4 md:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-sm text-[#330043] inline-flex items-center gap-1.5">
              <PenLine className="w-4 h-4 text-[#9747FF]" />
              <span>Descreva a imagem:</span>
            </span>
            {!isLocked && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-quicksand font-bold text-[11px] whitespace-nowrap">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span>+{liveSpeedBonus} pts Bônus</span>
              </span>
            )}
          </div>

          <textarea
            aria-label="Seu palpite para a imagem"
            rows={4}
            disabled={isLocked}
            value={promptText}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Ex: Uma menina maranhense programando um robô dourado, em estilo animação 3D vibrante, num laboratório iluminado..."
            className={`mermas-input w-full p-3.5 font-quicksand text-base resize-none ${
              isLocked ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 opacity-90' : ''
            }`}
          />

          {/* TERMÔMETRO DE QUALIDADE DO PROMPT EM TEMPO REAL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-quicksand font-bold text-[#6E4F7D]">
              <span>Termômetro do seu Prompt:</span>
              <span>
                {wordCount} {wordCount === 1 ? 'palavra' : 'palavras'} ({promptText.length}/320)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <div
                className={`px-2 py-1.5 rounded-xl border inline-flex items-center justify-center gap-1 font-quicksand font-bold text-[11px] whitespace-nowrap transition-all ${
                  hasSubjectLayer
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                    : 'bg-[#FAF7FF] border-[#DDC7F8]/80 text-[#6E4F7D]'
                }`}
              >
                <Target className="w-3 h-3 shrink-0" />
                <span>Sujeito</span>
              </div>

              <div
                className={`px-2 py-1.5 rounded-xl border inline-flex items-center justify-center gap-1 font-quicksand font-bold text-[11px] whitespace-nowrap transition-all ${
                  hasStyleLayer
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                    : 'bg-[#FAF7FF] border-[#DDC7F8]/80 text-[#6E4F7D]'
                }`}
              >
                <Palette className="w-3 h-3 shrink-0" />
                <span>Estilo</span>
              </div>

              <div
                className={`px-2 py-1.5 rounded-xl border inline-flex items-center justify-center gap-1 font-quicksand font-bold text-[11px] whitespace-nowrap transition-all ${
                  hasSceneLayer
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-2xs'
                    : 'bg-[#FAF7FF] border-[#DDC7F8]/80 text-[#6E4F7D]'
                }`}
              >
                <Globe className="w-3 h-3 shrink-0" />
                <span>Cenário</span>
              </div>
            </div>
          </div>

          {!isLocked ? (
            <button
              type="button"
              disabled={!promptText.trim()}
              onClick={onLockPrompt}
              className="w-full bg-purple-pink py-4 px-5 rounded-2xl font-semibold text-base text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Palpite (+{liveSpeedBonus} pts Bônus)</span>
            </button>
          ) : (
            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-quicksand font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Palpite enviado com {myRoomSlot.lockedAtRemainingSeconds ?? roundTimeLeft}s
                  restantes!
                </span>
              </div>

              <button
                type="button"
                onClick={onUnlockForEdit}
                className="w-full border-gradient py-2.5 rounded-xl font-quicksand font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Editar meu palpite</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
);
