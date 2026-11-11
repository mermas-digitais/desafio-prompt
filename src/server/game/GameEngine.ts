import crypto from 'node:crypto';
import type { Server as SocketIOServer } from 'socket.io';
import { database } from '../db/index.js';
import { OFFICIAL_CHALLENGES, type ChallengeSeedData } from '../db/challengesData.js';
import { evaluateRoundPrompts } from '../ai/promptEvaluator.js';
import {
  evaluateRoundAchievements,
  getPlayerPowerTier,
} from '../../shared/achievements.js';
import {
  ALL_PLAYER_SLOTS,
  MAX_ROOM_PLAYERS,
  type AvatarId,
  type ChallengePublicView,
  type ExpiredRoundSummary,
  type GamePhase,
  type GameRoomState,
  type LeaderboardsPayload,
  type PlayerProfile,
  type PlayerRoundEvaluation,
  type PlayerSlot,
  type RoomPlayer,
} from '../../shared/types.js';

interface BotTargetSchedule {
  slot: PlayerSlot;
  startTypingAt: number; // ex: 75s
  lockPromptAt: number;  // entre 45s e 20s
  chosenPrompt: string;
}

const BOT_PROFILES: Array<{ nickname: string; avatar: AvatarId }> = [
  { nickname: 'Mermã Bot IA', avatar: 'ia' },
  { nickname: 'Lovelace Bot', avatar: 'robo' },
  { nickname: 'Bumba CyberBot', avatar: 'game' },
  { nickname: 'Ada NeuralBot', avatar: 'codigo' },
  { nickname: 'Cazuza TechBot', avatar: 'ciencia' },
];

export class GameEngine {
  private io: SocketIOServer;
  private roomCode: string;
  private roomName: string;
  private isOpen: boolean;
  private roundId: string;
  private roundToken: string;
  private completedRounds = new Map<string, ExpiredRoundSummary>();

  private phase: GamePhase = 'IDLE';
  private lobbyTimeLeft = 90;
  private roundTimeLeft = 90;
  private countdownLeft = 3;
  private blurPx = 16;
  private players: RoomPlayer[] = [];
  private currentChallenge: ChallengeSeedData | null = null;
  private challengeDeck: ChallengeSeedData[] = [];
  private evaluations: PlayerRoundEvaluation[] = [];
  private currentRevealIndex = 0;
  private revealStepTimer = 8;
  private podiumTimeLeft = 10;
  private leaderboards: LeaderboardsPayload = {
    general: [],
    points: [],
    wins: [],
    stats: { totalPlayers: 0, totalMatches: 0, highestScoreEver: 0 },
  };

  private tickInterval: NodeJS.Timeout | null = null;
  private botSchedules: BotTargetSchedule[] = [];
  private isEvaluating = false;

  constructor(
    io: SocketIOServer,
    roomCode = 'MDX26',
    roomName = 'Arena MDX Principal',
    isOpen = true
  ) {
    this.io = io;
    this.roomCode = roomCode.toUpperCase().trim();
    this.roomName = roomName;
    this.isOpen = isOpen;
    this.roundId = `rnd_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
    this.roundToken = `rt_${this.roomCode.toLowerCase()}_${this.roundId}`;
  }

  public generateNewRoundToken(): string {
    this.roundId = `rnd_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
    this.roundToken = `rt_${this.roomCode.toLowerCase()}_${this.roundId}`;
    return this.roundToken;
  }

  private archiveCurrentRound(): void {
    if (this.evaluations.length === 0) return;
    const sorted = [...this.evaluations].sort((a, b) => b.totalScore - a.totalScore);
    const winner = sorted[0];
    this.completedRounds.set(this.roundToken, {
      roundId: this.roundId,
      roundToken: this.roundToken,
      roomCode: this.roomCode,
      roomName: this.roomName,
      finishedAt: new Date().toISOString(),
      challengeTitle: this.currentChallenge?.title || 'Desafio de Prompt',
      challengeImageUrl: this.currentChallenge?.imageUrl || '',
      winnerNickname: winner ? winner.nickname : null,
      winnerScore: winner ? winner.totalScore : null,
      evaluations: [...this.evaluations],
    });
  }

  public validateRoundToken(token?: string): {
    valid: boolean;
    status: 'ACTIVE' | 'EXPIRED' | 'NOT_FOUND' | 'ROOM_CLOSED';
    roomName: string;
    roomCode: string;
    roundData?: ExpiredRoundSummary;
  } {
    if (!this.isOpen) {
      return {
        valid: false,
        status: 'ROOM_CLOSED',
        roomName: this.roomName,
        roomCode: this.roomCode,
      };
    }

    if (!token) {
      return {
        valid: false,
        status: 'NOT_FOUND',
        roomName: this.roomName,
        roomCode: this.roomCode,
      };
    }

    if (token === this.roundToken) {
      return {
        valid: true,
        status: 'ACTIVE',
        roomName: this.roomName,
        roomCode: this.roomCode,
      };
    }

    const archived = this.completedRounds.get(token);
    if (archived) {
      return {
        valid: false,
        status: 'EXPIRED',
        roomName: this.roomName,
        roomCode: this.roomCode,
        roundData: archived,
      };
    }

    return {
      valid: false,
      status: 'EXPIRED',
      roomName: this.roomName,
      roomCode: this.roomCode,
    };
  }

  public openRoom(params: { name?: string }): { ok: boolean } {
    if (params.name) {
      this.roomName = params.name.trim();
    }
    this.isOpen = true;
    this.generateNewRoundToken();
    this.broadcastState();
    return { ok: true };
  }

  public closeRoom(): void {
    this.isOpen = false;
    this.resetToIdle();
    this.broadcastState();
  }

  public kickPlayer(
    playerIdOrSlot: string | number,
    reason = 'Removido pelo moderador da sala'
  ): { kicked: boolean; player?: RoomPlayer } {
    const idx = this.players.findIndex(
      (p) =>
        p.id === playerIdOrSlot ||
        p.slot === playerIdOrSlot ||
        p.deviceId === playerIdOrSlot
    );
    if (idx === -1) return { kicked: false };

    const removed = this.players.splice(idx, 1)[0];
    if (removed.socketId) {
      this.io.to(removed.socketId).emit('player:kicked', {
        reason,
        roomCode: this.roomCode,
        roomName: this.roomName,
      });
    }

    if (this.phase === 'LOBBY' || this.phase === 'IDLE') {
      const remainingHumans = this.players.filter((p) => !p.isBot);
      if (remainingHumans.length === 0) {
        this.resetToIdle();
        return { kicked: true, player: removed };
      }
    }

    this.broadcastState();
    return { kicked: true, player: removed };
  }

  public async start(): Promise<void> {
    this.leaderboards = await database.getLeaderboards();
    this.pickNextChallenge();

    if (this.tickInterval) clearInterval(this.tickInterval);
    this.tickInterval = setInterval(() => {
      this.tick().catch((err) => console.error('❌ [GameEngine] Erro no tick:', err));
    }, 1000);
  }

  private refillAndShuffleDeck(): void {
    const shuffled = [...OFFICIAL_CHALLENGES];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = crypto.randomInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Evita que a primeira imagem do novo baralho seja idêntica à última jogada
    if (
      this.currentChallenge &&
      shuffled.length > 1 &&
      shuffled[0].id === this.currentChallenge.id
    ) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    this.challengeDeck = shuffled;
  }

  private pickNextChallenge(): ChallengeSeedData {
    if (this.challengeDeck.length === 0) {
      this.refillAndShuffleDeck();
    }
    const next = this.challengeDeck.shift() || OFFICIAL_CHALLENGES[0];
    this.currentChallenge = next;
    return this.currentChallenge;
  }

  private buildMaskedTokens(
    challenge: ChallengeSeedData,
    roundTimeLeft: number,
    forceRevealAll: boolean
  ): ChallengePublicView['maskedPromptTokens'] {
    const tokens: ChallengePublicView['maskedPromptTokens'] = [];

    const pushLayerWords = (text: string, layer: 'subject' | 'style' | 'environment') => {
      const words = text.split(/\s+/).filter(Boolean);
      words.forEach((word, index) => {
        let isRevealed = forceRevealAll;

        if (!isRevealed) {
          const cleanWord = word.replace(/[^a-zA-ZÀ-ÿ0-9]/g, '').toLowerCase();
          // Palavras curtas de ligação (de, em, um, uma, com, por, nas, ao) ajudam na estrutura
          const isConnector = cleanWord.length <= 3;

          if (roundTimeLeft <= 60 && layer === 'style') {
            // Aos 60s revela ~25% das palavras da camada de estilo
            if (index % 4 === 0 || isConnector) {
              isRevealed = true;
            }
          }

          if (roundTimeLeft <= 30) {
            // Aos 30s revela ~50% das palavras-chave para dar emoção final
            if (index % 2 === 0 || isConnector) {
              isRevealed = true;
            }
          }
        }

        tokens.push({
          text: word,
          isRevealed,
          layer,
        });
      });
    };

    pushLayerWords(challenge.subjectLayer, 'subject');
    pushLayerWords(challenge.environmentLayer, 'environment');
    pushLayerWords(challenge.styleLayer, 'style');

    return tokens;
  }

  private buildChallengePublicView(): ChallengePublicView | null {
    if (!this.currentChallenge) return null;

    const c = this.currentChallenge;
    const isFullReveal = this.phase === 'REVEALING' || this.phase === 'PODIUM';
    const unlockedHints: string[] = [];

    if (this.phase === 'PLAYING' || this.phase === 'EVALUATING' || isFullReveal) {
      if (this.roundTimeLeft <= 60 || isFullReveal) {
        unlockedHints.push(c.hint1);
      }
      if (this.roundTimeLeft <= 30 || isFullReveal) {
        unlockedHints.push(c.hint2);
      }
    }

    const maskedPromptTokens = this.buildMaskedTokens(c, this.roundTimeLeft, isFullReveal);

    return {
      id: c.id,
      title: c.title,
      category: c.category,
      difficulty: c.difficulty,
      imageUrl: c.imageUrl,
      wordCount: maskedPromptTokens.length,
      maskedPromptTokens,
      unlockedHints,
      ...(isFullReveal
        ? {
            fullPrompt: c.fullPrompt,
            layers: {
              subject: c.subjectLayer,
              style: c.styleLayer,
              environment: c.environmentLayer,
            },
          }
        : {}),
    };
  }

  public getState(): GameRoomState {
    return {
      roomCode: this.roomCode,
      roomName: this.roomName,
      isOpen: this.isOpen,
      roundId: this.roundId,
      roundToken: this.roundToken,
      phase: this.phase,
      lobbyTimeLeft: this.lobbyTimeLeft,
      roundTimeLeft: this.roundTimeLeft,
      countdownLeft: this.countdownLeft,
      blurPx: this.blurPx,
      players: [...this.players].sort((a, b) => a.slot - b.slot),
      challenge: this.buildChallengePublicView(),
      evaluations: this.evaluations,
      currentRevealIndex: this.currentRevealIndex,
      revealStepTimer: this.revealStepTimer,
      leaderboards: this.leaderboards,
    };
  }

  public broadcastState(): void {
    const state = this.getState();
    this.io.to(this.roomCode).emit('room:state', state);
    if (this.roomCode === 'MDX26') {
      this.io.emit('room:state', state);
    }
  }

  public async refreshLeaderboards(): Promise<LeaderboardsPayload> {
    this.leaderboards = await database.getLeaderboards();
    this.broadcastState();
    return this.leaderboards;
  }

  public joinRoom(
    profile: PlayerProfile,
    socketId: string,
    roundToken?: string
  ): {
    joined: boolean;
    slot?: PlayerSlot;
    reason?: string;
    expired?: boolean;
    roundData?: ExpiredRoundSummary;
    state: GameRoomState;
  } {
    if (!this.isOpen) {
      return {
        joined: false,
        reason: 'Esta sala ainda não foi declarada aberta pelo moderador na TV.',
        state: this.getState(),
      };
    }

    if (roundToken && roundToken !== this.roundToken) {
      const archived = this.completedRounds.get(roundToken);
      return {
        joined: false,
        expired: true,
        roundData: archived,
        reason: 'Este QR Code expirou! A rodada foi finalizada. Aponte para o novo QR Code exibido na TV!',
        state: this.getState(),
      };
    }
    // Verifica se o jogador já está em algum slot (reconexão de celular)
    const existing = this.players.find((p) => p.deviceId === profile.deviceId);
    if (existing) {
      existing.socketId = socketId;
      existing.nickname = profile.nickname;
      existing.avatar = profile.avatar;
      existing.highScore = profile.highScore;
      existing.matchesPlayed = profile.matchesPlayed;
      existing.winsCount = profile.winsCount;
      existing.isConnected = true;
      this.broadcastState();
      return { joined: true, slot: existing.slot, state: this.getState() };
    }

    // Só aceita novos jogadores em IDLE ou LOBBY
    if (this.phase !== 'IDLE' && this.phase !== 'LOBBY') {
      return {
        joined: false,
        reason: 'Uma partida já está em andamento na TV! Aguarde alguns segundos para a próxima rodada.',
        state: this.getState(),
      };
    }

    if (this.players.length >= MAX_ROOM_PLAYERS) {
      return {
        joined: false,
        reason: 'Os 5 slots da rodada atual já estão cheios! Você entrará na próxima.',
        state: this.getState(),
      };
    }

    const usedSlots = new Set(this.players.map((p) => p.slot));
    const availableSlot = ALL_PLAYER_SLOTS.find((s) => !usedSlots.has(s));
    if (!availableSlot) {
      return {
        joined: false,
        reason: 'Sala lotada no momento.',
        state: this.getState(),
      };
    }

    const newRoomPlayer: RoomPlayer = {
      id: profile.id,
      deviceId: profile.deviceId,
      socketId,
      slot: availableSlot,
      nickname: profile.nickname,
      avatar: profile.avatar,
      highScore: profile.highScore,
      totalScore: profile.totalScore || 0,
      matchesPlayed: profile.matchesPlayed,
      winsCount: profile.winsCount,
      isBot: false,
      isConnected: true,
      isTyping: false,
      hasLockedPrompt: false,
      submittedPrompt: '',
      lockedAtRemainingSeconds: null,
    };

    this.players.push(newRoomPlayer);

    if (this.phase === 'IDLE') {
      this.phase = 'LOBBY';
      this.lobbyTimeLeft = 90;
    }

    // Se os 5 slots encheram com humanos antes de 90s -> vai para COUNTDOWN (3s) automaticamente!
    if (this.players.length === MAX_ROOM_PLAYERS && this.phase === 'LOBBY') {
      this.startCountdown();
    } else {
      this.broadcastState();
    }

    return { joined: true, slot: availableSlot, state: this.getState() };
  }

  public leaveRoom(deviceId: string): void {
    const idx = this.players.findIndex((p) => p.deviceId === deviceId);
    if (idx === -1) return;

    if (this.phase === 'IDLE' || this.phase === 'LOBBY') {
      this.players.splice(idx, 1);
      const remainingHumans = this.players.filter((p) => !p.isBot);
      if (remainingHumans.length === 0) {
        this.resetToIdle();
        return;
      }
    } else {
      this.players[idx].isConnected = false;
    }

    this.broadcastState();
  }

  public handleDisconnect(socketId: string): void {
    const player = this.players.find((p) => p.socketId === socketId);
    if (!player) return;

    if (this.phase === 'LOBBY' || this.phase === 'IDLE') {
      // Mantém no lobby por segurança caso o celular apenas piscou a tela, mas marca desconectado
      player.isConnected = false;
    } else {
      player.isConnected = false;
    }
    this.broadcastState();
  }

  public setPlayerTyping(deviceId: string, draftPrompt: string): void {
    if (this.phase !== 'PLAYING') return;
    const player = this.players.find((p) => p.deviceId === deviceId);
    if (!player || player.hasLockedPrompt) return;

    player.isTyping = draftPrompt.trim().length > 0;
    // Atualiza o rascunho para caso o tempo acabe antes de clicar em enviar!
    player.submittedPrompt = draftPrompt.slice(0, 320);
    this.broadcastState();
  }

  public submitPlayerPrompt(deviceId: string, prompt: string): {
    accepted: boolean;
    state: GameRoomState;
  } {
    if (this.phase !== 'PLAYING') {
      return { accepted: false, state: this.getState() };
    }

    const player = this.players.find((p) => p.deviceId === deviceId);
    if (!player) {
      return { accepted: false, state: this.getState() };
    }

    const cleaned = (prompt || '').trim().slice(0, 320);
    if (!cleaned) {
      return { accepted: false, state: this.getState() };
    }

    player.submittedPrompt = cleaned;
    player.hasLockedPrompt = true;
    player.isTyping = false;
    player.lockedAtRemainingSeconds = this.roundTimeLeft;

    // Verifica se todos os 3 jogadores já travaram seus palpites
    const allLocked =
      this.players.length > 0 && this.players.every((p) => p.hasLockedPrompt);

    if (allLocked) {
      this.transitionToEvaluating().catch((err) =>
        console.error('❌ [GameEngine] Erro ao avaliar:', err)
      );
    } else {
      this.broadcastState();
    }

    return { accepted: true, state: this.getState() };
  }

  public fillBotsAndStartNow(): void {
    if (this.phase !== 'LOBBY' && this.phase !== 'IDLE') return;
    this.fillEmptySlotsWithBots();
    this.startCountdown();
  }

  private fillEmptySlotsWithBots(): void {
    const usedSlots = new Set(this.players.map((p) => p.slot));
    const humanPlayers = this.players.filter((p) => !p.isBot);
    const avgHumanHigh =
      humanPlayers.length > 0
        ? Math.round(
            humanPlayers.reduce((sum, p) => sum + (p.highScore || 0), 0) /
              humanPlayers.length
          )
        : 0;
    const avgHumanMatches =
      humanPlayers.length > 0
        ? Math.round(
            humanPlayers.reduce((sum, p) => sum + (p.matchesPlayed || 0), 0) /
              humanPlayers.length
          )
        : 0;

    let botProfileIdx = 0;

    for (const slot of ALL_PLAYER_SLOTS) {
      if (!usedSlots.has(slot)) {
        const template = BOT_PROFILES[botProfileIdx % BOT_PROFILES.length];
        botProfileIdx++;

        // Equilibra o nível visual do Bot de acordo com os jogadores humanos da sala
        const factor = Math.max(0.68, 0.9 - botProfileIdx * 0.05);
        const balancedHighScore =
          avgHumanHigh > 0
            ? Math.max(180, Math.round(avgHumanHigh * factor))
            : 260;
        const balancedMatches = Math.max(1, avgHumanMatches);

        this.players.push({
          id: `bot-slot-${slot}-${crypto.randomUUID().slice(0, 8)}`,
          deviceId: `bot-device-${slot}`,
          socketId: `bot-socket-${slot}`,
          slot,
          nickname: template.nickname,
          avatar: template.avatar,
          highScore: balancedHighScore,
          totalScore: balancedHighScore * Math.max(1, balancedMatches),
          matchesPlayed: balancedMatches,
          winsCount: 0,
          isBot: true,
          isConnected: true,
          isTyping: false,
          hasLockedPrompt: false,
          submittedPrompt: '',
          lockedAtRemainingSeconds: null,
        });
      }
    }
  }

  private startCountdown(): void {
    this.pickNextChallenge();
    this.phase = 'COUNTDOWN';
    this.countdownLeft = 3;
    this.evaluations = [];
    this.currentRevealIndex = 0;
    this.blurPx = 16;
    this.broadcastState();
  }

  private startPlaying(): void {
    this.phase = 'PLAYING';
    this.roundTimeLeft = 90;
    this.blurPx = 16;

    // Reseta status de digitação/palpite dos jogadores
    for (const p of this.players) {
      p.isTyping = false;
      p.hasLockedPrompt = false;
      p.submittedPrompt = '';
      p.lockedAtRemainingSeconds = null;
    }

    // Agenda comportamento realista para os Bots Mermã (travam entre 45s e 20s restantes)
    this.botSchedules = [];
    const botPrompts = this.currentChallenge?.keywords.botPrompts ?? [
      'Ilustração digital detalhada com iluminação vibrante e cores neon',
    ];

    this.players
      .filter((p) => p.isBot)
      .forEach((bot, idx) => {
        const lockPromptAt = Math.floor(22 + Math.random() * 23); // entre 22s e 44s restantes
        const startTypingAt = Math.min(82, lockPromptAt + 25);
        const chosenPrompt = botPrompts[idx % botPrompts.length];

        this.botSchedules.push({
          slot: bot.slot,
          startTypingAt,
          lockPromptAt,
          chosenPrompt,
        });
      });

    this.broadcastState();
  }

  private async transitionToEvaluating(): Promise<void> {
    if (this.isEvaluating || this.phase === 'EVALUATING') return;
    this.isEvaluating = true;
    this.phase = 'EVALUATING';
    this.blurPx = 0;

    // Garante que qualquer bot que ainda não tinha travado receba seu prompt
    for (const bot of this.players.filter((p) => p.isBot)) {
      if (!bot.hasLockedPrompt) {
        const schedule = this.botSchedules.find((s) => s.slot === bot.slot);
        bot.submittedPrompt =
          schedule?.chosenPrompt ||
          this.currentChallenge?.keywords.botPrompts[0] ||
          this.currentChallenge?.subjectLayer ||
          '';
        bot.hasLockedPrompt = true;
        bot.isTyping = false;
        bot.lockedAtRemainingSeconds = this.roundTimeLeft;
      }
    }

    this.broadcastState();

    try {
      const challenge = this.currentChallenge ?? this.pickNextChallenge();
      const evaluations = await evaluateRoundPrompts(this.players, challenge);

      // Salva estatísticas no banco para jogadoras humanas e atualiza isNewHighScore + Conquistas & Título
      for (const ev of evaluations) {
        const roomPlayer = this.players.find((p) => p.slot === ev.slot);
        if (roomPlayer && !roomPlayer.isBot) {
          const prevTier = getPlayerPowerTier({
            highScore: roomPlayer.highScore,
            totalScore: roomPlayer.totalScore,
            winsCount: roomPlayer.winsCount,
            matchesPlayed: roomPlayer.matchesPlayed,
          });

          const { newHighScore, updatedProfile } = await database.recordPlayerRoundStats({
            deviceId: roomPlayer.deviceId,
            roundScore: ev.totalScore,
            isWinner: ev.isWinner,
          });
          ev.isNewHighScore = newHighScore;

          const afterHigh = updatedProfile ? updatedProfile.highScore : Math.max(roomPlayer.highScore, ev.totalScore);
          const afterTotal = updatedProfile ? updatedProfile.totalScore : afterHigh + ev.totalScore;
          const afterWins = updatedProfile ? updatedProfile.winsCount : roomPlayer.winsCount + (ev.isWinner ? 1 : 0);
          const afterMatches = updatedProfile ? updatedProfile.matchesPlayed : roomPlayer.matchesPlayed + 1;

          const nextTier = getPlayerPowerTier({
            highScore: afterHigh,
            totalScore: afterTotal,
            winsCount: afterWins,
            matchesPlayed: afterMatches,
          });

          ev.roundAchievements = evaluateRoundAchievements({
            subjectScore: ev.subjectScore,
            styleScore: ev.styleScore,
            detailsScore: ev.detailsScore,
            speedBonus: ev.speedBonus,
            totalScore: ev.totalScore,
            lockedAtRemainingSeconds: ev.lockedAtRemainingSeconds,
            isWinner: ev.isWinner,
            isNewHighScore: newHighScore,
            matchesPlayedAfter: afterMatches,
            winsCountAfter: afterWins,
          });

          ev.leveledUpTitle = nextTier.level > prevTier.level;
          ev.previousTitle = prevTier.title;
          ev.newTitle = nextTier.title;
          ev.newPowerLevel = nextTier.level;
          ev.newFrameId = nextTier.frameId;

          if (updatedProfile) {
            roomPlayer.highScore = updatedProfile.highScore;
            roomPlayer.totalScore = updatedProfile.totalScore;
            roomPlayer.matchesPlayed = updatedProfile.matchesPlayed;
            roomPlayer.winsCount = updatedProfile.winsCount;
          }
        } else if (roomPlayer) {
          const botTier = getPlayerPowerTier({
            highScore: roomPlayer.highScore,
            winsCount: roomPlayer.winsCount,
            matchesPlayed: roomPlayer.matchesPlayed,
          });
          ev.roundAchievements = evaluateRoundAchievements({
            subjectScore: ev.subjectScore,
            styleScore: ev.styleScore,
            detailsScore: ev.detailsScore,
            speedBonus: ev.speedBonus,
            totalScore: ev.totalScore,
            lockedAtRemainingSeconds: ev.lockedAtRemainingSeconds,
            isWinner: ev.isWinner,
            isNewHighScore: false,
            matchesPlayedAfter: roomPlayer.matchesPlayed + 1,
            winsCountAfter: roomPlayer.winsCount + (ev.isWinner ? 1 : 0),
          });
          ev.leveledUpTitle = false;
          ev.previousTitle = botTier.title;
          ev.newTitle = botTier.title;
          ev.newPowerLevel = botTier.level;
          ev.newFrameId = botTier.frameId;
        }
      }

      const winnerEval = evaluations.find((e) => e.isWinner);
      await database.recordMatch({
        roomCode: this.roomCode,
        challengeId: challenge.id,
        winnerPlayerId: winnerEval && !winnerEval.isBot ? winnerEval.playerId : null,
        results: evaluations,
      });

      this.evaluations = evaluations;
      this.leaderboards = await database.getLeaderboards();

      // Entra na fase REVEALING (1 por 1, ritmo ágil: 4s por participante para manter dinamismo na TV)
      this.phase = 'REVEALING';
      this.currentRevealIndex = 0;
      this.revealStepTimer = 4;
      this.broadcastState();
    } catch (err) {
      console.error('❌ [GameEngine] Falha durante avaliação da rodada:', err);
      this.resetToIdle();
    } finally {
      this.isEvaluating = false;
    }
  }

  public resetToIdle(): void {
    this.archiveCurrentRound();
    this.generateNewRoundToken();
    this.phase = 'IDLE';
    this.lobbyTimeLeft = 90;
    this.roundTimeLeft = 90;
    this.countdownLeft = 3;
    this.blurPx = 16;
    this.players = [];
    this.evaluations = [];
    this.currentRevealIndex = 0;
    this.revealStepTimer = 4;
    this.podiumTimeLeft = 10;
    this.botSchedules = [];
    this.isEvaluating = false;
    this.pickNextChallenge();
    this.broadcastState();
  }

  private async tick(): Promise<void> {
    switch (this.phase) {
      case 'IDLE': {
        break;
      }

      case 'LOBBY': {
        if (this.players.length === 0) {
          this.resetToIdle();
          return;
        }

        if (this.players.length >= MAX_ROOM_PLAYERS) {
          this.startCountdown();
          return;
        }

        this.lobbyTimeLeft = Math.max(0, this.lobbyTimeLeft - 1);
        if (this.lobbyTimeLeft <= 0) {
          // Preenche os slots vazios restantes com Bot(s) Mermã e inicia!
          this.fillEmptySlotsWithBots();
          this.startCountdown();
          return;
        }

        this.broadcastState();
        break;
      }

      case 'COUNTDOWN': {
        this.countdownLeft = Math.max(0, this.countdownLeft - 1);
        if (this.countdownLeft <= 0) {
          this.startPlaying();
          return;
        }
        this.broadcastState();
        break;
      }

      case 'PLAYING': {
        this.roundTimeLeft = Math.max(0, this.roundTimeLeft - 1);

        // Blur diminui progressivamente de 16px (aos 90s) até 3px (aos 0s)
        const progress = (90 - this.roundTimeLeft) / 90;
        this.blurPx = Number((16 - progress * 13).toFixed(1));

        // Atualiza comportamento dos Bots Mermã (digitação progressiva realista)
        for (const schedule of this.botSchedules) {
          const bot = this.players.find((p) => p.slot === schedule.slot && p.isBot);
          if (!bot || bot.hasLockedPrompt) continue;

          if (
            this.roundTimeLeft <= schedule.startTypingAt &&
            this.roundTimeLeft > schedule.lockPromptAt
          ) {
            bot.isTyping = true;
            const totalWindow = Math.max(1, schedule.startTypingAt - schedule.lockPromptAt);
            const elapsed = schedule.startTypingAt - this.roundTimeLeft;
            const ratio = Math.min(1, Math.max(0.1, elapsed / totalWindow));
            const words = schedule.chosenPrompt.split(' ');
            const wordsToTake = Math.max(1, Math.ceil(words.length * ratio));
            bot.submittedPrompt = words.slice(0, wordsToTake).join(' ');
          } else if (this.roundTimeLeft <= schedule.lockPromptAt) {
            bot.isTyping = false;
            bot.hasLockedPrompt = true;
            bot.submittedPrompt = schedule.chosenPrompt;
            bot.lockedAtRemainingSeconds = this.roundTimeLeft;
          }
        }

        const allLocked =
          this.players.length > 0 && this.players.every((p) => p.hasLockedPrompt);

        if (allLocked || this.roundTimeLeft <= 0) {
          // Para humanos que estavam digitando mas não clicaram em travar a tempo, aproveita o rascunho
          for (const p of this.players) {
            if (!p.hasLockedPrompt && p.submittedPrompt.trim().length > 0) {
              p.hasLockedPrompt = true;
              p.isTyping = false;
              p.lockedAtRemainingSeconds = 0;
            }
          }
          await this.transitionToEvaluating();
          return;
        }

        this.broadcastState();
        break;
      }

      case 'EVALUATING': {
        break;
      }

      case 'REVEALING': {
        this.revealStepTimer = Math.max(0, this.revealStepTimer - 1);
        if (this.revealStepTimer <= 0) {
          const maxIndex = Math.max(0, this.evaluations.length - 1);
          if (this.currentRevealIndex < maxIndex) {
            this.currentRevealIndex += 1;
            this.revealStepTimer = 4;
          } else {
            this.phase = 'PODIUM';
            this.podiumTimeLeft = 10;
          }
        }
        this.broadcastState();
        break;
      }

      case 'PODIUM': {
        this.podiumTimeLeft = Math.max(0, this.podiumTimeLeft - 1);
        this.revealStepTimer = this.podiumTimeLeft;
        if (this.podiumTimeLeft <= 0) {
          this.resetToIdle();
          return;
        }
        this.broadcastState();
        break;
      }
    }
  }
}
