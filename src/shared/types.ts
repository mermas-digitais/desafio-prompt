export type PlayerSlot = 1 | 2 | 3 | 4 | 5;
export const MAX_ROOM_PLAYERS = 5;
export const ALL_PLAYER_SLOTS: readonly PlayerSlot[] = [1, 2, 3, 4, 5] as const;

export type GamePhase =
  | 'IDLE'          // TV exibe Ranking Geral (Geral / Pontos / Vitórias) + QR Code de entrada
  | 'LOBBY'         // 1 a 5 jogadores na sala + contador de 1m30s para Bot Mermã preencher vagas restantes
  | 'COUNTDOWN'     // Contagem regressiva 3, 2, 1 antes da imagem aparecer
  | 'PLAYING'       // 1m30s de jogo com imagem IA + prompt borrado interativo + dicas por tempo
  | 'EVALUATING'    // Calculando proximidade de intenção via GPT -> Groq -> Local
  | 'REVEALING'     // Revelação dramática 1 por 1 dos prompts dos jogadores e pontuação detalhada
  | 'PODIUM';       // Celebração do vencedor da partida antes de voltar para IDLE

export type RankingTab = 'general' | 'points' | 'wins';

export type PresetAvatarId =
  | 'menina-mdx'
  | 'ia'
  | 'robo'
  | 'game'
  | 'codigo'
  | 'lampada'
  | 'ciencia'
  | 'selo';

// Suporta tanto os ícones oficiais quanto uma foto enviada pela usuária (data:image/...)
export type AvatarId = PresetAvatarId | (string & {});

export interface PlayerProfile {
  id: string;              // UUID no banco PostgreSQL
  deviceId: string;        // UUID persistido no dispositivo do usuário
  nickname: string;        // Apelido validado pelo filtro de nomes impróprios
  avatar: AvatarId;
  highScore: number;       // Maior pontuação única alcançada
  totalScore: number;      // Soma histórica de pontos
  matchesPlayed: number;   // Total de partidas jogadas
  winsCount: number;       // Total de vitórias (1º lugar)
  isBot?: boolean;
}

export interface RoomPlayer {
  id: string;
  deviceId: string;
  socketId: string;
  slot: PlayerSlot;
  nickname: string;
  avatar: AvatarId;
  highScore: number;
  matchesPlayed: number;
  winsCount: number;
  isBot: boolean;
  isConnected: boolean;
  isTyping: boolean;
  hasLockedPrompt: boolean;
  submittedPrompt: string;
  lockedAtRemainingSeconds: number | null;
}

export interface ChallengePromptLayers {
  subject: string;       // Quem/O que e qual a ação principal
  style: string;         // Estilo artístico, técnica, estética
  environment: string;   // Cenário, iluminação, atmosfera, câmera
}

export interface ChallengePublicView {
  id: string;
  title: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  imageUrl: string;
  wordCount: number;
  // Palavras mascaradas ou parcialmente reveladas conforme o tempo corre
  maskedPromptTokens: Array<{
    text: string;
    isRevealed: boolean;
    layer: 'subject' | 'style' | 'environment';
  }>;
  unlockedHints: string[];
  // Preenchido apenas nas fases REVEALING e PODIUM
  fullPrompt?: string;
  layers?: ChallengePromptLayers;
}

export interface PlayerRoundEvaluation {
  playerId: string;
  nickname: string;
  avatar: AvatarId;
  slot: PlayerSlot;
  isBot: boolean;
  submittedPrompt: string;
  lockedAtRemainingSeconds: number;
  subjectScore: number;     // 0 a 400 (Intenção do Sujeito / Ação)
  styleScore: number;       // 0 a 300 (Estilo Visual / Estética)
  detailsScore: number;     // 0 a 300 (Cenário / Luz / Detalhes)
  speedBonus: number;       // 0 a 150 (Bônus de Velocidade se base >= 300)
  totalScore: number;       // Soma total da rodada (0 a 1150)
  similarityPercent: number;// 0 a 100% para barra visual
  intentMatched: string[];  // Conceitos que acertou
  intentMissed: string[];   // Conceitos que faltaram
  aiFeedback: string;       // Comentário divertido e educativo da Mermã IA
  evaluatorUsed: 'openai' | 'groq' | 'local';
  isWinner: boolean;
  isNewHighScore: boolean;
  // Conquistas da rodada e progressão de título/poder
  roundAchievements?: string[];
  leveledUpTitle?: boolean;
  previousTitle?: string;
  newTitle?: string;
  newPowerLevel?: number;
  newFrameId?: string;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  nickname: string;
  avatar: AvatarId;
  highScore: number;
  winsCount: number;
  matchesPlayed: number;
  totalScore: number;
  updatedAt: string;
}

export interface LeaderboardsPayload {
  general: LeaderboardEntry[]; // Ordenado por índice combinado (HighScore + Vitórias * 250)
  points: LeaderboardEntry[];  // Ordenado por HighScore puro
  wins: LeaderboardEntry[];    // Ordenado por Vitórias (winsCount) e desempate por HighScore
  stats: {
    totalPlayers: number;
    totalMatches: number;
    highestScoreEver: number;
  };
}

export interface GameRoomState {
  roomCode: string;
  phase: GamePhase;
  lobbyTimeLeft: number;        // 90s (1m30s) até Bot Mermã completar a sala
  roundTimeLeft: number;        // 90s (1m30s) de partida
  countdownLeft: number;        // 3..2..1
  blurPx: number;               // Nível de blur atual do prompt original na TV
  players: RoomPlayer[];        // Até 5 jogadores nos slots 1..5
  challenge: ChallengePublicView | null;
  evaluations: PlayerRoundEvaluation[];
  currentRevealIndex: number;   // 0..4 durante a fase REVEALING (1 por 1)
  revealStepTimer: number;      // Segundos restantes para o próximo card no reveal
  leaderboards: LeaderboardsPayload;
}
