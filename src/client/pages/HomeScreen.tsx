import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Sparkles,
  Tv,
  Smartphone,
  Trophy,
  Users,
  Gamepad2,
  Lock,
  DoorOpen,
  Plus,
  RefreshCw,
  KeyRound,
  Shield,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react';
import { BandeirolasHeader } from '../components/BandeirolasHeader';
import { EventFloatingAssets } from '../components/EventFloatingAssets';
import { AvatarBadge } from '../components/AvatarBadge';
import { getSocket } from '../store/useGameStore';
import type { AvatarId } from '../../shared/types';

interface GlobalStats {
  totalPlayers: number;
  totalMatches: number;
  highestScoreEver: number;
  totalRooms: number;
  topPWR: Array<{
    nickname: string;
    avatar: string;
    powerScore: number;
    tier: string;
    highScore: number;
    roomCode: string;
  }>;
}

interface RoomItem {
  roomCode: string;
  roomName: string;
  isOpen: boolean;
  phase: string;
  playersCount: number;
  maxPlayers: number;
  roundToken: string;
}

const PHASE_LABELS: Record<string, { label: string; color: string }> = {
  IDLE: { label: 'Em Espera (Ranking)', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  LOBBY: { label: 'Lobby Aberto', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  COUNTDOWN: { label: 'Iniciando Rodada', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  PLAYING: { label: 'Prompting Ao Vivo', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EVALUATING: { label: 'Avaliando IA', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  REVEALING: { label: 'Revelação', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  PODIUM: { label: 'Pódio dos Vencedores', color: 'bg-amber-50 text-amber-800 border-amber-300' },
};

const SAVED_PW_KEY = 'mdx26_admin_password';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);

  // Modais de Criação e Reabertura
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [selectedRoomToReopen, setSelectedRoomToReopen] = useState<RoomItem | null>(null);

  // Formulário Criar Sala
  const [newRoomCode, setNewRoomCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [adminPassword, setAdminPassword] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem(SAVED_PW_KEY)) || 'mdx2026';
  });

  const [modalLoading, setModalLoading] = useState(false);
  const [modalFeedback, setModalFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics/global');
      if (res.ok) {
        const data = await res.json();
        if (data?.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.warn('Falha ao carregar métricas globais:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.rooms)) {
          setRooms(data.rooms);
        }
      }
    } catch (err) {
      console.warn('Falha ao carregar salas:', err);
    } finally {
      setIsLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRooms();

    const socket = getSocket();
    const handleRoomsUpdated = (updatedRooms: RoomItem[]) => {
      if (Array.isArray(updatedRooms)) {
        setRooms(updatedRooms);
      }
    };

    socket.on('rooms:updated', handleRoomsUpdated);

    // Polling sutil a cada 10s para manter métricas frescas
    const timer = setInterval(() => {
      fetchStats();
      fetchRooms();
    }, 10000);

    return () => {
      socket.off('rooms:updated', handleRoomsUpdated);
      clearInterval(timer);
    };
  }, [fetchStats, fetchRooms]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomCode.trim() || !newRoomName.trim()) {
      setModalFeedback({ type: 'error', message: 'Preencha o código e o nome da sala.' });
      return;
    }
    if (!adminPassword.trim()) {
      setModalFeedback({ type: 'error', message: 'Digite a senha de moderador.' });
      return;
    }

    setModalLoading(true);
    setModalFeedback(null);
    try {
      const cleanCode = newRoomCode.toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 12);
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: cleanCode,
          name: newRoomName.trim(),
          password: adminPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data?.ok) {
        localStorage.setItem(SAVED_PW_KEY, adminPassword.trim());
        setModalFeedback({
          type: 'success',
          message: `Sala "${newRoomName.trim()}" criada com sucesso! Redirecionando para o telão...`,
        });
        await fetchRooms();
        setTimeout(() => {
          setIsCreateModalOpen(false);
          navigate({ to: '/tv', search: { room: cleanCode } });
        }, 1200);
      } else {
        setModalFeedback({
          type: 'error',
          message: data?.error || 'Senha incorreta ou erro ao criar sala.',
        });
      }
    } catch (err: unknown) {
      setModalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erro ao conectar ao servidor.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  const handleReopenRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomToReopen) return;
    if (!adminPassword.trim()) {
      setModalFeedback({ type: 'error', message: 'Digite a senha de moderador.' });
      return;
    }

    setModalLoading(true);
    setModalFeedback(null);
    try {
      const res = await fetch('/api/rooms/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomCode: selectedRoomToReopen.roomCode,
          name: selectedRoomToReopen.roomName,
          password: adminPassword.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data?.ok) {
        localStorage.setItem(SAVED_PW_KEY, adminPassword.trim());
        setModalFeedback({
          type: 'success',
          message: `Sala reaberta! Redirecionando para o telão...`,
        });
        await fetchRooms();
        setTimeout(() => {
          setIsReopenModalOpen(false);
          navigate({ to: '/tv', search: { room: selectedRoomToReopen.roomCode } });
        }, 1000);
      } else {
        setModalFeedback({
          type: 'error',
          message: data?.error || 'Senha de moderador incorreta.',
        });
      }
    } catch (err: unknown) {
      setModalFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erro ao conectar ao servidor.',
      });
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7FF] text-[#330043] flex flex-col relative overflow-x-hidden">
      {/* Elementos cenográficos flutuantes sutis */}
      <EventFloatingAssets variant="mobile" showBunting={true} intensity="calm" />

      {/* Cabeçalho Oficial Mermãs Digitais */}
      <BandeirolasHeader
        mode="home"
        rightSlot={
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FAF5FF] border border-[#DDC7F8] text-xs font-semibold text-[#330043] transition-colors shadow-2xs whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5 text-[#9747FF]" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </div>
        }
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8 relative z-10">
        {/* ===================================================================
            HERO BANNER CENTRAL • MERMÃS DIGITAIS STEAM 2026
           =================================================================== */}
        <section className="rounded-3xl bg-white border-2 border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] p-6 sm:p-10 relative overflow-hidden flex flex-col items-center text-center gap-5">
          {/* Badge de Destaque Oficial */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5FF] border border-[#DDC7F8] text-xs font-bold text-[#9747FF]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4A97]" />
            <span>Edição Especial STEAM 2026 • IFMA Maracanã</span>
          </div>

          <div className="max-w-2xl flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/marca/menina-mdx.svg"
                alt="Mermãs Digitais"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
              <h1 className="font-display text-3xl sm:text-5xl text-[#330043] leading-tight">
                Desafio de Prompt com IA
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#6E4F7D] font-medium leading-relaxed max-w-xl">
              Adivinhe as imagens secretas geradas por Inteligência Artificial, digite seu prompt criativo e conquiste o topo do podium nas arenas do evento!
            </p>
          </div>

          {/* Botões Heróis de Ação Direta */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mt-2">
            <Link
              to="/play"
              className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#9747FF] via-[#D01F6B] to-[#FF4A97] hover:opacity-95 text-white font-display text-base flex items-center justify-center gap-2.5 shadow-md shadow-[#9747FF]/25 cursor-pointer transition-all transform hover:scale-[1.02]"
            >
              <Smartphone className="w-5 h-5" />
              <span>Entrar pelo Celular para Jogar</span>
            </Link>

            <Link
              to="/tv"
              search={{ room: 'MDX26' }}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-[#FAF5FF] border-2 border-[#DDC7F8] text-[#330043] font-display text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
            >
              <Tv className="w-5 h-5 text-[#9747FF]" />
              <span>Abrir Telão Principal (MDX26)</span>
            </Link>
          </div>
        </section>

        {/* ===================================================================
            MÉTRICAS GLOBAIS DO EVENTO & TOP 3 PWR (MESTRAS DO PROMPT)
           =================================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl bg-white border border-[#DDC7F8] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#E9D8FD] text-[#9747FF] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#6E4F7D]">Jogadoras</span>
              <div className="font-orbitron font-black text-2xl text-[#330043]">
                {isLoadingStats ? '...' : stats?.totalPlayers || 0}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-[#DDC7F8] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF5F8] border border-[#FED7E2] text-[#D01F6B] flex items-center justify-center shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#6E4F7D]">Partidas Jogadas</span>
              <div className="font-orbitron font-black text-2xl text-[#330043]">
                {isLoadingStats ? '...' : stats?.totalMatches || 0}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-[#DDC7F8] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-amber-600 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#6E4F7D]">Recorde da Arena</span>
              <div className="font-orbitron font-black text-2xl text-[#330043]">
                {isLoadingStats ? '...' : `${stats?.highestScoreEver || 0} pts`}
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-[#DDC7F8] p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-emerald-600 flex items-center justify-center shrink-0">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#6E4F7D]">Arenas Ativas</span>
              <div className="font-orbitron font-black text-2xl text-[#330043]">
                {isLoadingStats ? '...' : stats?.totalRooms || rooms.length || 1}
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            MINI PÓDIO PWR: TOP 3 MESTRAS DO PROMPT
           =================================================================== */}
        {stats?.topPWR && stats.topPWR.length > 0 && (
          <section className="rounded-3xl bg-white border-2 border-[#DDC7F8] p-5 sm:p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#D01F6B]" />
                <h2 className="font-display text-lg sm:text-xl text-[#330043]">
                  Mestras do Prompt • Top PWR Acumulado
                </h2>
              </div>
              <span className="text-xs font-semibold text-[#6E4F7D]">Ranking Geral</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {stats.topPWR.map((player, idx) => (
                <div
                  key={`${player.nickname}-${idx}`}
                  className="rounded-2xl bg-[#FAF7FF] border border-[#E9D8FD] p-3.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl shrink-0">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <AvatarBadge avatar={player.avatar as AvatarId} size="sm" />
                    <div className="min-w-0">
                      <div className="font-display text-sm text-[#330043] truncate">
                        {player.nickname}
                      </div>
                      <div className="text-[11px] text-[#6E4F7D] font-medium">
                        {player.tier}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-orbitron font-bold text-xs text-[#9747FF]">
                      {player.powerScore} PWR
                    </div>
                    <div className="text-[10px] text-[#8C7A99]">
                      Rec: {player.highScore} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================
            GRID DE ARENAS & TELÕES DE TV ("ACONTECENDO AGORA")
           =================================================================== */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-[#330043]">
                Telões e Sessões do Evento
              </h2>
              <p className="text-xs text-[#6E4F7D]">
                Acompanhe as partidas ao vivo nos telões ou abra uma nova sessão de TV com a moderação.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  fetchRooms();
                  fetchStats();
                }}
                className="p-2.5 rounded-2xl bg-white hover:bg-[#FAF5FF] border border-[#DDC7F8] text-[#6E4F7D] cursor-pointer transition-colors shadow-2xs"
                title="Atualizar lista de salas"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalFeedback(null);
                  setIsCreateModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#9747FF] to-[#D01F6B] text-white font-display text-xs sm:text-sm hover:opacity-95 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Sala de TV</span>
              </button>
            </div>
          </div>

          {isLoadingRooms ? (
            <div className="rounded-3xl bg-white border border-[#DDC7F8] p-12 text-center text-sm text-[#6E4F7D]">
              Carregando telões do evento...
            </div>
          ) : rooms.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#DDC7F8] p-12 text-center flex flex-col items-center gap-3">
              <Tv className="w-8 h-8 text-[#9747FF]" />
              <p className="text-sm font-semibold text-[#330043]">
                Nenhuma sala ativa encontrada no momento.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="py-2 px-4 rounded-xl bg-[#9747FF] text-white text-xs font-semibold"
              >
                Criar Primeira Sala
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const phaseMeta = PHASE_LABELS[room.phase] || {
                  label: room.phase,
                  color: 'bg-gray-100 text-gray-700 border-gray-200',
                };

                return (
                  <div
                    key={room.roomCode}
                    className={`rounded-3xl bg-white border-2 p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                      room.isOpen ? 'border-[#DDC7F8]' : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    {/* Topo do Card da Sala */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              room.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                            }`}
                          />
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6E4F7D]">
                            {room.isOpen ? 'Sessão Ativa' : 'Sessão Pausada'}
                          </span>
                        </div>
                        <h3 className="font-display text-lg text-[#330043] leading-tight mt-0.5">
                          {room.roomName}
                        </h3>
                      </div>

                      <span className="px-2.5 py-1 rounded-xl bg-[#FAF5FF] border border-[#DDC7F8] text-xs font-mono font-black text-[#4C1D95]">
                        {room.roomCode}
                      </span>
                    </div>

                    {/* Status da Rodada & Jogadores */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F3E8FF]">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${
                          room.isOpen
                            ? phaseMeta.color
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {room.isOpen ? (
                          phaseMeta.label
                        ) : (
                          <>
                            <Lock className="w-3 h-3 text-amber-600" />
                            <span>Entradas Fechadas</span>
                          </>
                        )}
                      </span>

                      <span className="font-semibold text-[#6E4F7D]">
                        {room.playersCount}/5 jogadoras
                      </span>
                    </div>

                    {/* Botões de Ação do Card */}
                    <div className="flex items-center gap-2 pt-1">
                      {room.isOpen ? (
                        <>
                          <Link
                            to="/tv"
                            search={{ room: room.roomCode }}
                            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#9747FF] to-[#D01F6B] hover:opacity-95 text-white font-display text-xs text-center flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                          >
                            <Tv className="w-3.5 h-3.5" />
                            <span>Abrir Telão TV</span>
                          </Link>

                          <Link
                            to="/play"
                            search={{ room: room.roomCode }}
                            className="py-2 px-3 rounded-xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#DDC7F8] text-[#4C1D95] font-display text-xs text-center flex items-center justify-center gap-1 transition-all"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Jogar</span>
                          </Link>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoomToReopen(room);
                            setModalFeedback(null);
                            setIsReopenModalOpen(true);
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-display text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          <DoorOpen className="w-4 h-4 text-amber-700" />
                          <span>Reabrir Telão (Moderador)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* =====================================================================
          MODAL 1: CRIAR NOVA SALA / TELÃO COM SENHA
         ===================================================================== */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border-2 border-[#DDC7F8] shadow-2xl flex flex-col gap-5 relative text-[#330043]"
            >
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E9D8FD] flex items-center justify-center text-[#6E4F7D] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#9747FF] to-[#D01F6B] text-white flex items-center justify-center shadow-md">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-[#330043]">Nova Sessão de TV</h3>
                  <p className="text-xs text-[#6E4F7D]">
                    Crie um telão adicional para o evento STEAM 2026.
                  </p>
                </div>
              </div>

              {modalFeedback && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
                    modalFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {modalFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{modalFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleCreateRoom} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B52] mb-1">
                    Código da Sala (Letras e números)
                  </label>
                  <input
                    type="text"
                    value={newRoomCode}
                    onChange={(e) => setNewRoomCode(e.target.value.toUpperCase())}
                    placeholder="Ex: PALCO2, STAND1"
                    maxLength={12}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDC7F8] bg-[#FAF7FF] text-sm font-mono font-bold uppercase focus:outline-hidden focus:border-[#9747FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B52] mb-1">
                    Nome da Sessão / Local
                  </label>
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Ex: Arena Palco 2, Workshop STEAM"
                    maxLength={80}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDC7F8] bg-[#FAF7FF] text-sm focus:outline-hidden focus:border-[#9747FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A3B52] mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#9747FF]" />
                    <span>Senha de Moderador</span>
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Padrão: mdx2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDC7F8] bg-[#FAF7FF] text-sm focus:outline-hidden focus:border-[#9747FF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="mt-2 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9747FF] to-[#D01F6B] hover:opacity-95 text-white font-display text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 transition-all"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>{modalLoading ? 'Criando Sessão...' : 'Criar & Abrir Telão da Sala'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          MODAL 2: REABRIR SALA FECHADA COM SENHA DE MODERADOR
         ===================================================================== */}
      <AnimatePresence>
        {isReopenModalOpen && selectedRoomToReopen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border-2 border-[#DDC7F8] shadow-2xl flex flex-col gap-5 relative text-[#330043]"
            >
              <button
                type="button"
                onClick={() => setIsReopenModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#E9D8FD] flex items-center justify-center text-[#6E4F7D] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-[#330043]">Reabrir Telão</h3>
                  <p className="text-xs text-[#6E4F7D]">
                    {selectedRoomToReopen.roomName} ({selectedRoomToReopen.roomCode})
                  </p>
                </div>
              </div>

              {modalFeedback && (
                <div
                  className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
                    modalFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {modalFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  )}
                  <span>{modalFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleReopenRoom} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#4A3B52] mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#9747FF]" />
                    <span>Senha de Moderador</span>
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Padrão: mdx2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDC7F8] bg-[#FAF7FF] text-sm focus:outline-hidden focus:border-[#9747FF]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={modalLoading}
                  className="mt-2 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#9747FF] to-[#D01F6B] hover:opacity-95 text-white font-display text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 transition-all"
                >
                  <DoorOpen className="w-4 h-4" />
                  <span>{modalLoading ? 'Reabrindo...' : 'Reabrir Sala & Acessar Telão'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
