/**
 * Renderizador de Cards Compartilháveis (Canvas 2D nativo, sem dependências).
 *
 * Diretrizes aplicadas (padrões Spotify Wrapped / Duolingo / Strava):
 * - Story 9:16 (1080x1920) com zonas seguras: nada crítico nos ~220px do topo e ~300px da base.
 * - Feed 4:5 (1080x1350) compacto.
 * - Um número herói (pontuação), colocação como elemento gráfico gigante,
 *   identidade (avatar + nick + título), branding discreto e CTA no rodapé.
 */

export type ShareCardFormat = 'story' | 'feed';

export type ShareCardThemeId = 'neon' | 'pastel' | 'arcade' | 'sunset' | 'terminal';

export interface ShareCardData {
  nickname: string;
  avatarSrc: string;
  tierTitle: string;
  powerLevel: number;
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
// Temas visuais
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

export const SHARE_CARD_THEMES: ShareCardTheme[] = [
  {
    id: 'neon',
    name: 'Neon Arena',
    tagline: 'Noite de final no telão',
    swatch: ['#1A0024', '#9747FF', '#FF4A97'],
    text: '#FFFFFF',
    subtext: 'rgba(255,255,255,0.72)',
    accent: '#FF4A97',
    accent2: '#FFCD34',
    panelBg: 'rgba(255,255,255,0.07)',
    panelBorder: 'rgba(255,255,255,0.16)',
    pillBg: 'rgba(255,74,151,0.18)',
    pillText: '#FFD1E6',
    scoreGradient: ['#FFCD34', '#FF4A97'],
    numeralColor: 'rgba(151,71,255,0.22)',
    ring: ['#9747FF', '#FF4A97'],
    displayFont: '"Paytone One", sans-serif',
    scoreFont: '"Orbitron", monospace',
    bodyFont: '"Poppins", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    paintBackground: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#12001A');
      g.addColorStop(0.55, '#2A0040');
      g.addColorStop(1, '#14001F');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      radialBlob(ctx, w * 0.1, h * 0.12, w * 0.7, 'rgba(151,71,255,0.45)');
      radialBlob(ctx, w * 0.95, h * 0.55, w * 0.65, 'rgba(255,74,151,0.38)');
      radialBlob(ctx, w * 0.3, h * 0.98, w * 0.6, 'rgba(255,205,52,0.16)');
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 2;
      for (let y = h * 0.6; y < h; y += 46) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    },
  },
  {
    id: 'pastel',
    name: 'Pastel Mermã',
    tagline: 'A identidade oficial do evento',
    swatch: ['#FAF7FF', '#DDC7F8', '#FF4A97'],
    text: '#330043',
    subtext: '#6E4F7D',
    accent: '#FF4A97',
    accent2: '#9747FF',
    panelBg: 'rgba(255,255,255,0.78)',
    panelBorder: '#DDC7F8',
    pillBg: '#F5F0FF',
    pillText: '#4C1D95',
    scoreGradient: ['#9747FF', '#FF4A97'],
    numeralColor: 'rgba(151,71,255,0.10)',
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
      radialBlob(ctx, w * 0.95, h * 0.08, w * 0.6, 'rgba(255,74,151,0.20)');
      radialBlob(ctx, w * 0.02, h * 0.45, w * 0.55, 'rgba(151,71,255,0.16)');
      radialBlob(ctx, w * 0.8, h * 0.95, w * 0.6, 'rgba(255,205,52,0.22)');
      dotGrid(ctx, w, h, 54, 2.4, 'rgba(151,71,255,0.10)');
    },
  },
  {
    id: 'arcade',
    name: 'Pop Arcade',
    tagline: 'Cartaz pop, contorno grosso',
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
    numeralColor: 'rgba(51,0,67,0.10)',
    ring: ['#330043', '#FF4A97'],
    displayFont: '"Paytone One", sans-serif',
    scoreFont: '"Paytone One", sans-serif',
    bodyFont: '"Poppins", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    hardShadow: '#330043',
    paintBackground: (ctx, w, h) => {
      ctx.fillStyle = '#FFCD34';
      ctx.fillRect(0, 0, w, h);
      // Raios de sol pop
      ctx.save();
      ctx.translate(w / 2, h * 0.36);
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
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
      dotGrid(ctx, w, h, 36, 3, 'rgba(51,0,67,0.07)');
    },
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol MA',
    tagline: 'Lençóis Maranhenses ao entardecer',
    swatch: ['#FF8A3D', '#FF4A97', '#6B21A8'],
    text: '#FFFFFF',
    subtext: 'rgba(255,255,255,0.82)',
    accent: '#FFE27A',
    accent2: '#FFFFFF',
    panelBg: 'rgba(255,255,255,0.16)',
    panelBorder: 'rgba(255,255,255,0.35)',
    pillBg: 'rgba(255,255,255,0.22)',
    pillText: '#FFFFFF',
    scoreGradient: ['#FFFFFF', '#FFE27A'],
    numeralColor: 'rgba(255,255,255,0.14)',
    ring: ['#FFE27A', '#FFFFFF'],
    displayFont: '"Paytone One", sans-serif',
    scoreFont: '"Paytone One", sans-serif',
    bodyFont: '"Poppins", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    paintBackground: (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#5B1A8C');
      g.addColorStop(0.45, '#E8407F');
      g.addColorStop(0.8, '#FF8A3D');
      g.addColorStop(1, '#FFC15E');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      radialBlob(ctx, w * 0.5, h * 0.78, w * 0.55, 'rgba(255,226,122,0.55)');
      // Dunas
      const dune = (baseY: number, amp: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, h);
        ctx.lineTo(0, baseY);
        ctx.bezierCurveTo(w * 0.3, baseY - amp, w * 0.6, baseY + amp, w, baseY - amp * 0.4);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      };
      dune(h * 0.86, 60, 'rgba(255,245,230,0.30)');
      dune(h * 0.92, 40, 'rgba(255,250,240,0.45)');
    },
  },
  {
    id: 'terminal',
    name: 'Terminal IA',
    tagline: 'Hacker de prompt, modo código',
    swatch: ['#07070D', '#22F5A8', '#9747FF'],
    text: '#EFFFF8',
    subtext: 'rgba(200,255,232,0.70)',
    accent: '#22F5A8',
    accent2: '#B98CFF',
    panelBg: 'rgba(34,245,168,0.06)',
    panelBorder: 'rgba(34,245,168,0.35)',
    pillBg: 'rgba(34,245,168,0.14)',
    pillText: '#22F5A8',
    scoreGradient: ['#22F5A8', '#B98CFF'],
    numeralColor: 'rgba(34,245,168,0.08)',
    ring: ['#22F5A8', '#9747FF'],
    displayFont: '"Orbitron", monospace',
    scoreFont: '"Orbitron", monospace',
    bodyFont: '"Atkinson Hyperlegible", sans-serif',
    logoSrc: '/marca/logo-mermas.svg',
    paintBackground: (ctx, w, h) => {
      ctx.fillStyle = '#07070D';
      ctx.fillRect(0, 0, w, h);
      radialBlob(ctx, w * 0.85, h * 0.15, w * 0.6, 'rgba(151,71,255,0.25)');
      radialBlob(ctx, w * 0.1, h * 0.85, w * 0.6, 'rgba(34,245,168,0.16)');
      ctx.fillStyle = 'rgba(34,245,168,0.035)';
      for (let y = 0; y < h; y += 6) {
        ctx.fillRect(0, y, w, 2);
      }
      ctx.font = '600 22px "Orbitron", monospace';
      ctx.fillStyle = 'rgba(34,245,168,0.10)';
      const glyphs = '01<>{}/=+*#';
      for (let i = 0; i < 160; i += 1) {
        const x = (i * 137.5) % w;
        const y = (i * 241.3) % h;
        ctx.fillText(glyphs[i % glyphs.length], x, y);
      }
    },
  },
];

export function getShareTheme(id: ShareCardThemeId): ShareCardTheme {
  return SHARE_CARD_THEMES.find((t) => t.id === id) || SHARE_CARD_THEMES[0];
}

// ----------------------------------------------------------------------------
// Utilitários de desenho
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
// Renderização principal
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
  ctx.fillText(`${data.rank}º`, W + 40, isStory ? 1080 : 860);
  ctx.restore();

  // --- Cabeçalho (fora da zona de UI do Stories) ---
  let y = isStory ? 210 : 90;
  if (logoImg) {
    const lh = 64;
    const lw = Math.min(300, ((logoImg.naturalWidth || 300) / (logoImg.naturalHeight || 64)) * lh);
    ctx.save();
    if (theme.text === '#FFFFFF' || theme.id === 'terminal') {
      // Selo claro atrás do logo em temas escuros para manter legibilidade da marca
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      pathRoundRect(ctx, PAD - 18, y - 12, lw + 36, lh + 24, 24);
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
  ctx.fillStyle = theme.id === 'sunset' || theme.id === 'terminal' ? '#1A0024' : '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(chipText, chipX + chipW / 2, y + 51);

  // --- Kicker + Headline ---
  y += isStory ? 190 : 150;
  ctx.textAlign = 'left';
  ctx.font = `700 30px ${theme.bodyFont}`;
  ctx.fillStyle = theme.accent;
  const kickerLabel = `DESAFIO DE PROMPT • ${kicker}`;
  ctx.fillText(kickerLabel.split('').join('\u200A'), PAD, y);

  y += isStory ? 92 : 80;
  ctx.fillStyle = theme.text;
  fitFont(ctx, headline, '400', theme.displayFont, isStory ? 92 : 78, W - PAD * 2);
  ctx.fillText(headline, PAD, y);

  // --- Bloco de identidade: Avatar + Nick + Título ---
  y += isStory ? 70 : 50;
  const avatarSize = isStory ? 250 : 200;
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
    ctx.arc(cx + 8, cy + 10, avatarSize / 2 + 12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = ringGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, avatarSize / 2 + 12, 0, Math.PI * 2);
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

  // Medalha de nível
  const lvR = isStory ? 44 : 38;
  const lvX = ax + avatarSize - lvR * 0.6;
  const lvY = ay + avatarSize - lvR * 0.6;
  ctx.fillStyle = theme.id === 'arcade' ? '#FF4A97' : theme.accent2 === '#FFFFFF' ? '#FF4A97' : theme.accent2;
  ctx.beginPath();
  ctx.arc(lvX, lvY, lvR, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();
  ctx.fillStyle = theme.id === 'terminal' ? '#07070D' : '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `800 ${isStory ? 30 : 26}px ${theme.scoreFont}`;
  ctx.fillText(`Lv${data.powerLevel}`, lvX, lvY + 11);

  // Nick e título
  const infoX = ax + avatarSize + 56;
  const infoW = W - PAD - infoX;
  ctx.textAlign = 'left';
  ctx.font = `700 ${isStory ? 30 : 26}px ${theme.bodyFont}`;
  const pillText = data.tierTitle.toUpperCase();
  const pillW = Math.min(infoW, ctx.measureText(pillText).width + 44);
  const pillY = ay + (isStory ? 40 : 28);
  ctx.fillStyle = theme.pillBg;
  pathRoundRect(ctx, infoX, pillY, pillW, isStory ? 56 : 50, 28);
  ctx.fill();
  ctx.fillStyle = theme.pillText;
  ctx.fillText(pillText, infoX + 22, pillY + (isStory ? 38 : 34), infoW - 44);

  ctx.fillStyle = theme.text;
  fitFont(ctx, data.nickname, '400', theme.displayFont, isStory ? 96 : 80, infoW, 40);
  ctx.fillText(data.nickname, infoX, pillY + (isStory ? 160 : 135));

  ctx.font = `600 ${isStory ? 30 : 26}px ${theme.bodyFont}`;
  ctx.fillStyle = theme.subtext;
  ctx.fillText(
    `${data.rank}º lugar entre ${Math.max(data.totalPlayers, data.rank)} na sala`,
    infoX,
    pillY + (isStory ? 212 : 180)
  );

  // --- Pontuação Herói ---
  y = ay + avatarSize + (isStory ? 90 : 60);
  const scorePanelH = isStory ? 330 : 270;
  drawPanel(ctx, theme, PAD, y, W - PAD * 2, scorePanelH, 48);

  ctx.font = `700 30px ${theme.bodyFont}`;
  ctx.fillStyle = theme.subtext;
  ctx.textAlign = 'left';
  ctx.fillText('PONTUAÇÃO DA RODADA', PAD + 48, y + 70);

  if (data.isNewHighScore) {
    ctx.font = `700 26px ${theme.bodyFont}`;
    const recText = '★ NOVO RECORDE';
    const recW = ctx.measureText(recText).width + 40;
    ctx.fillStyle = theme.accent;
    pathRoundRect(ctx, W - PAD - 48 - recW, y + 34, recW, 50, 25);
    ctx.fill();
    ctx.fillStyle = theme.id === 'sunset' || theme.id === 'terminal' ? '#1A0024' : '#FFFFFF';
    ctx.fillText(recText, W - PAD - 48 - recW + 20, y + 68);
  }

  const scoreStr = String(data.totalScore);
  const scoreSize = isStory ? 210 : 170;
  ctx.font = `800 ${scoreSize}px ${theme.scoreFont}`;
  const scoreW = ctx.measureText(scoreStr).width;
  const scoreGrad = ctx.createLinearGradient(PAD + 48, 0, PAD + 48 + scoreW, 0);
  scoreGrad.addColorStop(0, theme.scoreGradient[0]);
  scoreGrad.addColorStop(1, theme.scoreGradient[1]);
  ctx.fillStyle = scoreGrad;
  const scoreBaseline = y + (isStory ? 270 : 220);
  ctx.fillText(scoreStr, PAD + 44, scoreBaseline);
  ctx.font = `700 ${isStory ? 54 : 46}px ${theme.bodyFont}`;
  ctx.fillStyle = theme.text;
  ctx.fillText('pts', PAD + 64 + scoreW, scoreBaseline);

  if (data.speedBonus > 0) {
    ctx.font = `700 ${isStory ? 28 : 24}px ${theme.bodyFont}`;
    ctx.fillStyle = theme.accent;
    ctx.textAlign = 'right';
    ctx.fillText(`⚡ +${data.speedBonus} velocidade`, W - PAD - 48, scoreBaseline);
    ctx.textAlign = 'left';
  }

  // --- 3 Camadas do Prompt ---
  y += scorePanelH + (isStory ? 44 : 34);
  const layers = [
    { label: 'Sujeito', score: data.subjectScore, max: 400, color: '#FF4A97' },
    { label: 'Estilo', score: data.styleScore, max: 300, color: '#9747FF' },
    { label: 'Cenário', score: data.detailsScore, max: 300, color: '#FFB020' },
  ];
  const gap = 28;
  const colW = (W - PAD * 2 - gap * 2) / 3;
  const colH = isStory ? 190 : 160;
  layers.forEach((layer, i) => {
    const x = PAD + i * (colW + gap);
    drawPanel(ctx, theme, x, y, colW, colH, 36);
    const pct = Math.max(0, Math.min(1, layer.score / layer.max));
    ctx.font = `700 28px ${theme.bodyFont}`;
    ctx.fillStyle = theme.subtext;
    ctx.textAlign = 'left';
    ctx.fillText(layer.label.toUpperCase(), x + 30, y + 54);
    ctx.font = `800 ${isStory ? 64 : 54}px ${theme.scoreFont}`;
    ctx.fillStyle = theme.text;
    ctx.fillText(`${Math.round(pct * 100)}%`, x + 28, y + (isStory ? 128 : 112));
    const barY = y + colH - 40;
    const barW = colW - 60;
    ctx.fillStyle = theme.id === 'arcade' ? 'rgba(51,0,67,0.12)' : 'rgba(127,127,127,0.22)';
    pathRoundRect(ctx, x + 30, barY, barW, 14, 7);
    ctx.fill();
    ctx.fillStyle = theme.id === 'terminal' ? theme.accent : layer.color;
    pathRoundRect(ctx, x + 30, barY, Math.max(14, barW * pct), 14, 7);
    ctx.fill();
  });
  y += colH;

  // --- Imagem decifrada (apenas Story) ---
  if (isStory && challengeImg) {
    y += 44;
    const imgH = 300;
    const imgW = W - PAD * 2;
    if (theme.hardShadow) {
      ctx.fillStyle = theme.hardShadow;
      pathRoundRect(ctx, PAD + 10, y + 12, imgW, imgH, 40);
      ctx.fill();
    }
    ctx.save();
    pathRoundRect(ctx, PAD, y, imgW, imgH, 40);
    ctx.clip();
    drawImageCover(ctx, challengeImg, PAD, y, imgW, imgH);
    const shade = ctx.createLinearGradient(0, y + imgH * 0.35, 0, y + imgH);
    shade.addColorStop(0, 'rgba(0,0,0,0)');
    shade.addColorStop(1, 'rgba(0,0,0,0.72)');
    ctx.fillStyle = shade;
    ctx.fillRect(PAD, y, imgW, imgH);
    ctx.restore();
    ctx.lineWidth = theme.hardShadow ? 6 : 3;
    ctx.strokeStyle = theme.panelBorder;
    pathRoundRect(ctx, PAD, y, imgW, imgH, 40);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = `700 24px ${theme.bodyFont}`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('A ARTE DE IA QUE EU DECIFREI', PAD + 36, y + imgH - 78);
    ctx.fillStyle = '#FFFFFF';
    fitFont(ctx, data.challengeTitle, '400', '"Paytone One", sans-serif', 46, imgW - 72, 26);
    ctx.fillText(data.challengeTitle, PAD + 36, y + imgH - 30);
    y += imgH;
  }

  // --- Rodapé CTA (acima da zona de UI inferior no Story) ---
  const footerY = isStory ? H - 330 : H - 110;
  ctx.textAlign = 'center';
  ctx.font = `700 ${isStory ? 34 : 30}px ${theme.bodyFont}`;
  ctx.fillStyle = theme.text;
  ctx.fillText('Consegue me superar? Jogue em', W / 2, footerY);
  ctx.font = `800 ${isStory ? 38 : 32}px ${theme.scoreFont}`;
  ctx.fillStyle = theme.accent;
  ctx.fillText(SHARE_PUBLIC_URL, W / 2, footerY + (isStory ? 56 : 48));
  if (isStory) {
    ctx.font = `600 28px ${theme.bodyFont}`;
    ctx.fillStyle = theme.subtext;
    ctx.fillText('#MDX26  #MermasDigitais  #DesafioDePrompt', W / 2, footerY + 110);
  }
}

// ----------------------------------------------------------------------------
// Exportação / Compartilhamento
// ----------------------------------------------------------------------------

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png', 0.95));
}

export function buildShareText(data: ShareCardData): string {
  const place = data.rank === 1 ? 'fiquei em 1º lugar' : `fiquei em ${data.rank}º lugar`;
  return `Fiz ${data.totalScore} pts e ${place} no Desafio de Prompt do #MDX26 🎨🤖 Consegue me superar? https://${SHARE_PUBLIC_URL}`;
}

export type ShareOutcome = 'shared' | 'downloaded' | 'cancelled' | 'failed';

export async function shareOrDownloadCard(
  canvas: HTMLCanvasElement,
  data: ShareCardData,
  fileLabel: string
): Promise<ShareOutcome> {
  const blob = await canvasToBlob(canvas);
  if (!blob) return 'failed';
  const safeNick = data.nickname.replace(/[^a-zA-Z0-9_-]+/g, '-').slice(0, 24) || 'jogadora';
  const fileName = `mdx26-desafio-prompt-${safeNick}-${fileLabel}.png`;
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

  return downloadBlob(blob, fileName);
}

export function downloadBlob(blob: Blob, fileName: string): ShareOutcome {
  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'downloaded';
  } catch {
    return 'failed';
  }
}
