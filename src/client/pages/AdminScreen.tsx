import React, { useCallback, useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Crown,
  Database,
  Gamepad2,
  KeyRound,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { AvatarBadge } from '../components/AvatarBadge';
import { BadgeVectorIcon } from '../components/BadgeVectorIcon';
import { AchievementMarqueeStrip } from '../components/AchievementMarqueeStrip';
import {
  getCareerAchievements,
  getPlayerPowerTier,
} from '../../shared/achievements';
import type { AvatarId } from '../../shared/types';

interface AdminPlayerItem {
  id: string;
  deviceId: string;
  nickname: string;
  avatar: AvatarId;
  highScore: number;
  totalScore: number;
  matchesPlayed: number;
  winsCount: number;
  updatedAt: string;
}

interface AdminStats {
  totalPlayers: number;
  totalMatches: number;
  highestScoreEver: number;
}

const ADMIN_SESSION_STORAGE_KEY = 'mdx26_admin_session_pwd';

export const AdminScreen: React.FC = () => {
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [savedPassword, setSavedPassword] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) || '';
    }
    return '';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dbVersion, setDbVersion] = useState<string>('PostgreSQL 18');
  const [players, setPlayers] = useState<AdminPlayerItem[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalPlayers: 0,
    totalMatches: 0,
    highestScoreEver: 0,
  });
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const fetchAdminData = useCallback(async (pwd: string) => {
    if (!pwd) return;
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/admin/ranking', {
        headers: {
          'x-admin-password': pwd,
        },
      });
      if (!res.ok) {
        setIsAuthenticated(false);
        setSavedPassword('');
        if (typeof window !== 'undefined') {
          window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
        }
        setAuthError('Senha administrativa inválida. Verifique ADMIN_PASSWORD no arquivo .env.');
        return;
      }

      const data = await res.json();
      setIsAuthenticated(true);
      if (data.database) setDbVersion(data.database);
      if (Array.isArray(data.players)) setPlayers(data.players);
      if (data.stats) setStats(data.stats);
    } catch {
      setAuthError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (savedPassword) {
      fetchAdminData(savedPassword);
    }
  }, [savedPassword, fetchAdminData]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = passwordInput.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmed }),
      });

      if (!res.ok) {
        setAuthError('Senha incorreta! Verifique o valor de ADMIN_PASSWORD no .env.');
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, trimmed);
      }
      setSavedPassword(trimmed);
      setPasswordInput('');
    } catch {
      setAuthError('Falha ao comunicar com o servidor.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
    setSavedPassword('');
    setIsAuthenticated(false);
    setConfirmClearAll(false);
  };

  const handleClearAllRankings = async () => {
    if (!savedPassword) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/clear-ranking', {
        method: 'POST',
        headers: {
          'x-admin-password': savedPassword,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players || []);
        if (data.stats) setStats(data.stats);
        setConfirmClearAll(false);
        showFeedback('Ranking Geral zerado com sucesso no PostgreSQL 18 e atualizado na TV!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlayer = async (player: AdminPlayerItem) => {
    if (!savedPassword) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/players/${encodeURIComponent(player.id)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': savedPassword,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPlayers(data.players || []);
        if (data.stats) setStats(data.stats);
        showFeedback(`Participante "${player.nickname}" removida do PostgreSQL 18.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF7FF] text-[#330043] flex flex-col">
      {/* Cabeçalho Administrativo */}
      <header className="w-full bg-white border-b border-[#DDC7F8] px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <img
            src="/mermas/logo.svg"
            alt="Mermãs Digitais"
            className="h-9 object-contain"
          />
          <div className="h-6 w-px bg-[#DDC7F8]" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#9747FF]" />
            <span className="font-display text-lg text-[#330043]">
              Painel Administrativo • Ranking MDX 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dbVersion} Conectado</span>
            </span>
          )}

          <Link
            to="/tv"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#DDC7F8] text-xs font-bold text-[#330043] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#9747FF]" />
            <span>Voltar para Tela da TV</span>
          </Link>

          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-rose-50 border border-[#DDC7F8] hover:border-rose-200 text-xs font-bold text-rose-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto px-6 py-8 flex-1">
        {feedbackToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold text-sm">{feedbackToast}</span>
          </div>
        )}

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto mt-12 bg-white rounded-3xl border border-[#DDC7F8] p-7 shadow-[0_14px_38px_rgba(51,0,67,0.08)]">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#DDC7F8] flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6 text-[#9747FF]" />
            </div>

            <h1 className="font-display text-2xl text-[#330043]">Acesso Restrito à Organização</h1>
            <p className="text-sm text-[#545454] mt-1 mb-6">
              Digite a senha configurada na variável <code className="font-mono text-[#9747FF]">ADMIN_PASSWORD</code> do arquivo <code className="font-mono">.env</code> para gerenciar ou limpar o Ranking Geral.
            </p>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#330043] uppercase tracking-wider mb-1.5">
                  Senha de Administração
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Digite a senha (ex: mdx2026)..."
                  autoFocus
                  className="mermas-input w-full px-4 py-3 text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !passwordInput.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#9747FF] to-[#FF4A97] text-white font-display text-base shadow-md hover:opacity-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isLoading ? 'Verificando...' : 'Entrar no Painel Admin'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Resumo de Métricas do Banco PostgreSQL 18 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-[#DDC7F8] shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] border border-[#DDC7F8] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#9747FF]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#6E4F7D] uppercase">
                    Jogadoras Cadastradas
                  </div>
                  <div className="font-display text-2xl text-[#330043]">{players.length}</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#DDC7F8] shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#6E4F7D] uppercase">
                    Recorde Geral do Evento
                  </div>
                  <div className="font-display text-2xl text-[#330043]">
                    {stats.highestScoreEver || 0} pts
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#DDC7F8] shadow-2xs flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 border border-pink-200 flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-[#FF4A97]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#6E4F7D] uppercase">
                    Partidas Registradas
                  </div>
                  <div className="font-display text-2xl text-[#330043]">
                    {stats.totalMatches || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Principal da Tabela de Ranking + Botão Protegido de Zerar Ranking */}
            <div className="bg-white rounded-3xl border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F3E8FF]">
                <div>
                  <h2 className="font-display text-xl text-[#330043]">
                    Gerenciamento do Ranking Geral ({players.length} registros)
                  </h2>
                  <p className="text-xs text-[#6E4F7D]">
                    Qualquer alteração feita aqui é salva no PostgreSQL 18 e atualiza o telão da TV em tempo real.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => fetchAdminData(savedPassword)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FAF5FF] hover:bg-[#F3E8FF] border border-[#DDC7F8] text-xs font-bold text-[#330043] transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-[#9747FF] ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Atualizar Lista</span>
                  </button>

                  {!confirmClearAll ? (
                    <button
                      type="button"
                      onClick={() => setConfirmClearAll(true)}
                      disabled={players.length === 0 || isLoading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Zerar Ranking Geral</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-2xl">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-xs font-bold text-rose-800">
                        Confirmar limpeza total?
                      </span>
                      <button
                        type="button"
                        onClick={handleClearAllRankings}
                        disabled={isLoading}
                        className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Sim, Zerar Tudo
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmClearAll(false)}
                        className="px-2.5 py-1 rounded-xl bg-white border border-rose-200 text-xs font-bold text-[#330043] cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Lista Completa de Participantes */}
              {players.length === 0 ? (
                <div className="py-14 text-center">
                  <Trophy className="w-10 h-10 text-[#9747FF]/50 mx-auto mb-2" />
                  <p className="font-display text-lg text-[#330043]">
                    Nenhuma participante registrada no momento.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {players.map((player, index) => {
                    const pos = index + 1;
                    const tier = getPlayerPowerTier({
                      highScore: player.highScore,
                      totalScore: player.totalScore,
                      winsCount: player.winsCount,
                      matchesPlayed: player.matchesPlayed,
                    });
                    const unlockedAchievements = getCareerAchievements({
                      highScore: player.highScore,
                      totalScore: player.totalScore,
                      winsCount: player.winsCount,
                      matchesPlayed: player.matchesPlayed,
                    });

                    return (
                      <div
                        key={player.id}
                        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-[#DDC7F8]/80 hover:bg-[#FAF7FF] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-9 h-9 rounded-xl bg-[#FAF5FF] border border-[#DDC7F8] font-display text-xs flex items-center justify-center text-[#330043] shrink-0">
                            {pos}º
                          </span>

                          <AvatarBadge
                            avatar={player.avatar}
                            size="sm"
                            frameId={tier.frameId}
                            powerLevel={tier.level}
                          />

                          <div className="flex flex-col items-start min-w-0">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tier.pillClass}`}
                            >
                              <BadgeVectorIcon iconKey={tier.icon} className="w-2.5 h-2.5" />
                              <span>{tier.shortTitle}</span>
                            </span>
                            <span className="font-display text-base text-[#330043] truncate mt-0.5">
                              {player.nickname}
                            </span>
                            <div className="text-[11px] text-[#6E4F7D]">
                              Total acumulado: {player.totalScore} pts • Device ID:{' '}
                              <code className="font-mono">{player.deviceId.slice(0, 16)}</code>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 px-2 overflow-hidden">
                          <AchievementMarqueeStrip
                            achievementIds={unlockedAchievements}
                            size="md"
                          />
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-50 border border-purple-200 text-[#4C1D95] font-display text-sm font-bold"
                            title={`Poder Acumulado: ${tier.powerScore} PWR`}
                          >
                            <Zap className="w-3.5 h-3.5 text-[#9747FF] fill-[#9747FF]" />
                            <span>{tier.powerScore} PWR</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-display text-sm">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>{player.highScore} pts</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-pink-50 border border-pink-200 text-[#D01F6B] font-display text-sm">
                            <Crown className="w-3.5 h-3.5 text-[#FF4A97]" />
                            <span>{player.winsCount}</span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F5F0FF] border border-[#DDC7F8] text-[#4C1D95] font-display text-sm">
                            <Gamepad2 className="w-3.5 h-3.5 text-[#9747FF]" />
                            <span>{player.matchesPlayed}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeletePlayer(player)}
                            disabled={isLoading}
                            title={`Remover ${player.nickname} do banco`}
                            className="w-9 h-9 rounded-xl bg-white hover:bg-rose-50 border border-[#DDC7F8] hover:border-rose-300 text-[#6E4F7D] hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
