import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Download, Loader2, RectangleVertical, Share2, Sparkles, Square, X } from 'lucide-react';
import {
  SHARE_CARD_THEMES,
  buildShareText,
  canvasToBlob,
  downloadBlob,
  renderShareCard,
  shareGeneral,
  shareToInstagramStories,
  type ShareCardData,
  type ShareCardFormat,
  type ShareCardThemeId,
} from '../../lib/shareCardRenderer';

export interface PlayShareCardStudioProps {
  isOpen: boolean;
  data: ShareCardData | null;
  onClose: () => void;
}

export const PlayShareCardStudio: React.FC<PlayShareCardStudioProps> = ({
  isOpen,
  data,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const renderSeqRef = useRef(0);
  const [themeId, setThemeId] = useState<ShareCardThemeId>('pastel');
  const [format, setFormat] = useState<ShareCardFormat>('story');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Renderiza o card sempre que tema/formato/dados mudam
  useEffect(() => {
    if (!isOpen || !data) return;
    if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
    const canvas = canvasRef.current;
    const seq = ++renderSeqRef.current;
    setIsRendering(true);
    renderShareCard(canvas, data, themeId, format)
      .then(() => {
        if (seq !== renderSeqRef.current) return;
        setPreviewUrl(canvas.toDataURL('image/png'));
      })
      .catch(() => {
        if (seq === renderSeqRef.current) setFeedback('Não foi possível gerar o card.');
      })
      .finally(() => {
        if (seq === renderSeqRef.current) setIsRendering(false);
      });
  }, [isOpen, data, themeId, format]);

  useEffect(() => {
    if (!feedback) return undefined;
    const t = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(t);
  }, [feedback]);

  // Compartilhamento focado no Instagram Stories com deep link
  const handleInstagramShare = useCallback(async () => {
    if (!data || !canvasRef.current || isRendering) return;
    setIsSharing(true);
    try {
      const outcome = await shareToInstagramStories(canvasRef.current, data);
      if (outcome === 'shared_native') {
        setFeedback('Selecione "Stories" ou "Feed" no Instagram! ✨');
      } else if (outcome === 'opened_instagram_app') {
        setFeedback('📸 Imagem salva! Abrindo Instagram Stories...');
      } else {
        setFeedback('Card salvo nos seus downloads! Poste nos Stories 💜');
      }
    } finally {
      setIsSharing(false);
    }
  }, [data, isRendering]);

  // Compartilhamento geral (WhatsApp, Twitter/X, Telegram, etc.)
  const handleGeneralShare = useCallback(async () => {
    if (!data || !canvasRef.current || isRendering) return;
    setIsSharing(true);
    try {
      const outcome = await shareGeneral(canvasRef.current, data, themeId, format);
      if (outcome === 'shared') {
        setFeedback('Card compartilhado com sucesso! 💜');
      } else if (outcome === 'downloaded') {
        setFeedback('Imagem salva! Texto copiado para a área de transferência ✨');
      }
    } finally {
      setIsSharing(false);
    }
  }, [data, themeId, format, isRendering]);

  const handleDownload = useCallback(async () => {
    if (!data || !canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current);
    if (!blob) return;
    downloadBlob(blob, `mdx26-desafio-prompt-${themeId}-${format}.png`);
    setFeedback('Imagem salva na galeria/downloads!');
    try {
      await navigator.clipboard?.writeText(buildShareText(data));
    } catch {
      // Clipboard opcional
    }
  }, [data, themeId, format]);

  return (
    <AnimatePresence>
      {isOpen && data && (
        <motion.div
          key="share-studio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-[#1A0024]/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[96vh] overflow-y-auto bg-[#FAF7FF] rounded-t-3xl sm:rounded-3xl border border-[#DDC7F8] shadow-2xl flex flex-col"
          >
            {/* Topo do Estúdio */}
            <div className="sticky top-0 z-10 bg-[#FAF7FF]/95 backdrop-blur px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#F3E8FF]">
              <div>
                <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider text-[#9747FF] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#FF4A97]" />
                  <span>MDX26 • Desafio de Prompt</span>
                </div>
                <h3 className="font-display text-lg text-[#330043] leading-tight">
                  Seu Card para as Redes
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="w-9 h-9 rounded-xl bg-white border border-[#DDC7F8] flex items-center justify-center text-[#6E4F7D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pré-visualização do Canvas Renderizado */}
            <div className="px-4 pt-4 flex justify-center">
              <div
                className={`relative rounded-2xl overflow-hidden border-2 border-[#DDC7F8] shadow-[0_16px_40px_rgba(51,0,67,0.18)] bg-[#F5F0FF] ${
                  format === 'story' ? 'w-[62%] aspect-[9/16]' : 'w-[78%] aspect-[4/5]'
                }`}
              >
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Pré-visualização do card"
                    className={`w-full h-full object-cover transition-opacity duration-200 ${
                      isRendering ? 'opacity-60' : 'opacity-100'
                    }`}
                  />
                )}
                {isRendering && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-[#9747FF] animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Alternador de Formato (Stories 9:16 vs Feed 4:5) */}
            <div className="px-4 pt-4">
              <div className="bg-[#F5F0FF] p-1 rounded-2xl border border-[#DDC7F8] grid grid-cols-2 gap-1">
                {(
                  [
                    { id: 'story', label: 'Stories 9:16 (Instagram)', Icon: RectangleVertical },
                    { id: 'feed', label: 'Feed 4:5 (Quadrado)', Icon: Square },
                  ] as const
                ).map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormat(id)}
                    className={`py-2 rounded-xl text-xs font-quicksand font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                      format === id
                        ? 'bg-white text-[#330043] shadow-sm border border-[#DDC7F8]'
                        : 'text-[#6E4F7D]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Carrossel de Temas Visuais */}
            <div className="px-4 pt-4">
              <div className="text-xs font-quicksand font-bold text-[#6E4F7D] mb-2 flex items-center justify-between">
                <span>Escolha o estilo visual:</span>
                <span className="text-[10px] text-[#9747FF]">{SHARE_CARD_THEMES.length} variações</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
                {SHARE_CARD_THEMES.map((theme) => {
                  const active = theme.id === themeId;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      className={`snap-start shrink-0 w-[118px] text-left rounded-2xl p-2 border-2 bg-white cursor-pointer transition-all ${
                        active
                          ? 'border-[#9747FF] shadow-[0_8px_20px_rgba(151,71,255,0.22)]'
                          : 'border-[#EDE2FF]'
                      }`}
                    >
                      <div
                        className="relative h-14 rounded-xl overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${theme.swatch[0]} 0%, ${theme.swatch[0]} 40%, ${theme.swatch[1]} 75%, ${theme.swatch[2]} 100%)`,
                        }}
                      >
                        {active && (
                          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3 text-[#9747FF]" />
                          </span>
                        )}
                      </div>
                      <div className="font-display text-[13px] text-[#330043] mt-1.5 leading-tight">
                        {theme.name}
                      </div>
                      <div className="font-quicksand text-[10px] text-[#6E4F7D] leading-snug">
                        {theme.tagline}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ações de Compartilhamento & Instagram Stories */}
            <div className="px-4 pt-4 pb-5 flex flex-col gap-2.5">
              {/* Botão Primário: Postar no Instagram Stories */}
              <button
                type="button"
                onClick={handleInstagramShare}
                disabled={isRendering || isSharing}
                className="w-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] py-3.5 px-4 rounded-2xl font-display text-sm text-white shadow-[0_10px_24px_rgba(253,29,29,0.25)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 transition-transform active:scale-[0.98]"
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 fill-white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                )}
                <span>Postar no Instagram Stories</span>
              </button>

              {/* Botão Secundário: Compartilhar no WhatsApp / Outros */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGeneralShare}
                  disabled={isRendering || isSharing}
                  className="py-2.5 px-3 rounded-2xl bg-white border border-[#DDC7F8] font-quicksand font-bold text-xs text-[#330043] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 hover:bg-[#F5F0FF] transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#9747FF]" />
                  <span>WhatsApp / Outros</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isRendering}
                  className="py-2.5 px-3 rounded-2xl bg-white border border-[#DDC7F8] font-quicksand font-bold text-xs text-[#4C1D95] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 hover:bg-[#F5F0FF] transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#FF4A97]" />
                  <span>Salvar na Galeria</span>
                </button>
              </div>

              <p className="text-center font-quicksand text-[11px] text-[#6E4F7D]">
                Marque <strong>@mermasdigitais</strong> com a hashtag <strong>#MDX26</strong> 💜
              </p>

              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xs font-quicksand font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2 px-3 shadow-xs"
                  >
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
