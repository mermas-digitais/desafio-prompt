import React, { useState } from 'react';
import { useRoomAccess } from '../../hooks/useRoomAccess';
import { AccessibleDialog } from '../AccessibleDialog';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Clock, ExternalLink, Users, UserX, Zap } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { formatTimer } from '../../helpers/formatters';
import { AvatarBadge } from '../AvatarBadge';
import { PlayerStatsBadges } from '../PlayerStatsBadges';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import { AchievementMarqueeStrip } from '../AchievementMarqueeStrip';
import {
  getCareerAchievements,
  getPlayerPowerTier,
} from '../../../shared/achievements';
import { ALL_PLAYER_SLOTS, MAX_ROOM_PLAYERS, type PlayerSlot } from '../../../shared/types';

export interface TVLobbyViewProps {
  playUrl: string;
}

export const TVLobbyView: React.FC<TVLobbyViewProps> = React.memo(({ playUrl }) => {
  const players = useGameStore((s) => s.roomState.players);
  const lobbyTimeLeft = useGameStore((s) => s.roomState.lobbyTimeLeft);
  const roomCode = useGameStore((s) => s.roomState.roomCode);
  const startWithBotsNow = useGameStore((s) => s.startWithBotsNow);
  const kickPlayer = useGameStore((s) => s.kickPlayer);
  const isOpen = useGameStore((s) => s.roomState.isOpen);
  const { canManage } = useRoomAccess(roomCode);
  const [confirmation, setConfirmation] = useState<{ text: string; action: () => Promise<{ ok: boolean; error?: string }> } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleKick = (playerNickname: string, playerId: string, slot: PlayerSlot) => {
    setConfirmation({ text: `Remover ${playerNickname} (posição ${slot}) da rodada na sala ${roomCode}? Ela não poderá voltar nesta rodada.`, action: () => kickPlayer({
        roomCode,
        playerId,
        slot,
        reason: 'Removido pelo moderador da sala.',
      }) });
  };

  return (
    <motion.div
      key="phase-lobby"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 min-h-0 overflow-hidden flex flex-col justify-between gap-3.5"
    >
      {/* Barra Superior Limpa com ÚNICO Relógio em Destaque (Sem Contadores Duplicados) */}
      {error && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-xl">{error}</p>}
      <div className="bg-white rounded-3xl p-4 lg:p-5 border border-[#DDC7F8] shadow-[0_12px_36px_rgba(51,0,67,0.06)] flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9747FF] bg-[#FAF5FF] px-3 py-1 rounded-full border border-[#E9D8FD]">
            <Users className="w-3.5 h-3.5" />
            <span>
              Preparação da Rodada • {players.length} de {MAX_ROOM_PLAYERS} participantes
            </span>
          </span>
          <h2 className="font-display text-lg lg:text-2xl text-[#330043] mt-1">
            Escaneie o QR Code de uma posição livre para entrar na Arena MDX
          </h2>
          <p className="text-xs text-[#6E4F7D] font-medium mt-0.5">
            A partida inicia automaticamente ao completar {MAX_ROOM_PLAYERS} participantes ou ao final do relógio ao lado.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Relógio Único em Lugar de Destaque */}
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-br from-[#FAF5FF] to-[#FEF0ED] border-2 border-[#9747FF]/45 shadow-[0_8px_24px_rgba(151,71,255,0.14)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#DDC7F8] flex items-center justify-center shrink-0 shadow-2xs">
              <Clock className="w-5 h-5 text-[#FF4A97]" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#9747FF]">
                Início Automático
              </div>
              <div className="font-orbitron font-black text-2xl lg:text-3xl text-[#330043] leading-none mt-0.5">
                {formatTimer(lobbyTimeLeft)}
              </div>
            </div>
          </div>

          {canManage && <button
            type="button"
            onClick={() => setConfirmation({ text: `Iniciar agora a rodada da sala ${roomCode}? As posições vagas serão preenchidas por bots.`, action: () => startWithBotsNow(roomCode) })}
            className="bg-purple-pink bg-gradient-to-r from-[#9747FF] to-[#FF4A97] hover:opacity-95 text-white font-semibold text-sm px-5 py-3.5 rounded-full shadow-sm inline-flex items-center gap-2 cursor-pointer transition-all whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            <span>Iniciar agora com Bot Mermã</span>
          </button>}
        </div>
      </div>

      {/* 5 Posições de Jogadores Lado a Lado */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 flex-1 min-h-0 items-stretch overflow-hidden">
        {ALL_PLAYER_SLOTS.map((slotNum) => {
          const player = players.find((p) => p.slot === slotNum);

          if (player) {
            const tier = getPlayerPowerTier({
              highScore: player.highScore,
              winsCount: player.winsCount,
              matchesPlayed: player.matchesPlayed,
            });
            const careerBadges = getCareerAchievements({
              highScore: player.highScore,
              winsCount: player.winsCount,
              matchesPlayed: player.matchesPlayed,
            });

            return (
              <motion.div
                key={`slot-${slotNum}-filled`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-4 border-2 border-[#9747FF]/40 shadow-[0_12px_36px_rgba(51,0,67,0.06)] flex flex-col items-center justify-between text-center min-h-0 overflow-hidden"
              >
                <div className="w-full flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold text-[#545454] bg-[#FAF7FF] px-2.5 py-0.5 rounded-full border border-[#E9D8FD]">
                    Slot #{slotNum}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Pronta</span>
                    </span>
                    {canManage && <button
                      type="button"
                      onClick={() =>
                        handleKick(
                          player.nickname,
                          player.id,
                          player.slot
                        )
                      }
                      title={`Remover ${player.nickname} da rodada`}
                      className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      <UserX className="w-3 h-3 text-red-500" />
                      <span>Kick</span>
                    </button>}
                  </div>
                </div>

                <div className="my-2 flex flex-col items-center min-w-0 w-full">
                  <AvatarBadge
                    avatar={player.avatar}
                    size="lg"
                    isBot={player.isBot}
                    highlight
                    frameId={tier.frameId}
                    powerLevel={tier.level}
                    className="mb-2.5"
                  />
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border mb-1 whitespace-nowrap ${tier.pillClass}`}
                  >
                    <BadgeVectorIcon iconKey={tier.icon} className="w-3 h-3" />
                    <span>{tier.shortTitle}</span>
                  </span>
                  <h3 className="font-display text-lg lg:text-xl text-[#330043] truncate max-w-full mb-1.5">
                    {player.nickname}
                  </h3>

                  {careerBadges.length > 0 && (
                    <div className="w-full px-2 mb-2">
                      <AchievementMarqueeStrip
                        achievementIds={careerBadges}
                        size="sm"
                        className="justify-center"
                      />
                    </div>
                  )}

                  <PlayerStatsBadges
                    highScore={player.highScore}
                    winsCount={player.winsCount}
                    matchesPlayed={player.matchesPlayed}
                    size="xs"
                    showTitleBadge={false}
                    className="justify-center"
                  />
                </div>

                <p className="text-[11px] text-[#545454] bg-[#FAF7FF] w-full py-2 px-3 rounded-2xl border border-[#F3E8FF]">
                  Olhe para o celular ao iniciar
                </p>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={`slot-${slotNum}-empty`}
              initial={{ opacity: 0.85 }}
              animate={{ opacity: 1 }}
              className="bg-white/60 rounded-3xl p-4 border-2 border-dashed border-[#DDC7F8] flex flex-col items-center justify-between text-center min-h-0 overflow-hidden"
            >
              <div className="w-full flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-[#545454] bg-white px-2.5 py-0.5 rounded-full border border-[#E9D8FD]">
                  Slot #{slotNum}
                </span>
                <span className="text-[11px] font-medium text-[#9747FF] animate-pulse">
                  Livre...
                </span>
              </div>

              <div className="my-2 flex flex-col items-center">
                <div className="p-3 rounded-2xl bg-white border border-[#E9D8FD] shadow-xs mb-2.5">
                  {isOpen ? <QRCodeSVG value={playUrl} size={116} bgColor="#FFFFFF" fgColor="#330043" /> : <p className="text-sm">Entradas fechadas</p>}
                </div>
                <p className="font-semibold text-sm text-[#330043]">
                  Escaneie para o Slot #{slotNum}
                </p>
                <p className="text-[11px] text-[#545454] mt-0.5">
                  Vaga disponível nesta rodada
                </p>
              </div>

              {isOpen && <a
                href={playUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-[#9747FF] hover:text-[#FF4A97] inline-flex items-center gap-1"
              >
                <span>Entrar pelo navegador</span>
                <ExternalLink className="w-3 h-3" />
              </a>}
            </motion.div>
          );
        })}
      </div>
      <AccessibleDialog open={Boolean(confirmation) && canManage} title={`Confirmar ação · ${roomCode}`} onClose={() => setConfirmation(null)}>
        <p>{confirmation?.text}</p><div className="flex gap-3 mt-5"><button className="px-4 rounded-xl border border-[#DDC7F8]" onClick={() => setConfirmation(null)}>Cancelar</button><button disabled={busy} className="px-4 rounded-xl border border-red-200 text-red-800" onClick={async () => {
          if (!confirmation || busy || !canManage) return; setBusy(true); setError('');
          try { const response = await confirmation.action(); if (!response.ok) setError(response.error || 'Ação recusada. Atualize a sala.'); }
          catch { setError('Falha de conexão. Atualize antes de repetir.'); }
          finally { setBusy(false); setConfirmation(null); }
        }}>{busy ? 'Aguarde…' : 'Confirmar'}</button></div>
      </AccessibleDialog>
    </motion.div>
  );
});
