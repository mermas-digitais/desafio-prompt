import type { RadioMedia, RadioPlaylist, RadioTrack } from '../../shared/radio.js';
import { normalizePlaylistUrl, type RadioCatalog } from './RadioStation.js';

async function upstreamText(url: string): Promise<string> {
  const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'Mozilla/5.0 Chrome/125.0.0.0 Safari/537.36', 'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8' } });
  if (!response.ok || !response.body) throw new Error('Music provider unavailable');
  const reader = response.body.getReader();
  let total = 0, text = '';
  const decoder = new TextDecoder();
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > 5 * 1024 * 1024) throw new Error('Music provider response too large');
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally { await reader.cancel().catch(() => {}); }
}

/** Extract balanced JSON without evaluating provider scripts. */
export function jsonObjectAfter(text: string, marker: string): unknown {
  const markerAt = text.indexOf(marker);
  if (markerAt < 0) throw new Error('Provider data missing');
  const start = text.indexOf('{', markerAt + marker.length);
  if (start < 0) throw new Error('Provider JSON missing');
  let depth = 0, quoted = false, escaped = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return JSON.parse(text.slice(start, i + 1));
  }
  throw new Error('Incomplete provider JSON');
}

export function youtubeMedia(data: unknown): RadioMedia | null {
  const stack: unknown[] = [data];
  let visited = 0;
  while (stack.length && ++visited <= 50000) {
    const node = stack.pop();
    if (!node || typeof node !== 'object') continue;
    const record = node as Record<string, any>;
    const video = record.videoRenderer;
    if (video && /^[a-zA-Z0-9_-]{11}$/.test(video.videoId)) {
      const length = video.lengthText?.simpleText || video.lengthText?.runs?.map((run: any) => String(run.text || '')).join('');
      if (typeof length === 'string' && /^\d{1,2}:\d{2}(?::\d{2})?$/.test(length)) {
        const durationSec = length.split(':').reduce((seconds, part) => seconds * 60 + Number(part), 0);
        if (durationSec > 0 && durationSec <= 7200) return { videoId: video.videoId, durationSec };
      }
    }
    // Reverse push preserves provider result order instead of picking the last result.
    const children = Object.values(record);
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  }
  return null;
}

export class SpotifyCatalog implements RadioCatalog {
  async playlist(raw: string): Promise<RadioPlaylist> {
    const url = normalizePlaylistUrl(raw);
    const playlistPath = new URL(url).pathname;
    const html = await upstreamText(`https://open.spotify.com/embed${playlistPath}`);
    const data = jsonObjectAfter(html, '__NEXT_DATA__') as any;
    const entity = data?.props?.pageProps?.state?.data?.entity;
    const images = entity?.visualIdentity?.image || [];
    const list = Array.isArray(entity?.trackList) ? entity.trackList : [];
    const seen = new Set<string>();
    const tracks: RadioTrack[] = [];
    for (const track of list.slice(0, 500)) {
      if (!track || typeof track !== 'object') continue;
      if (typeof track.uri !== 'string' || seen.has(track.uri) || track.isPlayable === false || typeof track.title !== 'string' || !track.title.trim()) continue;
      seen.add(track.uri);
      tracks.push({ uri: track.uri.slice(0, 200), title: track.title.slice(0, 200), artist: String(track.subtitle || '').slice(0, 200) });
    }
    return { url, title: String(entity?.title || entity?.name || 'Rádio global').slice(0, 200), coverUrl: String(images[1]?.url || images[0]?.url || ''), tracks };
  }
  async media(track: RadioTrack): Promise<RadioMedia> {
    const query = `${track.title} ${track.artist} official audio`.slice(0, 450);
    const html = await upstreamText(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
    const media = youtubeMedia(jsonObjectAfter(html, 'ytInitialData'));
    if (!media) throw new Error('No finite media found for radio track');
    return media;
  }
}
