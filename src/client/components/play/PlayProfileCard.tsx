import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Award,
  Camera,
  Edit3,
  Hourglass,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { AvatarBadge, AVATAR_OPTIONS, isCustomPhotoAvatar } from '../AvatarBadge';
import { PlayerStatsBadges } from '../PlayerStatsBadges';
import { BadgeVectorIcon } from '../BadgeVectorIcon';
import {
  ACHIEVEMENTS_CATALOG,
  type AchievementId,
  type PlayerPowerTierInfo,
} from '../../../shared/achievements';
import type { AvatarId, PlayerProfile } from '../../../shared/types';

export interface PlayProfileCardProps {
  profile: PlayerProfile | null;
  nickname: string;
  selectedAvatar: AvatarId;
  isEditingProfile: boolean;
  errorMsg: string | null;
  suggestions: string[];
  isSubmittingJoin: boolean;
  myPowerTier: PlayerPowerTierInfo;
  myAchievements: AchievementId[];
  onSetNickname: (val: string) => void;
  onSetSelectedAvatar: (avatar: AvatarId) => void;
  onSetIsEditingProfile: (editing: boolean) => void;
  onClearError: () => void;
  onPhotoUploadChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveOrJoin: (e?: React.FormEvent) => void;
}

export const PlayProfileCard: React.FC<PlayProfileCardProps> = React.memo(
  ({
    profile,
    nickname,
    selectedAvatar,
    isEditingProfile,
    errorMsg,
    suggestions,
    isSubmittingJoin,
    myPowerTier,
    myAchievements,
    onSetNickname,
    onSetSelectedAvatar,
    onSetIsEditingProfile,
    onClearError,
    onPhotoUploadChange,
    onSaveOrJoin,
  }) => {
    const phase = useGameStore((s) => s.roomState.phase);
    const playersCount = useGameStore((s) => s.roomState.players.length);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mermas-card p-5 md:p-6 flex flex-col gap-4"
      >
        {profile && !isEditingProfile ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                <AvatarBadge
                  avatar={profile.avatar}
                  size="md"
                  frameId={myPowerTier.frameId}
                  powerLevel={myPowerTier.level}
                  highlight
                />
                <div className="min-w-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-quicksand font-bold whitespace-nowrap ${myPowerTier.pillClass}`}
                  >
                    <BadgeVectorIcon iconKey={myPowerTier.icon} className="w-3 h-3 shrink-0" />
                    <span>{myPowerTier.title}</span>
                    <span className="opacity-80">• {myPowerTier.powerScore} PWR</span>
                  </span>
                  <h1 className="font-display text-xl text-[#330043] truncate mt-1">
                    Olá, {profile.nickname}!
                  </h1>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSetIsEditingProfile(true)}
                title="Editar perfil"
                aria-label="Editar perfil"
                className="w-9 h-9 rounded-full bg-[#FAF7FF] hover:bg-[#F5F0FF] border border-[#DDC7F8] flex items-center justify-center text-[#9747FF] transition-colors cursor-pointer shrink-0"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* Barra de Progresso de Poder até o Próximo Título */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7FF] border border-[#DDC7F8]/80 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-quicksand font-bold gap-2">
                <span className="inline-flex items-center gap-1 text-[#330043] whitespace-nowrap">
                  <Zap className="w-3.5 h-3.5 text-[#9747FF]" />
                  <span>
                    Nível {myPowerTier.level} • {myPowerTier.powerScore} PWR
                  </span>
                </span>
                <span className="text-[#9747FF] truncate">
                  {myPowerTier.nextTierTitle
                    ? `Próximo: ${myPowerTier.nextTierTitle}`
                    : 'Nível Máximo Lendário'}
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-[#F5F0FF] overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-pink transition-all duration-500"
                  style={{ width: `${myPowerTier.progressPercent}%` }}
                />
              </div>

              <PlayerStatsBadges
                highScore={profile.highScore}
                totalScore={profile.totalScore}
                winsCount={profile.winsCount}
                matchesPlayed={profile.matchesPlayed}
                showTitleBadge={false}
                size="xs"
              />
            </div>

            {/* Fileira de Insígnias / Conquistas Desbloqueadas */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-quicksand font-bold text-[#6E4F7D]">
                <span className="inline-flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#FF4A97]" />
                  <span>Suas Conquistas ({myAchievements.length}/12)</span>
                </span>
                <span>Ganhe +PWR jogando</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(ACHIEVEMENTS_CATALOG) as AchievementId[]).map((achId) => {
                  const def = ACHIEVEMENTS_CATALOG[achId];
                  const unlocked = myAchievements.includes(achId);
                  return (
                    <div
                      key={achId}
                      title={`${def.title}: ${def.description} (+${def.powerBonus} PWR)`}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-quicksand font-bold whitespace-nowrap transition-all ${
                        unlocked
                          ? def.badgeBgClass
                          : 'bg-gray-50 border-gray-200 text-gray-400 opacity-60'
                      }`}
                    >
                      <BadgeVectorIcon iconKey={def.icon} className="w-3 h-3 shrink-0" />
                      <span>{def.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-quicksand font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {phase === 'IDLE' || phase === 'LOBBY' ? (
              <button
                type="button"
                disabled={isSubmittingJoin}
                onClick={() => onSaveOrJoin()}
                className="w-full bg-purple-pink py-4 px-5 rounded-2xl font-semibold text-base text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Zap className="w-5 h-5" />
                <span>Entrar na Rodada ({playersCount}/5 vagas)</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F5F0FF] border border-[#DDC7F8] text-center space-y-1.5">
                <div className="font-display text-base text-[#330043] inline-flex items-center justify-center gap-1.5">
                  <Hourglass className="w-4 h-4 text-[#9747FF]" />
                  <span>Rodada em andamento na TV</span>
                </div>
                <p className="font-quicksand text-xs text-[#545454]">
                  Acompanhe a revelação no telão! Assim que terminar, o botão para entrar na próxima
                  partida abrirá automaticamente.
                </p>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={onSaveOrJoin} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-quicksand font-bold text-[#FF4A97]">
                  <Sparkles className="w-3.5 h-3.5" /> Mermãs Digitais
                </span>
                <h1 className="font-display text-xl text-[#330043]">
                  {profile ? 'Editar seu perfil' : 'Crie seu perfil de jogadora'}
                </h1>
              </div>
              {profile && (
                <button
                  type="button"
                  onClick={() => {
                    onSetIsEditingProfile(false);
                    onClearError();
                  }}
                  className="buttonCircle w-8 h-8 cursor-pointer"
                  aria-label="Fechar edição"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Preview do Avatar / Foto + Botão para Enviar Selfie ou Foto da Galeria */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7FF] border border-[#DDC7F8] flex items-center gap-3.5">
              <AvatarBadge
                avatar={selectedAvatar}
                size="lg"
                frameId={myPowerTier.frameId}
                powerLevel={myPowerTier.level}
                highlight
              />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="font-quicksand text-xs font-bold text-[#330043]">
                  Sua foto ou ícone no telão
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPhotoUploadChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#F5F0FF] border border-[#9747FF]/50 text-[#330043] font-quicksand font-bold text-xs inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#FF4A97] shrink-0" />
                  <span>Tirar Selfie ou Escolher Foto</span>
                </button>
                {isCustomPhotoAvatar(selectedAvatar) && (
                  <p className="text-[11px] font-quicksand font-semibold text-emerald-700">
                    Foto personalizada selecionada!
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block font-quicksand text-xs font-bold text-[#545454] mb-1.5">
                Como você quer aparecer no telão?
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  onSetNickname(e.target.value);
                  if (errorMsg) onClearError();
                }}
                placeholder="Ex: Mermã Cyber, AdaTech..."
                maxLength={26}
                className="mermas-input w-full px-4 py-3 font-quicksand font-bold text-base"
              />
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                <div className="font-semibold flex items-center gap-1.5 text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>

                {suggestions.length > 0 && (
                  <div>
                    <div className="text-[11px] font-quicksand font-bold text-[#6E4F7D] mb-1.5">
                      Toque em uma sugestão disponível:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => {
                            onSetNickname(sug);
                            onClearError();
                          }}
                          className="px-3 py-1 rounded-full bg-white hover:bg-[#F5F0FF] border border-[#DDC7F8] text-[#330043] font-quicksand font-bold text-xs cursor-pointer"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block font-quicksand text-xs font-bold text-[#545454] mb-2">
                Ou escolha um ícone oficial MDX:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_OPTIONS.map((opt) => {
                  const isSelected = selectedAvatar === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onSetSelectedAvatar(opt.id)}
                      className={`p-2 rounded-2xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FEF0ED] border-[#FF4A97] ring-2 ring-[#FF4A97]/20 scale-[1.02]'
                          : 'bg-[#FAF7FF] border-[#DDC7F8]/70 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={opt.src}
                        alt={opt.label}
                        decoding="async"
                        className="w-10 h-10 object-contain"
                      />
                      <span className="font-quicksand text-[10px] font-bold text-[#330043] truncate max-w-full">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingJoin}
              className="w-full bg-purple-pink py-3.5 px-5 rounded-2xl font-semibold text-base text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Zap className="w-4 h-4" />
              <span>
                {phase === 'IDLE' || phase === 'LOBBY'
                  ? 'Salvar e Entrar na Rodada'
                  : 'Salvar meu Perfil'}
              </span>
            </button>
          </form>
        )}
      </motion.div>
    );
  }
);
