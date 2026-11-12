import type { FastifyInstance } from 'fastify';

// The existing music integration stays independent from game authorization.
export function registerMusicRoutes(app: FastifyInstance): void {
  const playlists = new Map<string, { playlistTitle: string; coverUrl: string; tracks: Array<{ uri: string; title: string; subtitle: string; duration: number; previewUrl: string }>; fetchedAt: number }>();
  const videos = new Map<string, string[]>();
  app.get<{ Querystring: { url?: string } }>('/api/spotify-playlist', async (req) => {
    const raw = (req.query?.url || process.env.SPOTIFY_PLAYLIST_URL || process.env.VITE_SPOTIFY_PLAYLIST_URL || 'https://open.spotify.com/playlist/4uYdic4V50S6NQEEFYkW63').trim();
    const match = raw.match(/^spotify:(playlist|album|track|artist):([a-zA-Z0-9]+)/i) || raw.match(/open\.spotify\.com\/(?:embed\/)?(?:intl-[a-zA-Z-]+\/)?(playlist|album|track|artist)\/([a-zA-Z0-9]+)/i);
    const type = match?.[1].toLowerCase() || 'playlist';
    const id = match?.[2] || '4uYdic4V50S6NQEEFYkW63';
    const key = `${type}:${id}`;
    const cached = playlists.get(key);
    if (cached && Date.now() - cached.fetchedAt < 30 * 60000) return { ok: true, entityUri: `spotify:${key}`, playlistTitle: cached.playlistTitle, coverUrl: cached.coverUrl, tracks: cached.tracks };
    try {
      const response = await fetch(`https://open.spotify.com/embed/${type}/${id}`, { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'Mozilla/5.0 Chrome/125.0.0.0 Safari/537.36' } });
      const html = await response.text();
      const index = html.indexOf('__NEXT_DATA__');
      if (index >= 0) {
        const start = html.indexOf('>', index) + 1;
        const end = html.indexOf('</script>', start);
        const entity = JSON.parse(html.slice(start, end))?.props?.pageProps?.state?.data?.entity;
        const images = entity?.visualIdentity?.image || [];
        const tracks = (Array.isArray(entity?.trackList) ? entity.trackList : [])
          .filter((t: any) => t?.uri && t.isPlayable !== false)
          .map((t: any) => ({ uri: String(t.uri), title: String(t.title || 'Faixa'), subtitle: String(t.subtitle || ''), duration: Number(t.duration || 0), previewUrl: String(t.audioPreview?.url || '') }));
        if (tracks.length) {
          const value = { playlistTitle: entity?.title || entity?.name || 'Trilha Sonora MDX', coverUrl: images[1]?.url || images[0]?.url || '', tracks, fetchedAt: Date.now() };
          if (playlists.size >= 100) playlists.delete(playlists.keys().next().value!);
          playlists.set(key, value);
          return { ok: true, entityUri: `spotify:${key}`, playlistTitle: value.playlistTitle, coverUrl: value.coverUrl, tracks };
        }
      }
    } catch { /* Preserve the offline player fallback. */ }
    return { ok: false, entityUri: `spotify:${key}`, playlistTitle: 'Trilha Sonora MDX', coverUrl: '', tracks: [] };
  });
  app.get<{ Querystring: { q?: string } }>('/api/spotify-track-video', async (req) => {
    const query = (req.query?.q || '').trim().slice(0, 300);
    if (!query) return { ok: false, videoIds: [] };
    const cached = videos.get(query.toLowerCase());
    if (cached) return { ok: true, videoIds: cached };
    try {
      const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(`${query} official audio`)}`, { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'Mozilla/5.0 Chrome/125.0.0.0 Safari/537.36', 'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8' } });
      const html = await response.text();
      const videoIds = [...new Set([...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]))].slice(0, 4);
      if (videoIds.length) {
        if (videos.size >= 300) videos.delete(videos.keys().next().value!);
        videos.set(query.toLowerCase(), videoIds);
        return { ok: true, videoIds };
      }
    } catch { /* Music failure must not interrupt the game. */ }
    return { ok: false, videoIds: [] };
  });
}
