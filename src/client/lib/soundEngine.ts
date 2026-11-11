import confetti from 'canvas-confetti';

const PENTATONIC_SCALE = [
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
  880.0,  // A5
  1046.5, // C6
  1174.66,// D6
  1318.51,// E6
];

interface MusicalNoteOptions {
  delay?: number;
  volume?: number;
  filterFreq?: number;
  harmonicRatio?: number;
  harmonicGain?: number;
  slideToFreq?: number;
  attackMs?: number;
}

class StudioMusicalSoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private lastTypingSoundAt: number = 0;
  private lastTypingNoteIdx: number = -1;
  private lastScoreTickAt: number = 0;
  private scoreArpeggioStep: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('mdx26_sound_muted');
      this.muted = saved === 'true';
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(val: boolean): boolean {
    this.muted = val;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mdx26_sound_muted', String(this.muted));
    }
    return this.muted;
  }

  public toggleMute(): boolean {
    const next = this.setMuted(!this.muted);
    if (!next) {
      this.playJoinSound();
    }
    return next;
  }

  /**
   * Síntese musical quente estilo Nintendo Switch / Duolingo:
   * Fundamental em Sine + Harmônico suave em Triangle filtrados por BiquadFilterNode Low-Pass.
   */
  private playMusicalNote(
    freq: number,
    duration: number,
    options: MusicalNoteOptions = {}
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const {
      delay = 0,
      volume = 0.12,
      filterFreq = 2400,
      harmonicRatio = 2,
      harmonicGain = 0.18,
      slideToFreq,
      attackMs = 0.012,
    } = options;

    try {
      const now = ctx.currentTime + delay;

      // Filtro passa-baixa para remover qualquer aspereza digital
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, now);
      filter.Q.setValueAtTime(1.15, now);

      // Envelope de ganho principal (ataque macio + decaimento tipo marimba/celesta)
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(volume, now + attackMs);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      // Oscilador fundamental (Sine)
      const oscMain = ctx.createOscillator();
      oscMain.type = 'sine';
      oscMain.frequency.setValueAtTime(freq, now);
      if (slideToFreq) {
        oscMain.frequency.exponentialRampToValueAtTime(slideToFreq, now + duration);
      }

      // Oscilador harmônico suave (Triangle uma oitava acima com volume reduzido)
      const oscHarmonic = ctx.createOscillator();
      const harmGainNode = ctx.createGain();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * harmonicRatio, now);
      if (slideToFreq) {
        oscHarmonic.frequency.exponentialRampToValueAtTime(
          slideToFreq * harmonicRatio,
          now + duration
        );
      }
      harmGainNode.gain.setValueAtTime(harmonicGain, now);

      oscMain.connect(filter);
      oscHarmonic.connect(harmGainNode);
      harmGainNode.connect(filter);

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      oscMain.start(now);
      oscHarmonic.start(now);
      oscMain.stop(now + duration + 0.03);
      oscHarmonic.stop(now + duration + 0.03);
    } catch {
      // Ignore Web Audio autoplay restriction errors before user gesture
    }
  }

  /** Acorde Cmaj9 arpejado suave de boas-vindas (timbre de celesta quente) */
  public playJoinSound() {
    const notes = [523.25, 659.25, 783.99, 987.77, 1174.66]; // C5, E5, G5, B5, D6
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.24 + idx * 0.04, {
        delay: idx * 0.055,
        volume: 0.11,
        filterFreq: 2800,
      });
    });
  }

  /** Arpejo curioso e simpático em kalimba quando a Bot Mermã entra */
  public playBotSpawnSound() {
    const notes = [440.0, 523.25, 659.25, 880.0]; // A4, C5, E5, A5
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.16, {
        delay: idx * 0.06,
        volume: 0.1,
        filterFreq: 2100,
        harmonicRatio: 1.5,
      });
    });
  }

  /**
   * Gota d'água / kalimba orgânica com cooldown de 2200ms e variação pentatônica
   * para NUNCA soar repetitivo enquanto o participante digita!
   */
  public playTypingPulseSound() {
    const nowMs = Date.now();
    if (nowMs - this.lastTypingSoundAt < 2200) return;
    this.lastTypingSoundAt = nowMs;

    let nextIdx = Math.floor(Math.random() * PENTATONIC_SCALE.length);
    if (nextIdx === this.lastTypingNoteIdx) {
      nextIdx = (nextIdx + 1) % PENTATONIC_SCALE.length;
    }
    this.lastTypingNoteIdx = nextIdx;

    const freq = PENTATONIC_SCALE[nextIdx];
    this.playMusicalNote(freq, 0.085, {
      volume: 0.038,
      filterFreq: 1800,
      harmonicGain: 0.1,
    });
  }

  /** Toque suave de marimba para contagem 3, 2, 1 e acorde brilhante no "Valendo!" */
  public playCountdownBeep(final: boolean = false) {
    if (final) {
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C Major
      chord.forEach((f, idx) => {
        this.playMusicalNote(f, 0.42, {
          delay: idx * 0.03,
          volume: 0.12,
          filterFreq: 3000,
        });
      });
    } else {
      this.playMusicalNote(587.33, 0.16, {
        volume: 0.1,
        filterFreq: 2000,
      });
    }
  }

  /**
   * Toca APENAS nos últimos 5 segundos (5, 4, 3, 2, 1) com timbre de marimba quente
   * subindo suavemente pela escala pentatônica (sem alarme estridente!).
   */
  public playUrgentTickSound(secondsLeft: number) {
    if (secondsLeft <= 0 || secondsLeft > 5) return;
    const stepIndex = Math.max(0, Math.min(4, 5 - secondsLeft));
    const freq = PENTATONIC_SCALE[stepIndex]; // C5, D5, E5, G5, A5
    this.playMusicalNote(freq, 0.14, {
      volume: 0.095,
      filterFreq: 2100,
      harmonicGain: 0.14,
    });
  }

  /** Acorde grave e aveludado de encerramento de rodada (sem buzina áspera) */
  public playTimeUpBuzzer() {
    const notes = [523.25, 392.0, 329.63, 261.63]; // C5 -> G4 -> E4 -> C4
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.38, {
        delay: idx * 0.07,
        volume: 0.11,
        filterFreq: 1600,
      });
    });
  }

  /** Duplo toque satisfatório de confirmação (estilo Apple Pay / Duolingo: G5 -> D6) */
  public playLockInSound() {
    this.playMusicalNote(783.99, 0.14, {
      delay: 0,
      volume: 0.12,
      filterFreq: 2600,
    });
    this.playMusicalNote(1174.66, 0.32, {
      delay: 0.085,
      volume: 0.14,
      filterFreq: 3100,
    });
  }

  /** Harpa cristalina suave quando uma dica é desbloqueada */
  public playHintUnlockSound() {
    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.25, {
        delay: idx * 0.06,
        volume: 0.1,
        filterFreq: 2700,
      });
    });
  }

  /** 3 acordes distintos e encorpados (Fmaj7 -> G6 -> Cmaj9) para as 3 barras de avaliação */
  public playCategoryHitSound(categoryIndex: number = 0) {
    const chords = [
      [349.23, 440.0, 523.25, 659.25],  // 0: Fmaj7 (Sujeito)
      [392.0, 493.88, 587.33, 659.25],  // 1: G6 (Estilo)
      [523.25, 659.25, 783.99, 987.77], // 2: Cmaj7 (Cenário)
    ];
    const selected = chords[Math.max(0, Math.min(2, categoryIndex))] || chords[0];
    selected.forEach((f, idx) => {
      this.playMusicalNote(f, 0.26, {
        delay: idx * 0.03,
        volume: 0.095,
        filterFreq: 2600,
      });
    });
  }

  /** Chime rico de conquista (estilo troféu PS5/Xbox) que varia conforme a raridade */
  public playAchievementUnlockSound(
    rarity: 'comum' | 'raro' | 'epico' | 'lendario' = 'raro'
  ) {
    if (rarity === 'epico' || rarity === 'lendario') {
      const notes = [587.33, 880.0, 1108.73, 1318.51, 1760.0]; // Dmaj9 shimmer
      notes.forEach((f, idx) => {
        this.playMusicalNote(f, 0.35 + idx * 0.05, {
          delay: idx * 0.065,
          volume: 0.11,
          filterFreq: 3200,
        });
      });
    } else {
      const notes = [523.25, 783.99, 1046.5, 1318.51];
      notes.forEach((f, idx) => {
        this.playMusicalNote(f, 0.28, {
          delay: idx * 0.06,
          volume: 0.1,
          filterFreq: 2800,
        });
      });
    }
  }

  /** Fanfarra calorosa de subida de nível / moldura */
  public playLevelUpPowerSound() {
    const arpeggio = [440.0, 554.37, 659.25, 880.0, 1108.73, 1318.51]; // A Major
    arpeggio.forEach((f, idx) => {
      this.playMusicalNote(f, 0.32, {
        delay: idx * 0.065,
        volume: 0.12,
        filterFreq: 2900,
      });
    });
    this.fireCelebrationConfetti('high');
  }

  /** Suspense suave em marimba ascendente na revelação */
  public playRevealDrumroll() {
    this.scoreArpeggioStep = 0;
    const notes = [392.0, 440.0, 493.88, 523.25, 587.33, 659.25];
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.14, {
        delay: idx * 0.065,
        volume: 0.085,
        filterFreq: 2200,
      });
    });
  }

  /**
   * Cooldown de 260ms para que durante a contagem do placar toquem apenas 4-5 notas
   * cristalinas de celesta em arpejo pentatônico (zero bipes repetitivos!).
   */
  public playScoreTick(pitchBoost: number = 0) {
    const nowMs = Date.now();
    if (nowMs - this.lastScoreTickAt < 260) return;
    this.lastScoreTickAt = nowMs;

    const idx =
      (this.scoreArpeggioStep + Math.round(pitchBoost / 4)) % PENTATONIC_SCALE.length;
    this.scoreArpeggioStep += 1;
    const freq = PENTATONIC_SCALE[idx];

    this.playMusicalNote(freq, 0.16, {
      volume: 0.08,
      filterFreq: 2600,
    });
  }

  /** Disparo de canvas-confetti nas cores oficiais Mermãs Digitais */
  public fireCelebrationConfetti(intensity: 'normal' | 'high' = 'normal') {
    if (typeof window === 'undefined') return;
    const colors = ['#9747FF', '#FF4A97', '#FFD500', '#330043'];
    try {
      if (intensity === 'normal') {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { x: 0.5, y: 0.65 },
          colors,
        });
      } else {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { x: 0.2, y: 0.6 },
          colors,
        });
        setTimeout(() => {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { x: 0.8, y: 0.6 },
            colors,
          });
        }, 220);
        setTimeout(() => {
          confetti({
            particleCount: 120,
            spread: 110,
            origin: { x: 0.5, y: 0.45 },
            colors,
          });
        }, 480);
      }
    } catch {
      // Ignore confetti errors in headless environments
    }
  }

  /** Fanfarra brilhante quando o jogador bate seu recorde pessoal */
  public playRecordBreakerSound() {
    const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98]; // D Major 9
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.36, {
        delay: idx * 0.07,
        volume: 0.12,
        filterFreq: 3000,
      });
    });
    this.fireCelebrationConfetti('high');
  }

  /** Progressão triunfal IV - V - I completa em acordes quentes no pódio */
  public playVictoryFanfare() {
    // Acorde Fmaj7 -> G6 -> Cmaj9
    const progression = [
      { freqs: [349.23, 440.0, 523.25, 659.25], delay: 0, dur: 0.24 },
      { freqs: [392.0, 493.88, 587.33, 783.99], delay: 0.22, dur: 0.24 },
      { freqs: [523.25, 659.25, 783.99, 987.77, 1174.66], delay: 0.46, dur: 0.65 },
    ];

    progression.forEach((chord) => {
      chord.freqs.forEach((f, i) => {
        this.playMusicalNote(f, chord.dur, {
          delay: chord.delay + i * 0.025,
          volume: 0.11,
          filterFreq: 3000,
        });
      });
    });

    this.fireCelebrationConfetti('high');
  }

  /** Brilho cristalino suave quando palavras do prompt original desembaçam ao vivo na TV */
  public playWordRevealSparkleSound() {
    const notes = [659.25, 987.77, 1318.51]; // E5, B5, E6
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.16, {
        delay: idx * 0.045,
        volume: 0.055,
        filterFreq: 2500,
        harmonicGain: 0.12,
      });
    });
  }

  /** Toque musical discreto nos marcos de tempo da rodada (60s, 30s e 15s restantes) */
  public playTimeMilestoneSound(secondsLeft: 60 | 30 | 15) {
    const map: Record<number, number[]> = {
      60: [523.25, 659.25], // C5 -> E5
      30: [587.33, 783.99], // D5 -> G5
      15: [659.25, 880.0, 1046.5], // E5 -> A5 -> C6
    };
    const notes = map[secondsLeft] || [523.25, 659.25];
    notes.forEach((f, idx) => {
      this.playMusicalNote(f, 0.2, {
        delay: idx * 0.055,
        volume: 0.085,
        filterFreq: 2400,
      });
    });
  }

  /** Chime ascendente quando o jogador atinge uma nova camada do Termômetro de Prompt (Sujeito, Estilo, Cenário) */
  public playLayerCompleteSound(layerIndex: 1 | 2 | 3) {
    const pairs: Record<number, [number, number]> = {
      1: [523.25, 659.25], // C5 -> E5 (Sujeito estruturado)
      2: [659.25, 783.99], // E5 -> G5 (Estilo detalhado)
      3: [783.99, 1046.5], // G5 -> C6 (Cenário completo!)
    };
    const [n1, n2] = pairs[layerIndex] || pairs[1];
    this.playMusicalNote(n1, 0.14, { delay: 0, volume: 0.075, filterFreq: 2400 });
    this.playMusicalNote(n2, 0.22, { delay: 0.06, volume: 0.09, filterFreq: 2700 });
  }

  /** Acorde sincronizado quando todos os 3 participantes da arena travam seus prompts! */
  public playAllLockedSound() {
    const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C6 major chord
    chord.forEach((f, idx) => {
      this.playMusicalNote(f, 0.34, {
        delay: idx * 0.04,
        volume: 0.11,
        filterFreq: 3000,
      });
    });
  }

  /** Arpejo ambiente futurista quando a IA inicia a avaliação semântica (fase EVALUATING) */
  public playAiThinkingSound() {
    const shimmer = [440.0, 523.25, 659.25, 783.99, 987.77]; // Am9
    shimmer.forEach((f, idx) => {
      this.playMusicalNote(f, 0.28, {
        delay: idx * 0.07,
        volume: 0.08,
        filterFreq: 2300,
      });
    });
  }
}

export const soundEngine = new StudioMusicalSoundEngine();

export const playJoinSound = () => soundEngine.playJoinSound();
export const playBotSpawnSound = () => soundEngine.playBotSpawnSound();
export const playTypingPulseSound = () => soundEngine.playTypingPulseSound();
export const playCountdownBeep = (final?: boolean) => soundEngine.playCountdownBeep(final);
export const playUrgentTickSound = (secondsLeft: number) =>
  soundEngine.playUrgentTickSound(secondsLeft);
export const playTimeUpBuzzer = () => soundEngine.playTimeUpBuzzer();
export const playLockInSound = () => soundEngine.playLockInSound();
export const playHintUnlockSound = () => soundEngine.playHintUnlockSound();
export const playCategoryHitSound = (categoryIndex?: number) =>
  soundEngine.playCategoryHitSound(categoryIndex);
export const playAchievementUnlockSound = (
  rarity?: 'comum' | 'raro' | 'epico' | 'lendario'
) => soundEngine.playAchievementUnlockSound(rarity);
export const playLevelUpPowerSound = () => soundEngine.playLevelUpPowerSound();
export const playRevealDrumroll = () => soundEngine.playRevealDrumroll();
export const playScoreTick = (pitchBoost?: number) => soundEngine.playScoreTick(pitchBoost);
export const playRecordBreakerSound = () => soundEngine.playRecordBreakerSound();
export const playVictoryFanfare = () => soundEngine.playVictoryFanfare();
export const playWordRevealSparkleSound = () => soundEngine.playWordRevealSparkleSound();
export const playTimeMilestoneSound = (secondsLeft: 60 | 30 | 15) =>
  soundEngine.playTimeMilestoneSound(secondsLeft);
export const playLayerCompleteSound = (layerIndex: 1 | 2 | 3) =>
  soundEngine.playLayerCompleteSound(layerIndex);
export const playAllLockedSound = () => soundEngine.playAllLockedSound();
export const playAiThinkingSound = () => soundEngine.playAiThinkingSound();
export const fireCelebrationConfetti = (intensity?: 'normal' | 'high') =>
  soundEngine.fireCelebrationConfetti(intensity);
