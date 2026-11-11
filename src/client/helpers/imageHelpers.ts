import { ARENA_SHOWCASE_ITEMS } from '../../shared/showcaseData';

const preloadedUrls = new Set<string>();

/**
 * Resolve e normaliza a URL da imagem de qualquer desafio da partida,
 * garantindo fallback seguro para /challenges/<id>.webp caso um payload antigo/inválido
 * traga '.webp' ou string vazia.
 */
export function resolveChallengeImageUrl(id?: string | null, imageUrl?: string | null): string {
  const trimmed = (imageUrl || '').trim();
  if (trimmed && trimmed !== '.webp' && trimmed.startsWith('/challenges/') && trimmed.length > 13) {
    return trimmed;
  }
  const cleanId = (id || '').trim();
  if (cleanId) {
    const matched = ARENA_SHOWCASE_ITEMS.find((item) => item.id === cleanId);
    if (matched?.imageUrl) {
      return matched.imageUrl;
    }
    return `/challenges/${cleanId}.webp`;
  }
  return ARENA_SHOWCASE_ITEMS[0]?.imageUrl || '/challenges/boi-cyberpunk.webp';
}

/**
 * Redimensiona e recorta qualquer foto escolhida pela usuária em um quadrado central 160x160 JPEG leve.
 */
export function resizeImageToSquareDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler imagem'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido'));
      img.onload = () => {
        const size = 160;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas indisponível'));
          return;
        }
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Faz pré-carregamento assíncrono em segundo plano da próxima imagem da galeria/desafio
 * sem bloquear a thread principal.
 */
export function preloadChallengeImage(url?: string | null): void {
  if (!url || typeof window === 'undefined' || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}
