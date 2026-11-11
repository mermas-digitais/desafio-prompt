import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { formatTimer } from '../../helpers/formatters';
import { AvatarBadge } from '../AvatarBadge';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import { getPlayerPowerTier, type PlayerPowerTierInfo } from '../../../shared/achievements';
import { ALL_PLAYER_SLOTS, MAX_ROOM_PLAYERS, type RoomPlayer } from '../../../shared/types';

export interface PlayLobbyCardProps {
  myRoomSlot: RoomPlayer;
  myPowerTier: PlayerPowerTierInfo;
  onLeaveRoom: () => void;
}

export const PlayLobbyCard: React.FC<PlayLobbyCardProps> = React.memo(
  ({ myRoomSlot, myPowerTier, onLeaveRoom }) => {
    const players = useGameStore((s) => s.roomState.players);
    const lobbyTimeLeft = useGameStore((s) => s.roomState.lobbyTimeLeft);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mermas-card p-5 md:p-6 flex flex-col items-center text-center gap-5"
      >
        <span className="px-3.5 py-1 rounded-full bg-[#FEF0ED] border border-pink-200 text-[#D01F6B] font-quicksand font-bold text-xs">
          Você está no Slot #{myRoomSlot.slot} da TV
        </span>

        <AvatarBadge
          avatar={myRoomSlot.avatar}
          size="lg"
          frameId={myPowerTier.frameId}
          powerLevel={myPowerTier.level}
          highlight
        />

        <div>
          <h2 className="font-display text-2xl text-[#330043]">{myRoomSlot.nickname}</h2>
          <div className="inline-flex items-center gap-1.5 text-xs font-quicksand font-bold text-[#9747FF] mt-0.5">
            <BadgeVectorIcon iconKey={myPowerTier.icon} className="w-3.5 h-3.5 shrink-0" />
            <span>{myPowerTier.title}</span>
            <span>• {myPowerTier.powerScore} PWR</span>
          </div>
          <p className="font-quicksand text-xs text-[#545454] mt-1">
            Aguardando até {MAX_ROOM_PLAYERS} participantes para começar ({players.length}/
            {MAX_ROOM_PLAYERS} na sala)
          </p>
        </div>

        {/* Participantes na sala */}
        <div className="w-full grid grid-cols-5 gap-1.5">
          {ALL_PLAYER_SLOTS.map((slotNum) => {
            const p = players.find((pl) => pl.slot === slotNum);
            const pTier = p ? getPlayerPowerTier(p) : null;
            return (
              <div
                key={slotNum}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 ${
                  p
                    ? 'bg-[#FAF7FF] border-[#DDC7F8]'
                    : 'bg-gray-50/70 border-dashed border-gray-200 opacity-70'
                }`}
              >
                <span className="text-[10px] font-quicksand font-bold text-[#6E4F7D]">
                  Slot #{slotNum}
                </span>
                {p && pTier ? (
                  <>
                    <AvatarBadge
                      avatar={p.avatar}
                      size="sm"
                      isBot={p.isBot}
                      frameId={pTier.frameId}
                      powerLevel={pTier.level}
                    />
                    <span className="font-quicksand font-bold text-xs text-[#330043] truncate max-w-full mt-1.5">
                      {p.nickname}
                    </span>
                  </>
                ) : (
                  <div className="h-14 flex items-center justify-center text-[11px] font-quicksand text-[#6E4F7D]">
                    Livre...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contador de 1m30s do Lobby */}
        <div className="w-full p-4 rounded-2xl bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-between gap-3">
          <div className="text-left">
            <div className="text-xs font-quicksand font-bold text-[#330043]">
              Início automático na TV
            </div>
            <div className="text-[11px] font-quicksand text-[#6E4F7D]">
              A partida inicia automaticamente quando os {MAX_ROOM_PLAYERS} slots preencherem ou ao
              final do cronômetro
            </div>
          </div>
          <div className="font-orbitron font-bold text-2xl text-[#9747FF] shrink-0">
            {formatTimer(lobbyTimeLeft)}
          </div>
        </div>

        <div className="w-full flex flex-col">
          <button
            type="button"
            onClick={onLeaveRoom}
            className="w-full py-2 text-xs font-quicksand font-semibold text-[#6E4F7D] hover:text-rose-600 inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da rodada</span>
          </button>
        </div>
      </motion.div>
    );
  }
);
