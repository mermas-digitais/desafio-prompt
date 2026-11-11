import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ExternalLink, Sparkles, Users } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export interface TVQrCodeJoinCardProps {
  playUrl: string;
  playDisplayUrl: string;
}

export const TVQrCodeJoinCard: React.FC<TVQrCodeJoinCardProps> = React.memo(
  ({ playUrl, playDisplayUrl }) => {
    const playersCount = useGameStore((s) => s.roomState.players.length);
    const roomCode = useGameStore((s) => s.roomState.roomCode);

    return (
      <div className="rounded-3xl bg-white border-2 border-[#DDC7F8] shadow-[0_14px_40px_rgba(51,0,67,0.08)] p-4 lg:p-5 flex-1 min-h-0 flex flex-col items-center justify-between text-center relative overflow-hidden">
        {/* Topo do Card de Entrada */}
        <div className="w-full flex items-center justify-between gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF5FF] border border-[#DDC7F8] text-[11px] font-bold text-[#9747FF] whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-[#FF4A97]" />
            <span>Entrada Rápida pelo Celular</span>
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
              Aponte a câmera do seu celular para entrar na arena
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

          <a
            href={playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#F5F0FF] hover:bg-[#EDE2FF] border border-[#DDC7F8] text-xs font-bold text-[#4C1D95] transition-colors whitespace-nowrap"
          >
            <span>Abrir controle</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  }
);
