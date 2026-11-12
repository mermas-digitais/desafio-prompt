import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  X,
  DoorOpen,
  DoorClosed,
  RotateCcw,
  Trash2,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export interface TVModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomCode: string;
}

const PRESET_SESSION_NAMES = [
  'Palco Principal MDX',
  'Arena de Batalhas 1',
  'Arena de Batalhas 2',
  'Estande Mermãs Digitais',
  'Workshop STEAM & Prompt',
];

const SAVED_PW_KEY = 'mdx26_admin_password';

export const TVModerationModal: React.FC<TVModerationModalProps> = ({
  isOpen,
  onClose,
  currentRoomCode,
}) => {
  const roomState = useGameStore((s) => s.roomState);
  const openRoom = useGameStore((s) => s.openRoom);
  const closeRoom = useGameStore((s) => s.closeRoom);
  const resetRoom = useGameStore((s) => s.resetRoom);
  const clearRanking = useGameStore((s) => s.clearRanking);

  const [password, setPassword] = useState(() => {
    return localStorage.getItem(SAVED_PW_KEY) || 'mdx2026';
  });
  const [sessionName, setSessionName] = useState(() => roomState.roomName || 'Arena MDX Principal');
  const [roomCodeInput, setRoomCodeInput] = useState(() => currentRoomCode || 'MDX26');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (roomState.roomName) {
      setSessionName(roomState.roomName);
    }
  }, [roomState.roomName]);

  if (!isOpen) return null;

  const handleOpenOrUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setFeedback({ type: 'error', message: 'Digite a senha de moderador.' });
      return;
    }
    if (!sessionName.trim()) {
      setFeedback({ type: 'error', message: 'Informe um nome para a sessão da TV.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await openRoom({
        roomCode: (roomCodeInput.trim() || 'MDX26').toUpperCase(),
        name: sessionName.trim(),
        password: password.trim(),
      });

      if (res.ok) {
        localStorage.setItem(SAVED_PW_KEY, password.trim());
        setFeedback({
          type: 'success',
          message: `Sessão "${sessionName.trim()}" declarada como ABERTA com sucesso!`,
        });
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Senha incorreta ou erro ao abrir sala.',
        });
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erro ao conectar ao servidor.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSession = async () => {
    if (!password.trim()) {
      setFeedback({ type: 'error', message: 'Digite a senha de moderador.' });
      return;
    }
    if (
      !confirm(
        'Tem certeza que deseja FECHAR esta sala? O QR Code será ocultado e novas entradas de celular serão bloqueadas.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      const res = await closeRoom({
        roomCode: (roomCodeInput.trim() || currentRoomCode || 'MDX26').toUpperCase(),
        password: password.trim(),
      });
      if (res.ok) {
        localStorage.setItem(SAVED_PW_KEY, password.trim());
        setFeedback({
          type: 'success',
          message: 'Sala FECHADA com sucesso! O QR Code foi ocultado.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'Erro ao fechar sala. Verifique a senha.',
        });
      }
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erro ao conectar ao servidor.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCurrentRound = async () => {
    if (!confirm('Deseja reiniciar a rodada atual? Um novo QR Code exclusivo será gerado no telão.')) {
      return;
    }
    setIsLoading(true);
    try {
      await resetRoom(roomCodeInput);
      setFeedback({
        type: 'success',
        message: 'Rodada reiniciada e novo QR Code gerado!',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearRankings = async () => {
    if (
      !confirm(
        'ATENÇÃO: Tem certeza que deseja zerar os placares de ranking desta sala? Esta ação é irreversível.'
      )
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await clearRanking(password, roomCodeInput);
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Ranking limpo com sucesso!' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Erro ao limpar ranking.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="bg-white rounded-3xl p-6 lg:p-7 max-w-lg w-full border-2 border-[#DDC7F8] shadow-2xl flex flex-col gap-5 relative text-[#330043]"
        >
          {/* BOTÃO FECHAR */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E9D8FD] flex items-center justify-center text-[#6E4F7D] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* CABEÇALHO */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9747FF] to-[#D01F6B] text-white flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl text-[#330043]">Painel de Moderação</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    roomState.isOpen
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}
                >
                  {roomState.isOpen ? '🟢 Sala Aberta' : '🔴 Sala Fechada'}
                </span>
              </div>
              <p className="text-xs text-[#6E4F7D]">
                Controle a sessão da TV, declare a sala aberta e gerencie QR Codes.
              </p>
            </div>
          </div>

          {/* FEEDBACK MENSAGEM */}
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}

          {/* FORMULÁRIO DE ABERTURA / CONFIGURAÇÃO DE SESSÃO */}
          <form onSubmit={handleOpenOrUpdateSession} className="flex flex-col gap-4">
            {/* SENHA DE MODERADOR */}
            <div>
              <label className="block text-xs font-bold text-[#4A3B52] mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#9747FF]" />
                <span>Senha do Moderador</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Padrão: mdx2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDC7F8] bg-[#FAF7FF] text-sm text-[#330043] focus:outline-hidden focus:border-[#9747FF]"
              />
            </div>

            {/* CÓDIGO DA SALA E NOME DA SESSÃO */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-[#4A3B52] mb-1">
                  Código Sala
                </label>
                <input
                  type="text"
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  placeholder="MDX26"
                  maxLength={12}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDC7F8] bg-[#FAF7FF] text-xs font-mono font-bold text-[#330043] uppercase text-center focus:outline-hidden focus:border-[#9747FF]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-[#4A3B52] mb-1">
                  Nome da Sessão / Local
                </label>
                <input
                  type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  placeholder="Ex: Palco Principal"
                  className="w-full px-3 py-2 rounded-xl border border-[#DDC7F8] bg-[#FAF7FF] text-xs font-semibold text-[#330043] focus:outline-hidden focus:border-[#9747FF]"
                />
              </div>
            </div>

            {/* PILLS DE PRESETS RÁPIDOS */}
            <div>
              <span className="block text-[11px] font-bold text-[#6E4F7D] mb-1.5">
                Sugestões Rápidas de Sessão:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_SESSION_NAMES.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSessionName(name)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      sessionName === name
                        ? 'bg-[#9747FF] text-white border-[#9747FF]'
                        : 'bg-[#FAF5FF] text-[#6E4F7D] border-[#E9D8FD] hover:bg-[#F3E8FF]'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* BOTÕES DE ABERTURA / FECHAMENTO DA SALA */}
            <div className="flex flex-col gap-2 mt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9747FF] to-[#D01F6B] hover:opacity-95 text-white font-display text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 transition-all"
              >
                <DoorOpen className="w-4 h-4" />
                <span>
                  {isLoading
                    ? 'Salvando...'
                    : roomState.isOpen
                    ? 'Atualizar Sessão & Manter Aberta'
                    : '🟢 Declarar Sala Aberta & Liberar QR Code'}
                </span>
              </button>

              {roomState.isOpen && (
                <button
                  type="button"
                  onClick={handleCloseSession}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-display text-xs lg:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors shadow-2xs"
                >
                  <DoorClosed className="w-4 h-4 text-amber-700" />
                  <span>🔒 Fechar Sala (Ocultar QR Code e Pausar Entradas)</span>
                </button>
              )}
            </div>
          </form>

          {/* CONTROLES RÁPIDOS DA SESSÃO */}
          <div className="pt-3 border-t border-[#F0E6FF] flex flex-col gap-2">
            <span className="text-[11px] font-bold text-[#6E4F7D] uppercase tracking-wider">
              Ações Rápidas de Moderação
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleResetCurrentRound}
                disabled={isLoading}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF5FF] border border-[#DDC7F8] text-xs font-semibold text-[#330043] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#9747FF]" />
                <span>Novo QR Code / Reset</span>
              </button>

              <button
                type="button"
                onClick={handleClearRankings}
                disabled={isLoading}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Zerar Ranking</span>
              </button>
            </div>

            <div className="text-[10px] text-[#8C7A99] text-center mt-1 flex items-center justify-center gap-2">
              <span>Token Rodada: <code className="font-mono">{roomState.roundToken || 'none'}</code></span>
              <span>•</span>
              <span>Sala: <strong className="font-mono">{roomState.roomCode}</strong></span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
