import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, QrCode, Trophy, RefreshCw, Award, ArrowRight } from 'lucide-react';
import { AvatarBadge } from '../AvatarBadge';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import {
  ACHIEVEMENTS_CATALOG,
  type AchievementId,
  type PlayerPowerTierInfo,
} from '../../../shared/achievements';
import type { ExpiredRoundSummary, PlayerProfile } from '../../../shared/types';

export interface PlayExpiredQrViewProps {
  roomName?: string;
  roomCode?: string;
  roundToken?: string;
  profile: PlayerProfile | null;
  myPowerTier: PlayerPowerTierInfo;
  myAchievements: AchievementId[];
  expiredRoundData: ExpiredRoundSummary | null;
  onRefreshCheck?: () => void;
  onViewPodium?: () => void;
}

export const PlayExpiredQrView: React.FC<PlayExpiredQrViewProps> = ({
  roomName,
  roomCode,
  roundToken,
  profile,
  myPowerTier,
  myAchievements,
  expiredRoundData,
  onRefreshCheck,
  onViewPodium,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 w-full max-w-md mx-auto"
    >
      {/* CARD DE ALERTA DE QR CODE EXPIRADO */}
      <div className="mermas-card p-6 border-amber-200 bg-gradient-to-b from-amber-50/90 to-white text-center flex flex-col items-center gap-4 relative overflow-hidden shadow-md">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center shadow-inner">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 font-quicksand font-bold text-xs uppercase tracking-wider mb-2">
            Rodada Encerrada
          </span>
          <h2 className="font-display text-2xl text-[#330043]">
            Este QR Code Expirou!
          </h2>
          <p className="font-quicksand text-sm text-[#545454] mt-2 leading-relaxed">
            Cada rodada gera um QR Code exclusivo e temporário no telão da sala{' '}
            <strong className="text-[#9747FF]">{roomName || roomCode || 'MDX26'}</strong> para garantir que apenas quem está presente participe.
          </p>
        </div>

        <div className="w-full p-4 rounded-2xl bg-[#FBF9FE] border border-[#E9DDF8] flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#F0E6FF] text-[#9747FF] flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="text-xs font-quicksand text-[#4A3B52] leading-snug">
            <strong className="block text-[#330043] font-bold">O que fazer agora?</strong>
            Aponte a câmera do seu celular para o <strong>QR Code ativo</strong> exibido agora na tela da TV!
          </div>
        </div>

        {onRefreshCheck && (
          <button
            type="button"
            onClick={onRefreshCheck}
            className="inline-flex items-center gap-2 text-xs font-quicksand font-bold text-[#9747FF] hover:text-[#7B2CBF] transition-colors py-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Verificar se a sala atualizou
          </button>
        )}
      </div>

      {/* SE HOUVER DADOS DA RODADA FINALIZADA DESTE QR CODE */}
      {expiredRoundData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mermas-card p-5 border-[#E9DDF8] flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#9747FF] font-display text-sm font-bold">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Resumo Desta Partida</span>
            </div>
            {expiredRoundData.winnerNickname && (
              <span className="text-[11px] font-quicksand font-bold px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
                1º: {expiredRoundData.winnerNickname} ({expiredRoundData.winnerScore} pts)
              </span>
            )}
          </div>

          <p className="text-xs font-quicksand text-[#545454]">
            Desafio:{' '}
            <strong className="text-[#330043]">
              {expiredRoundData.challengeTitle || 'Desafio Criativo'}
            </strong>{' '}
            • {expiredRoundData.evaluations.length} participantes
          </p>

          {onViewPodium && (
            <button
              type="button"
              onClick={onViewPodium}
              className="mt-1 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9747FF] to-[#D01F6B] text-white font-quicksand font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              Ver Pódio & Compartilhar Card
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </motion.div>
      )}

      {/* CONTA DO JOGADOR PRESERVADA */}
      {profile && (
        <div className="mermas-card p-5 border-[#E9DDF8] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <AvatarBadge
              avatar={profile.avatar}
              size="md"
              frameId={myPowerTier.frameId}
              powerLevel={myPowerTier.level}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-lg text-[#330043] truncate">
                  {profile.nickname}
                </span>
                <span className="text-[10px] font-quicksand font-bold px-2 py-0.5 rounded-full bg-[#F5F0FF] text-[#9747FF] border border-[#E0D0F5]">
                  Lvl {myPowerTier.level}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-quicksand font-bold text-[#9747FF] mt-0.5">
                <BadgeVectorIcon iconKey={myPowerTier.icon} className="w-3.5 h-3.5" />
                <span>{myPowerTier.title}</span>
                <span>• {myPowerTier.powerScore} PWR</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#F0E6FF] text-center">
            <div className="p-2 rounded-xl bg-[#FAF7FF]">
              <span className="text-[10px] font-quicksand font-bold text-[#6E4F7D] block">Partidas</span>
              <span className="text-sm font-display text-[#330043]">{profile.matchesPlayed || 0}</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF7FF]">
              <span className="text-[10px] font-quicksand font-bold text-[#6E4F7D] block">Vitórias</span>
              <span className="text-sm font-display text-amber-600">{profile.winsCount || 0}</span>
            </div>
            <div className="p-2 rounded-xl bg-[#FAF7FF]">
              <span className="text-[10px] font-quicksand font-bold text-[#6E4F7D] block">Recorde</span>
              <span className="text-sm font-display text-[#9747FF]">{profile.highScore || 0} pts</span>
            </div>
          </div>

          {myAchievements.length > 0 && (
            <div className="pt-2 border-t border-[#F0E6FF]">
              <span className="text-[11px] font-quicksand font-bold text-[#6E4F7D] flex items-center gap-1 mb-2">
                <Award className="w-3.5 h-3.5 text-[#D01F6B]" />
                Conquistas Desbloqueadas ({myAchievements.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {myAchievements.slice(0, 6).map((achId) => {
                  const def = ACHIEVEMENTS_CATALOG[achId];
                  if (!def) return null;
                  return (
                    <span
                      key={achId}
                      title={def.description}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-pink-50/80 border border-pink-200 text-[10px] font-quicksand font-bold text-[#D01F6B]"
                    >
                      <BadgeVectorIcon iconKey={def.icon} className="w-3 h-3" />
                      {def.title}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
