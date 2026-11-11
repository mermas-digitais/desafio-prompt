/**
 * Renderizador de Cards Compartilháveis para Redes Sociais (Canvas 2D nativo de alta definição).
 *
 * Diretrizes aplicadas (padrões Spotify Wrapped / Duolingo / Strava):
 * - Story 9:16 (1080x1920) com zonas seguras: nada crítico nos ~220px do topo e ~300px da base.
 * - Feed 4:5 (1080x1350) compacto e focado em engajamento.
 * - Número herói de pontuação, colocação em destaque, avatar com nível/título,
 *   barra de 3 camadas semânticas, conquistas com PWR desbloqueado e branding oficial MDX26.
 */

export type ShareCardFormat = 'story' | 'feed';

export type ShareCardThemeId = 'pastel' | 'sunset' | 'arcade' | 'terminal' | 'neon';

export interface ShareCardAchievement {
  id: string;
  title: string;
  rarity: string;
  powerBonus: number;
}

export interface ShareCardData {
  nickname: string;
  avatarSrc: string;
  tierTitle: string;
  powerLevel: number;
  totalPwr: number;
  rank: number;
  totalPlayers: number;
  totalScore: number;
  subjectScore: number;
  styleScore: number;
  detailsScore: number;
  speedBonus: number;
  isNewHighScore: boolean;
  challengeTitle: string;
  challengeImageUrl: string;
  achievements: ShareCardAchievement[];
}

export interface ShareCardTheme {
  id: ShareCardThemeId;
  name: string;
  tagline: string;
  swatch: [string, string, string];
  text: string;
  subtext: string;
  accent: string;
  accent2: string;
  panelBg: string;
  panelBorder: string;
  pillBg: string;
  pillText: string;
  scoreGradient: [string, string];
  numeralColor: string;
  ring: [string, string];
  displayFont: string;
  scoreFont: string;
  bodyFont: string;
  logoSrc: string;
  hardShadow?: string;
  paintBackground: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

export const SHARE_PUBLIC_URL = 'dprompt.mermasdigitais.com.br';

// ----------------------------------------------------------------------------
// Utilitários Gráficos de Fundo
// ----------------------------------------------------------------------------

function radialBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function dotGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  gap: number,
  radius: number,
  color: string
) {
  ctx.fillStyle = color;
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ----------------------------------------------------------------------------
// Temas Visuais (Pastel em primeiro, Neon em último)
// ----------------------------------------------------------------------------

export const SHARE_CARD_THEMES: ShareCardTheme[] = [
  {
    id: 'pastel',
    name: 'Pastel Mermã',
    tagline: 'A identidade oficial do evento',
    swatch: ['#FAF7FF', '#DDC7F8', '#FF4A97'],
    text: '#330043',
    subtext: '#6E4F7D',
    accent: '#FF4A97',
    accent2: '#9747FF',
    panelBg: 'rgba(255,255,255,0.85)',
    panelBorder: '#DDC7F8',
    pillBg: '#F5F0FF',
    pillText: '#4C1D95',
    scoreGradient: ['#9747FF', '#FF4A97'],
    numeralColor: 'rgba(151,71,255,0.11)',
    ring: ['#9747FF', '#FF4A97'],
    displayFont: '"Paytone One", sans-serif',
    scoreFont: '"Paytone One", sans-serif',
    bodyFont: '"Poppins", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    paintBackground: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#FAF7FF');
      g.addColorStop(0.5, '#FFFFFF');
      g.addColorStop(1, '#F3EAFF');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      radialBlob(ctx, w * 0.95, h * 0.08, w * 0.65, 'rgba(255,74,151,0.22)');
      radialBlob(ctx, w * 0.02, h * 0.45, w * 0.6, 'rgba(151,71,255,0.18)');
      radialBlob(ctx, w * 0.8, h * 0.95, w * 0.65, 'rgba(255,205,52,0.24)');
      dotGrid(ctx, w, h, 54, 2.4, 'rgba(151,71,255,0.10)');
    },
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol MA',
    tagline: 'Lençóis Maranhenses ao entardecer',
    swatch: ['#FF8A3D', '#FF4A97', '#6B21A8'],
    text: '#FFFFFF',
    subtext: 'rgba(255,255,255,0.85)',
    accent: '#FFE27A',
    accent2: '#FFFFFF',
    panelBg: 'rgba(255,255,255,0.18)',
    panelBorder: 'rgba(255,255,255,0.38)',
    pillBg: 'rgba(255,255,255,0.24)',
    pillText: '#FFFFFF',
    scoreGradient: ['#FFFFFF', '#FFE27A'],
    numeralColor: 'rgba(255,255,255,0.15)',
    ring: ['#FFE27A', '#FFFFFF'],
    displayFont: '"Paytone One", sans-serif',
    scoreFont: '"Paytone One", sans-serif',
    bodyFont: '"Poppins", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    paintBackground: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#4C1077');
      g.addColorStop(0.42, '#D93275');
      g.addColorStop(0.78, '#FF7A2F');
      g.addColorStop(1, '#FFBF53');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      radialBlob(ctx, w * 0.5, h * 0.75, w * 0.6, 'rgba(255,226,122,0.55)');

      // Silhuetas onduladas de dunas dos Lençóis Maranhenses
      const dune = (baseY: number, amp: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, baseY);
        ctx.bezierCurveTo(w * 0.3, baseY - amp, w * 0.65, baseY + amp * 0.8, w, baseY - amp * 0.3);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      };
      dune(h * 0.84, 55, 'rgba(255,245,230,0.25)');
      dune(h * 0.91, 40, 'rgba(255,250,240,0.40)');
    },
  },
  {
    id: 'arcade',
    name: 'Pop Arcade',
    tagline: 'Cartaz pop, vibrante e marcante',
    swatch: ['#FFCD34', '#330043', '#FF4A97'],
    text: '#330043',
    subtext: '#5B2A66',
    accent: '#FF4A97',
    accent2: '#9747FF',
    panelBg: '#FFFFFF',
    panelBorder: '#330043',
    pillBg: '#330043',
    pillText: '#FFCD34',
    scoreGradient: ['#330043', '#9747FF'],
    numeralColor: 'rgba(51,0,67,0.11)',
    ring: ['#330043', '#FF4A97'],
    displayFont: '"Paytone One", sans-serif',
    scoreFont: '"Paytone One", sans-serif',
    bodyFont: '"Poppins", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    hardShadow: '#330043',
    paintBackground: (ctx, w, h) => {
      ctx.fillStyle = '#FFCD34';
      ctx.fillRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h * 0.34);
      ctx.fillStyle = 'rgba(255,255,255,0.30)';
      const rays = 18;
      for (let i = 0; i < rays; i += 1) {
        ctx.rotate((Math.PI * 2) / rays);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-70, -h);
        ctx.lineTo(70, -h);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      dotGrid(ctx, w, h, 36, 3, 'rgba(51,0,67,0.08)');
    },
  },
  {
    id: 'terminal',
    name: 'Terminal IA',
    tagline: 'Hacker de prompt, estética ciber',
    swatch: ['#07070D', '#22F5A8', '#9747FF'],
    text: '#EFFFF8',
    subtext: 'rgba(200,255,232,0.72)',
    accent: '#22F5A8',
    accent2: '#B98CFF',
    panelBg: 'rgba(34,245,168,0.07)',
    panelBorder: 'rgba(34,245,168,0.38)',
    pillBg: 'rgba(34,245,168,0.15)',
    pillText: '#22F5A8',
    scoreGradient: ['#22F5A8', '#B98CFF'],
    numeralColor: 'rgba(34,245,168,0.09)',
    ring: ['#22F5A8', '#9747FF'],
    displayFont: '"Orbitron", monospace',
    scoreFont: '"Orbitron", monospace',
    bodyFont: '"Atkinson Hyperlegible", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    paintBackground: (ctx, w, h) => {
      ctx.fillStyle = '#07070D';
      ctx.fillRect(0, 0, w, h);
      radialBlob(ctx, w * 0.85, h * 0.15, w * 0.6, 'rgba(151,71,255,0.28)');
      radialBlob(ctx, w * 0.1, h * 0.85, w * 0.6, 'rgba(34,245,168,0.18)');
      ctx.fillStyle = 'rgba(34,245,168,0.04)';
      for (let y = 0; y < h; y += 6) {
        ctx.fillRect(0, y, w, 2);
      }
      ctx.font = '600 22px "Orbitron", monospace';
      ctx.fillStyle = 'rgba(34,245,168,0.09)';
      const glyphs = '01<>{}/=+*#';
      for (let i = 0; i < 160; i += 1) {
        const x = (i * 137.5) % w;
        const y = (i * 241.3) % h;
        ctx.fillText(glyphs[i % glyphs.length], x, y);
      }
    },
  },
  {
    id: 'neon',
    name: 'Neon Arena',
    tagline: 'Noite de final no telão cyberpunk',
    swatch: ['#070014', '#00F5FF', '#FF007F'],
    text: '#FFFFFF',
    subtext: 'rgba(230, 240, 255, 0.82)',
    accent: '#00F5FF',
    accent2: '#FF007F',
    panelBg: 'rgba(18, 4, 34, 0.82)',
    panelBorder: 'rgba(0, 245, 255, 0.40)',
    pillBg: 'rgba(0, 245, 255, 0.16)',
    pillText: '#00F5FF',
    scoreGradient: ['#00F5FF', '#FF007F'],
    numeralColor: 'rgba(0, 245, 255, 0.13)',
    ring: ['#00F5FF', '#FF007F'],
    displayFont: '"Paytone One", sans-serif',
    scoreFont: '"Orbitron", monospace',
    bodyFont: '"Poppins", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    paintBackground: (ctx, w, h) => {
      // Gradiente espacial profundo
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#060010');
      g.addColorStop(0.48, '#140026');
      g.addColorStop(1, '#070014');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Nebulosas neon brilhantes
      radialBlob(ctx, w * 0.15, h * 0.12, w * 0.65, 'rgba(151,71,255,0.48)');
      radialBlob(ctx, w * 0.88, h * 0.45, w * 0.65, 'rgba(255,0,127,0.42)');
      radialBlob(ctx, w * 0.35, h * 0.92, w * 0.60, 'rgba(0,245,255,0.30)');

      // Grid em perspectiva na parte inferior estilo Arena Gamer
      const horizonY = h * 0.68;
      ctx.strokeStyle = 'rgba(0,245,255,0.18)';
      ctx.lineWidth = 1.8;

      // Linhas horizontais com espaçamento decrescente até o horizonte
      for (let y = h; y >= horizonY; y -= (y - horizonY) * 0.22 + 8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Linhas verticais convergentes para o centro
      const centerX = w / 2;
      for (let x = -w * 0.5; x <= w * 1.5; x += 110) {
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
    },
  },
];

export function getShareTheme(id: ShareCardThemeId): ShareCardTheme {
  return SHARE_CARD_THEMES.find((t) => t.id === id) || SHARE_CARD_THEMES[0];
}

// ----------------------------------------------------------------------------
// Utilitários de Desenho
// ----------------------------------------------------------------------------

const imageCache = new Map<string, Promise<HTMLImageElement | null>>();

function loadImage(src: string, size = 512): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null);
  const cached = imageCache.get(src);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image(size, size);
    img.decoding = 'async';
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

function pathRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawPanel(
  ctx: CanvasRenderingContext2D,
  theme: ShareCardTheme,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (theme.hardShadow) {
    ctx.fillStyle = theme.hardShadow;
    pathRoundRect(ctx, x + 10, y + 12, w, h, r);
    ctx.fill();
  }
  ctx.fillStyle = theme.panelBg;
  pathRoundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.lineWidth = theme.hardShadow ? 6 : 3;
  ctx.strokeStyle = theme.panelBorder;
  ctx.stroke();
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  weight: string,
  family: string,
  maxSize: number,
  maxWidth: number,
  minSize = 28
): number {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  ctx.font = `${weight} ${size}px ${family}`;
  return size;
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const iw = img.naturalWidth || img.width || w;
  const ih = img.naturalHeight || img.height || h;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const iw = img.naturalWidth || img.width || w;
  const ih = img.naturalHeight || img.height || h;
  const scale = Math.min(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function rankHeadline(rank: number): { kicker: string; headline: string } {
  if (rank === 1) return { kicker: 'CAMPEÃ DA ARENA', headline: 'Decifrei o prompt da IA!' };
  if (rank <= 3) return { kicker: 'NO PÓDIO', headline: 'Subi no pódio do prompt!' };
  return { kicker: 'MISSÃO CUMPRIDA', headline: 'Encarei a IA e mandei bem!' };
}

let fontsReady: Promise<void> | null = null;

export function ensureShareFontsLoaded(): Promise<void> {
  if (fontsReady) return fontsReady;
  if (typeof document === 'undefined' || !document.fonts) {
    fontsReady = Promise.resolve();
    return fontsReady;
  }
  fontsReady = Promise.all([
    document.fonts.load('80px "Paytone One"'),
    document.fonts.load('800 80px "Orbitron"'),
    document.fonts.load('600 40px "Poppins"'),
    document.fonts.load('700 40px "Poppins"'),
    document.fonts.load('700 40px "Atkinson Hyperlegible"'),
  ])
    .then(() => undefined)
    .catch(() => undefined);
  return fontsReady;
}

// ----------------------------------------------------------------------------
// Renderização Principal do Card
// ----------------------------------------------------------------------------

export async function renderShareCard(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
  themeId: ShareCardThemeId,
  format: ShareCardFormat
): Promise<void> {
  await ensureShareFontsLoaded();
  const theme = getShareTheme(themeId);
  const W = 1080;
  const H = format === 'story' ? 1920 : 1350;
  const isStory = format === 'story';
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const [logoImg, avatarImg, challengeImg] = await Promise.all([
    loadImage(theme.logoSrc, 600),
    loadImage(data.avatarSrc, 512),
    isStory ? loadImage(data.challengeImageUrl, 1024) : Promise.resolve(null),
  ]);

  ctx.clearRect(0, 0, W, H);
  ctx.textBaseline = 'alphabetic';
  theme.paintBackground(ctx, W, H);

  const PAD = 80;
  const { kicker, headline } = rankHeadline(data.rank);

  // --- Numeral gigante da colocação (elemento gráfico de fundo) ---
  ctx.save();
  ctx.font = `${isStory ? 760 : 620}px ${theme.displayFont}`;
  ctx.fillStyle = theme.numeralColor;
  ctx.textAlign = 'right';
  ctx.fillText(`${data.rank}º`, W + 40, isStory ? 1040 : 820);
  ctx.restore();

  // --- Cabeçalho (fora da zona de UI do Stories) ---
  let y = isStory ? 210 : 85;
  if (logoImg) {
    const lh = 64;
    const lw = Math.min(300, ((logoImg.naturalWidth || 300) / (logoImg.naturalHeight || 64)) * lh);
    ctx.save();
    if (theme.id === 'neon') {
      // No Neon, usamos um pill translúcido sofisticado com borda cyan/pink neon
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      pathRoundRect(ctx, PAD - 16, y - 10, lw + 32, lh + 20, 20);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#00F5FF';
      ctx.stroke();
    } else if (theme.text === '#FFFFFF' || theme.id === 'terminal') {
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      pathRoundRect(ctx, PAD - 16, y - 10, lw + 32, lh + 20, 20);
      ctx.fill();
    }
    drawImageContain(ctx, logoImg, PAD, y, lw, lh);
    ctx.restore();
  }

  // Selo MDX26 à direita
  ctx.font = `800 34px ${theme.scoreFont}`;
  const chipText = 'MDX26';
  const chipW = ctx.measureText(chipText).width + 56;
  const chipX = W - PAD - chipW;
  if (theme.hardShadow) {
    ctx.fillStyle = theme.hardShadow;
    pathRoundRect(ctx, chipX + 6, y + 6, chipW, 76, 38);
    ctx.fill();
  }
  const chipGrad = ctx.createLinearGradient(chipX, 0, chipX + chipW, 0);
  chipGrad.addColorStop(0, theme.ring[0]);
  chipGrad.addColorStop(1, theme.ring[1]);
  ctx.fillStyle = chipGrad;
  pathRoundRect(ctx, chipX, y, chipW, 76, 38);
  ctx.fill();
  ctx.fillStyle = theme.id === 'sunset' || theme.id === 'terminal' || theme.id === 'neon' ? '#090014' : '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(chipText, chipX + chipW / 2, y + 51);

  // --- Kicker + Headline ---
  y += isStory ? 180 : 135;
  ctx.textAlign = 'left';
  ctx.font = `700 30px ${theme.bodyFont}`;
  ctx.fillStyle = theme.accent;
  const kickerLabel = `DESAFIO DE PROMPT • ${kicker}`;
  ctx.fillText(kickerLabel.split('').join('\u200A'), PAD, y);

  y += isStory ? 90 : 76;
  ctx.fillStyle = theme.text;
  fitFont(ctx, headline, '400', theme.displayFont, isStory ? 90 : 74, W - PAD * 2);
  ctx.fillText(headline, PAD, y);

  // --- Bloco de Identidade: Avatar + Nível + Título + Nick ---
  y += isStory ? 60 : 45;
  const avatarSize = isStory ? 230 : 185;
  const ax = PAD;
  const ay = y;
  const cx = ax + avatarSize / 2;
  const cy = ay + avatarSize / 2;

  // Anel gradiente
  const ringGrad = ctx.createLinearGradient(ax, ay, ax + avatarSize, ay + avatarSize);
  ringGrad.addColorStop(0, theme.ring[0]);
  ringGrad.addColorStop(1, theme.ring[1]);
  if (theme.hardShadow) {
    ctx.fillStyle = theme.hardShadow;
    ctx.beginPath();
    ctx.arc(cx + 8, cy + 10, avatarSize / 2 + 10, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, avatarSize / 2 + 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, avatarSize / 2, 0, Math.PI * 2);
  ctx.fill();
  if (avatarImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, avatarSize / 2 - 6, 0, Math.PI * 2);
    ctx.clip();
    if (data.avatarSrc.startsWith('data:')) {
      drawImageCover(ctx, avatarImg, ax + 6, ay + 6, avatarSize - 12, avatarSize - 12);
    } else {
      ctx.fillStyle = '#F5F0FF';
      ctx.fillRect(ax, ay, avatarSize, avatarSize);
      drawImageContain(
        ctx,
        avatarImg,
        ax + avatarSize * 0.14,
        ay + avatarSize * 0.14,
        avatarSize * 0.72,
        avatarSize * 0.72
      );
    }
    ctx.restore();
  }

  // Medalha do Nível (Lv)
  const lvR = isStory ? 42 : 36;
  const lvX = ax + avatarSize - lvR * 0.55;
  const lvY = ay + avatarSize - lvR * 0.55;
  ctx.fillStyle =
    theme.id === 'arcade'
      ? '#FF4A97'
      : theme.id === 'neon'
      ? '#00F5FF'
      : theme.accent2 === '#FFFFFF'
      ? '#FF4A97'
      : theme.accent2;
  ctx.beginPath();
  ctx.arc(lvX, lvY, lvR, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = theme.id === 'neon' ? '#070014' : '#FFFFFF';
  ctx.stroke();
  ctx.fillStyle = theme.id === 'terminal' || theme.id === 'neon' ? '#070014' : '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `800 ${isStory ? 28 : 24}px ${theme.scoreFont}`;
  ctx.fillText(`Lv${data.powerLevel}`, lvX, lvY + 10);

  // Nickname e Título de Maestria
  const infoX = ax + avatarSize + 50;
  const infoW = W - PAD - infoX;
  ctx.textAlign = 'left';

  // Badge do Título de Maestria
  ctx.font = `700 ${isStory ? 28 : 24}px ${theme.bodyFont}`;
  const pillText = `★ ${data.tierTitle.toUpperCase()}`;
  const pillW = Math.min(infoW, ctx.measureText(pillText).width + 42);
  const pillY = ay + (isStory ? 32 : 22);
  ctx.fillStyle = theme.pillBg;
  pathRoundRect(ctx, infoX, pillY, pillW, isStory ? 52 : 46, 26);
  ctx.fill();
  ctx.fillStyle = theme.pillText;
  ctx.fillText(pillText, infoX + 20, pillY + (isStory ? 36 : 32), infoW - 40);

  // Nickname
  ctx.fillStyle = theme.text;
  fitFont(ctx, data.nickname, '400', theme.displayFont, isStory ? 90 : 76, infoW, 36);
  ctx.fillText(data.nickname, infoX, pillY + (isStory ? 148 : 124));

  // Posição na sala
  ctx.font = `600 ${isStory ? 28 : 24}px ${theme.bodyFont}`;
  ctx.fillStyle = theme.subtext;
  ctx.fillText(
    `${data.rank}º lugar entre ${Math.max(data.totalPlayers, data.rank)} na sala`,
    infoX,
    pillY + (isStory ? 198 : 166)
  );

  // --- Pontuação Herói ---
  y = ay + avatarSize + (isStory ? 75 : 50);
  const scorePanelH = isStory ? 300 : 250;
  drawPanel(ctx, theme, PAD, y, W - PAD * 2, scorePanelH, 44);

  ctx.font = `700 28px ${theme.bodyFont}`;
  ctx.fillStyle = theme.subtext;
  ctx.textAlign = 'left';
  ctx.fillText('PONTUAÇÃO DA RODADA', PAD + 44, y + 64);

  if (data.isNewHighScore) {
    ctx.font = `700 24px ${theme.bodyFont}`;
    const recText = '★ NOVO RECORDE';
    const recW = ctx.measureText(recText).width + 36;
    ctx.fillStyle = theme.accent;
    pathRoundRect(ctx, W - PAD - 44 - recW, y + 30, recW, 46, 23);
    ctx.fill();
    ctx.fillStyle = theme.id === 'sunset' || theme.id === 'terminal' || theme.id === 'neon' ? '#090014' : '#FFFFFF';
    ctx.fillText(recText, W - PAD - 44 - recW + 18, y + 62);
  }

  const scoreStr = String(data.totalScore);
  const scoreSize = isStory ? 195 : 160;
  ctx.font = `800 ${scoreSize}px ${theme.scoreFont}`;
  const scoreW = ctx.measureText(scoreStr).width;
  const scoreGrad = ctx.createLinearGradient(PAD + 44, 0, PAD + 44 + scoreW, 0);
  scoreGrad.addColorStop(0, theme.scoreGradient[0]);
  scoreGrad.addColorStop(1, theme.scoreGradient[1]);
  ctx.fillStyle = scoreGrad;
  const scoreBaseline = y + (isStory ? 245 : 205);
  ctx.fillText(scoreStr, PAD + 40, scoreBaseline);
  ctx.font = `700 ${isStory ? 50 : 42}px ${theme.bodyFont}`;
  ctx.fillStyle = theme.text;
  ctx.fillText('pts', PAD + 56 + scoreW, scoreBaseline);

  if (data.speedBonus > 0) {
    ctx.font = `700 ${isStory ? 26 : 22}px ${theme.bodyFont}`;
    ctx.fillStyle = theme.accent;
    ctx.textAlign = 'right';
    ctx.fillText(`⚡ +${data.speedBonus} velocidade`, W - PAD - 44, scoreBaseline);
    ctx.textAlign = 'left';
  }

  // --- 3 Camadas do Prompt ---
  y += scorePanelH + (isStory ? 36 : 26);
  const layers = [
    { label: 'Sujeito', score: data.subjectScore, max: 400, color: '#FF4A97' },
    { label: 'Estilo', score: data.styleScore, max: 300, color: '#9747FF' },
    { label: 'Cenário', score: data.detailsScore, max: 300, color: '#FFB020' },
  ];
  const gap = 24;
  const colW = (W - PAD * 2 - gap * 2) / 3;
  const colH = isStory ? 170 : 145;
  layers.forEach((layer, i) => {
    const x = PAD + i * (colW + gap);
    drawPanel(ctx, theme, x, y, colW, colH, 32);
    const pct = Math.max(0, Math.min(1, layer.score / layer.max));
    ctx.font = `700 26px ${theme.bodyFont}`;
    ctx.fillStyle = theme.subtext;
    ctx.textAlign = 'left';
    ctx.fillText(layer.label.toUpperCase(), x + 26, y + 48);
    ctx.font = `800 ${isStory ? 58 : 50}px ${theme.scoreFont}`;
    ctx.fillStyle = theme.text;
    ctx.fillText(`${Math.round(pct * 100)}%`, x + 24, y + (isStory ? 114 : 100));
    const barY = y + colH - 34;
    const barW = colW - 52;
    ctx.fillStyle = theme.id === 'arcade' ? 'rgba(51,0,67,0.12)' : 'rgba(127,127,127,0.22)';
    pathRoundRect(ctx, x + 26, barY, barW, 12, 6);
    ctx.fill();
    ctx.fillStyle = theme.id === 'terminal' || theme.id === 'neon' ? theme.accent : layer.color;
    pathRoundRect(ctx, x + 26, barY, Math.max(12, barW * pct), 12, 6);
    ctx.fill();
  });
  y += colH;

  // --- Seção de Conquistas & Poder (PWR) ---
  const activeAchievements = data.achievements && data.achievements.length > 0
    ? data.achievements.slice(0, 3)
    : [];
  const totalRoundPwr = activeAchievements.reduce((acc, a) => acc + (a.powerBonus || 0), 0);

  if (activeAchievements.length > 0) {
    y += isStory ? 32 : 22;
    const achPanelH = isStory ? 135 : 120;
    drawPanel(ctx, theme, PAD, y, W - PAD * 2, achPanelH, 32);

    // Cabeçalho da seção de Conquistas
    ctx.font = `700 24px ${theme.bodyFont}`;
    ctx.fillStyle = theme.subtext;
    ctx.textAlign = 'left';
    ctx.fillText('CONQUISTAS & PODER', PAD + 32, y + 42);

    // Badge de PWR total
    if (totalRoundPwr > 0) {
      ctx.font = `800 24px ${theme.scoreFont}`;
      const pwrText = `⚡ +${totalRoundPwr} PWR`;
      const pwrW = ctx.measureText(pwrText).width + 32;
      ctx.fillStyle = theme.accent;
      pathRoundRect(ctx, W - PAD - 32 - pwrW, y + 20, pwrW, 40, 20);
      ctx.fill();
      ctx.fillStyle = theme.id === 'sunset' || theme.id === 'terminal' || theme.id === 'neon' ? '#090014' : '#FFFFFF';
      ctx.fillText(pwrText, W - PAD - 32 - pwrW + 16, y + 48);
    }

    // Chips individuais de Conquistas
    const chipGap = 16;
    let curX = PAD + 32;
    const chipY = y + (isStory ? 64 : 56);
    const maxChipsWidth = W - PAD * 2 - 64;

    activeAchievements.forEach((ach) => {
      ctx.font = `700 22px ${theme.bodyFont}`;
      const achLabel = `🏆 ${ach.title} (+${ach.powerBonus})`;
      const wAch = ctx.measureText(achLabel).width + 30;
      if (curX + wAch - PAD <= maxChipsWidth) {
        ctx.fillStyle =
          ach.rarity === 'lendario'
            ? 'rgba(255, 205, 52, 0.28)'
            : ach.rarity === 'epico'
            ? 'rgba(151, 71, 255, 0.26)'
            : 'rgba(255, 74, 151, 0.22)';
        pathRoundRect(ctx, curX, chipY, wAch, 42, 21);
        ctx.fill();
        ctx.strokeStyle =
          ach.rarity === 'lendario'
            ? '#FFD500'
            : ach.rarity === 'epico'
            ? '#9747FF'
            : '#FF4A97';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = theme.text;
        ctx.fillText(achLabel, curX + 15, chipY + 29);
        curX += wAch + chipGap;
      }
    });

    y += achPanelH;
  }

  // --- Imagem Decifrada (apenas no Story 9:16) ---
  if (isStory && challengeImg) {
    y += 32;
    const imgH = 260;
    const imgW = W - PAD * 2;
    if (theme.hardShadow) {
      ctx.fillStyle = theme.hardShadow;
      pathRoundRect(ctx, PAD + 10, y + 12, imgW, imgH, 36);
      ctx.fill();
    }
    ctx.save();
    pathRoundRect(ctx, PAD, y, imgW, imgH, 36);
    ctx.clip();
    drawImageCover(ctx, challengeImg, PAD, y, imgW, imgH);
    const shade = ctx.createLinearGradient(0, y + imgH * 0.3, 0, y + imgH);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.78)');
    ctx.fillStyle = shade;
    ctx.fillRect(PAD, y, imgW, imgH);
    ctx.restore();
    ctx.lineWidth = theme.hardShadow ? 6 : 3;
    ctx.strokeStyle = theme.panelBorder;
    pathRoundRect(ctx, PAD, y, imgW, imgH, 36);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = `700 22px ${theme.bodyFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('ARTE GERADA POR IA DECIFRADA', PAD + 32, y + imgH - 72);
    ctx.fillStyle = '#FFFFFF';
    fitFont(ctx, data.challengeTitle, '400', '"Paytone One", sans-serif', 42, imgW - 64, 24);
    ctx.fillText(data.challengeTitle, PAD + 32, y + imgH - 28);
    y += imgH;
  }

  // --- Rodapé CTA (acima da zona de UI inferior no Story) ---
  const footerY = isStory ? H - 310 : H - 95;
  ctx.textAlign = 'center';
  ctx.font = `700 ${isStory ? 32 : 28}px ${theme.bodyFont}`;
  ctx.fillStyle = theme.text;
  ctx.fillText('Consegue me superar? Jogue em', W / 2, footerY);
  ctx.font = `800 ${isStory ? 36 : 30}px ${theme.scoreFont}`;
  ctx.fillStyle = theme.accent;
  ctx.fillText(SHARE_PUBLIC_URL, W / 2, footerY + (isStory ? 52 : 44));
  if (isStory) {
    ctx.font = `600 26px ${theme.bodyFont}`;
    ctx.fillStyle = theme.subtext;
    ctx.fillText('#MDX26  #MermasDigitais  #DesafioDePrompt', W / 2, footerY + 104);
  }
}

// ----------------------------------------------------------------------------
// Exportação e Redirecionamento para Instagram Stories
// ----------------------------------------------------------------------------

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 0.95));
}

export function buildShareText(data: ShareCardData): string {
  const place = data.rank === 1 ? 'fiquei em 1º lugar' : `fiquei em ${data.rank}º lugar`;
  return `Fiz ${data.totalScore} pts e ${place} no Desafio de Prompt do #MDX26 🎨🤖 Consegue me superar? https://${SHARE_PUBLIC_URL}`;
}

export function downloadBlob(blob: Blob, fileName: string): boolean {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fluxo de Compartilhamento Direto para o Instagram Stories:
 * 1. Tenta acionar a Web Share API nativa com o arquivo PNG (no iOS e Android, o Instagram aparece direto no menu de opções).
 * 2. Faz o download do arquivo de imagem para a galeria do celular.
 * 3. Copia a legenda oficial para a área de transferência.
 * 4. Aciona o deep link `instagram://story-camera` para abrir o Instagram direto no modo Stories!
 */
export async function shareToInstagramStories(
  canvas: HTMLCanvasElement,
  data: ShareCardData
): Promise<'shared_native' | 'opened_instagram_app' | 'downloaded_fallback'> {
  const blob = await canvasToBlob(canvas);
  if (!blob) return 'downloaded_fallback';

  const safeNick = data.nickname.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 24) || 'jogadora';
  const fileName = `mdx26-desafio-prompt-${safeNick}-story.png`;
  const file = new File([blob], fileName, { type: 'image/png' });

  // 1. Tenta compartilhamento nativo do SO primeiro (iOS Safari e Android Chrome exibem Instagram Stories)
  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };
  if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({
        files: [file],
        title: 'Desafio de Prompt • MDX26',
        text: buildShareText(data),
      });
      return 'shared_native';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'shared_native';
      }
    }
  }

  // 2. Se não abriu via Web Share: Salva na galeria e abre o app do Instagram no modo Stories
  downloadBlob(blob, fileName);

  try {
    await navigator.clipboard?.writeText(buildShareText(data));
  } catch {
    // Clipboard opcional
  }

  // Deep Link para Instagram Story Camera
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = 'instagram://story-camera';
    window.setTimeout(() => {
      // Fallback suave caso o app não esteja instalado
      window.location.href = 'https://instagram.com';
    }, 1800);
    return 'opened_instagram_app';
  }

  return 'downloaded_fallback';
}

export async function shareGeneral(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
  themeId: string,
  format: string
): Promise<'shared' | 'downloaded' | 'cancelled' | 'failed'> {
  const blob = await canvasToBlob(canvas);
  if (!blob) return 'failed';
  const safeNick = data.nickname.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 24) || 'jogadora';
  const fileName = `mdx26-desafio-prompt-${safeNick}-${themeId}-${format}.png`;
  const file = new File([blob], fileName, { type: 'image/png' });

  const nav = navigator as Navigator & {
    canShare?: (data: ShareData) => boolean;
  };
  if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({
        files: [file],
        title: 'Desafio de Prompt • MDX26',
        text: buildShareText(data),
      });
      return 'shared';
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled';
    }
  }

  return downloadBlob(blob, fileName) ? 'downloaded' : 'failed';
}
