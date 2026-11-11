import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink, Sparkles, Users, Shield, Lock, DoorOpen } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export interface TVQrCodeJoinCardProps {
  playUrl: string;
  playDisplayUrl: string;
  onOpenModeration?: () => void;
}

export const TVQrCodeJoinCard: React.FC<TVQrCodeJoinCardProps> = React.memo(
  ({ playUrl, playDisplayUrl, onOpenModeration }) => {
    const playersCount = useGameStore((s) => s.roomState.players.length);
    const roomCode = useGameStore((s) => s.roomState.roomCode);
    const roomName = useGameStore((s) => s.roomState.roomName);
    const isOpen = useGameStore((s) => s.roomState.isOpen);

    if (!isOpen) {
      return (
        <div className="rounded-3xl bg-white border-2 border-amber-300 shadow-[0_14px_40px_rgba(245,158,11,0.12)] p-5 lg:p-6 flex-1 min-h-0 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Sala Fechada</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#6E4F7D]">
              Sala: {roomCode || 'MDX26'}
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-display text-xl lg:text-2xl text-[#330043]">
                Aguardando Abertura
              </h2>
              <p className="text-xs text-[#545454] max-w-[260px] mx-auto mt-1 leading-relaxed">
                O moderador desta TV precisa declarar a sala aberta para liberar o QR Code exclusivo da rodada.
              </p>
            </div>

            {onOpenModeration && (
              <button
                type="button"
                onClick={onOpenModeration}
                className="mt-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#9747FF] to-[#D01F6B] hover:opacity-95 text-white font-display text-xs lg:text-sm flex items-center gap-2 shadow-sm cursor-pointer transition-all"
              >
                <DoorOpen className="w-4 h-4" />
                <span>Abrir Sala da TV (Moderador)</span>
              </button>
            )}
          </div>

          <div className="w-full pt-3 border-t border-[#F3E8FF] text-[11px] text-[#6E4F7D]">
            Sessão Atual: <strong>{roomName || 'Aguardando Início'}</strong>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-3xl bg-white border-2 border-[#DDC7F8] shadow-[0_14px_40px_rgba(51,0,67,0.08)] p-4 lg:p-5 flex-1 min-h-0 flex flex-col items-center justify-between text-center relative overflow-hidden">
        {/* Topo do Card de Entrada */}
        <div className="w-full flex items-center justify-between gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5FF] border border-[#DDC7F8] text-[11px] font-bold text-[#9747FF] whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-[#FF4A97]" />
            <span>{roomName || 'Entrada pelo Celular'}</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 whitespace-nowrap">
            <Users className="w-3 h-3 text-emerald-600" />
            <span>{playersCount}/5 na sala</span>
          </span>
        </div>

        {/* Título e Chamada Direta */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/marca/menina-mdx.svg"
            alt="Mermãs Digitais"
            decoding="async"
            className="w-11 h-11 object-contain shrink-0"
          />
          <div className="text-left">
            <h2 className="font-display text-xl lg:text-2xl text-[#330043] leading-tight">
              Escaneie para Jogar
            </h2>
            <p className="text-xs text-[#6E4F7D] font-medium">
              QR Code exclusivo desta rodada na {roomName || 'Arena MDX'}
            </p>
          </div>
        </div>

        {/* QR Code Gigante de Alta Visibilidade para TV Tela Grande */}
        <div className="relative p-3.5 rounded-3xl bg-white border-2 border-[#9747FF]/40 shadow-[0_10px_28px_rgba(151,71,255,0.12)] flex flex-col items-center gap-1.5 shrink-0">
          <QRCodeSVG
            value={playUrl}
            size={182}
            bgColor="#FFFFFF"
            fgColor="#330043"
            level="M"
            includeMargin={false}
          />
          <span className="text-[11px] font-mono font-bold text-[#4C1D95] bg-[#FAF5FF] px-3 py-0.5 rounded-full border border-[#DDC7F8] max-w-[240px] truncate">
            {playDisplayUrl}
          </span>
        </div>

        {/* Rodapé do Card QR Code: Código da Sala em Destaque + Link de Controle */}
        <div className="w-full pt-2.5 border-t border-[#F3E8FF] flex items-center justify-between gap-3 shrink-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-2xl bg-[#FAF5FF] border border-[#DDC7F8]">
            <span className="text-xs font-semibold text-[#6E4F7D]">SALA:</span>
            <span className="font-orbitron font-black text-sm lg:text-base text-[#330043] tracking-wider">
              {roomCode || 'MDX26'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenModeration && (
              <button
                type="button"
                onClick={onOpenModeration}
                title="Abrir painel de moderação da sala"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] text-xs font-bold text-[#4C1D95] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                <Shield className="w-3.5 h-3.5 text-[#9747FF]" />
                <span className="hidden sm:inline">Moderar</span>
              </button>
            )}

            <a
              href={playUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] text-xs font-bold text-[#4C1D95] transition-colors whitespace-nowrap"
            >
              <span>Abrir</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }
);
