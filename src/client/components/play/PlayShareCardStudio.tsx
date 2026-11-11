import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Download, Loader2, RectangleVertical, Share2, Square, X } from 'lucide-react';
import {
  SHARE_CARD_THEMES,
  buildShareText,
  canvasToBlob,
  downloadBlob,
  renderShareCard,
  shareOrDownloadCard,
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
  const [themeId, setThemeId] = useState<ShareCardThemeId>('neon');
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
    const t = window.setTimeout(() => setFeedback(null), 2600);
    return () => window.clearTimeout(t);
  }, [feedback]);

  const handleShare = useCallback(async () => {
    if (!data || !canvasRef.current || isRendering) return;
    setIsSharing(true);
    try {
      const outcome = await shareOrDownloadCard(canvasRef.current, data, `${themeId}-${format}`);
      if (outcome === 'shared') setFeedback('Card compartilhado! 💜');
      else if (outcome === 'downloaded') setFeedback('Imagem salva! Poste nos seus Stories ✨');
      else if (outcome === 'failed') setFeedback('Não deu para compartilhar agora.');
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
            {/* Topo */}
            <div className="sticky top-0 z-10 bg-[#FAF7FF]/95 backdrop-blur px-4 pt-4 pb-3 flex items-center justify-between border-b border-[#F3E8FF]">
              <div>
                <div className="text-[10px] font-quicksand font-extrabold uppercase tracking-wider text-[#9747FF]">
                  MDX26 • Desafio de Prompt
                </div>
                <h3 className="font-display text-lg text-[#330043] leading-tight">
                  Seu card para compartilhar
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

            {/* Pré-visualização */}
            <div className="px-4 pt-4 flex justify-center">
              <div
                className={`relative rounded-2xl overflow-hidden border border-[#DDC7F8] shadow-[0_16px_40px_rgba(51,0,67,0.18)] bg-[#F5F0FF] ${
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

            {/* Formato */}
            <div className="px-4 pt-4">
              <div className="bg-[#F5F0FF] p-1 rounded-2xl border border-[#DDC7F8] grid grid-cols-2 gap-1">
                {(
                  [
                    { id: 'story', label: 'Stories 9:16', Icon: RectangleVertical },
                    { id: 'feed', label: 'Feed 4:5', Icon: Square },
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

            {/* Temas */}
            <div className="px-4 pt-4">
              <div className="text-xs font-quicksand font-bold text-[#6E4F7D] mb-2">
                Escolha a estética
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
                          ? 'border-[#9747FF] shadow-[0_8px_20px_rgba(151,71,255,0.2)]'
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
                          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center">
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

            {/* Ações */}
            <div className="px-4 pt-4 pb-5 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleShare}
                disabled={isRendering || isSharing}
                className="w-full bg-purple-pink bg-gradient-to-r from-[#9747FF] to-[#FF4A97] py-3.5 rounded-2xl font-semibold text-sm text-white shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSharing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                <span>Compartilhar nas redes</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={isRendering}
                className="w-full py-3 rounded-2xl bg-white border border-[#DDC7F8] font-quicksand font-bold text-sm text-[#4C1D95] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>Salvar imagem</span>
              </button>
              <p className="text-center font-quicksand text-[11px] text-[#6E4F7D]">
                Marque <strong>@mermasdigitais</strong> e use <strong>#MDX26</strong> 💜
              </p>
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-xs font-quicksand font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl py-2"
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
