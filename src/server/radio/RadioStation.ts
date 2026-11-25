import crypto from 'node:crypto';
import { HttpError } from '../auth.js';
import type { RadioMedia, RadioPlaylist, RadioState, RadioTrack } from '../../shared/radio.js';

export interface RadioCatalog {
  playlist(url: string): Promise<RadioPlaylist>;
  media(track: RadioTrack): Promise<RadioMedia>;
}
export const DEFAULT_RADIO_PLAYLIST = 'https://open.spotify.com/playlist/4uYdic4V50S6NQEEFYkW63';

export function normalizePlaylistUrl(raw: string): string {
  const uri = raw.trim().match(/^spotify:(playlist|album|track):([a-zA-Z0-9]{10,64})$/);
  if (uri) return `https://open.spotify.com/${uri[1]}/${uri[2]}`;
  try {
    const url = new URL(raw.trim());
    const match = url.pathname.match(/^\/(?:intl-[a-zA-Z-]+\/)?(?:embed\/)?(playlist|album|track)\/([a-zA-Z0-9]{10,64})\/?$/);
    if (url.protocol === 'https:' && url.hostname === 'open.spotify.com' && !url.username && !url.password && !url.port && match) return `https://open.spotify.com/${match[1]}/${match[2]}`;
  } catch { /* Invalid URLs never reach an upstream request. */ }
  throw new HttpError(400, 'Use um link HTTPS de playlist, álbum ou faixa do Spotify.');
}

export class RadioStation {
  private readonly epoch = crypto.randomUUID();
  private revision = 0;
  private playlist: RadioPlaylist | null = null;
  private queue: RadioTrack[] = [];
  private history: NonNullable<RadioState['track']>[] = [];
  private track: RadioState['track'] = null;
  private startedAt = 0;
  private status: RadioState['status'] = 'loading';
  private error: string | null = null;
  private pending: Promise<void> | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private initialized = false;
  private disposed = false;

  constructor(private options: {
    catalog: RadioCatalog;
    defaultUrl: string;
    readUrl: () => Promise<string | null>;
    saveUrl: (url: string) => Promise<void>;
    publish: (state: RadioState) => void;
    active?: () => boolean;
    now?: () => number;
  }) {}

  snapshot(): RadioState {
    return { epoch: this.epoch, revision: this.revision, serverNow: this.now(), status: this.status,
      playlistUrl: this.playlist?.url || '', playlistTitle: this.playlist?.title || 'Rádio global', coverUrl: this.playlist?.coverUrl || '',
      track: this.track ? { ...this.track } : null, startedAt: this.startedAt, error: this.error };
  }
  private now() { return (this.options.now || Date.now)(); }
  private available() { return !this.disposed && (this.options.active?.() ?? true); }
  private emit() { this.revision++; this.options.publish(this.snapshot()); }
  private schedule(delay: number) {
    if (this.timer) clearTimeout(this.timer);
    if (!this.available()) return;
    this.timer = setTimeout(() => { void this.tick(); }, Math.max(100, delay));
    this.timer.unref?.();
  }
  private shuffle(tracks: RadioTrack[]): RadioTrack[] {
    const result = tracks.map((track) => ({ ...track }));
    for (let i = result.length - 1; i > 0; i--) {
      const j = crypto.randomInt(i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    if (result.length > 1 && result[0].uri === this.track?.uri) [result[0], result[1]] = [result[1], result[0]];
    return result;
  }
  private async prepare(queue: RadioTrack[]): Promise<{ track: NonNullable<RadioState['track']>; remaining: RadioTrack[] }> {
    // Bound upstream work; one broken catalog must not start an endless retry loop.
    for (let attempt = 0; queue.length && attempt < 5; attempt++) {
      const candidate = queue.shift()!;
      try {
        const media = await this.options.catalog.media(candidate);
        if (!/^[a-zA-Z0-9_-]{11}$/.test(media.videoId) || !Number.isFinite(media.durationSec) || media.durationSec < 1 || media.durationSec > 7200) continue;
        return { track: { ...candidate, ...media }, remaining: queue };
      } catch { /* Try the next server-selected candidate, never a local fallback. */ }
    }
    throw new HttpError(502, 'Não foi possível preparar uma faixa reproduzível. A rádio tentará novamente.');
  }
  private install(playlist: RadioPlaylist, prepared: Awaited<ReturnType<RadioStation['prepare']>>, pushHistory = true) {
    if (!this.available()) return;
    if (pushHistory && this.track && this.playlist?.url === playlist.url) {
      this.history = [...this.history, { ...this.track }].slice(-25);
    } else if (this.playlist?.url !== playlist.url) {
      this.history = [];
    }
    this.playlist = playlist; this.queue = prepared.remaining; this.track = prepared.track;
    this.startedAt = this.now(); this.status = 'playing'; this.error = null;
    this.emit(); this.schedule(this.track.durationSec * 1000);
  }
  private async load(url: string, persist: boolean) {
    const normalized = normalizePlaylistUrl(url);
    const playlist = await this.options.catalog.playlist(normalized);
    if (!playlist.tracks.length || playlist.tracks.length > 500) throw new HttpError(422, 'A playlist precisa ter entre 1 e 500 faixas disponíveis.');
    const prepared = await this.prepare(this.shuffle(playlist.tracks));
    if (!this.available()) throw new HttpError(503, 'Rádio indisponível.');
    // Publish only after successful validation and persistence; failed edits keep the old station.
    if (persist) await this.options.saveUrl(normalized);
    this.install({ ...playlist, url: normalized }, prepared);
  }
  start(): Promise<void> {
    if (!this.available() || this.initialized) return this.pending || Promise.resolve();
    this.initialized = true;
    const task = (async () => {
      try { await this.load(await this.options.readUrl() || this.options.defaultUrl, false); }
      catch {
        if (this.available()) { this.status = 'unavailable'; this.error = 'Rádio indisponível. Tentando reconectar ao provedor…'; this.emit(); this.schedule(60000); }
      }
    })();
    this.pending = task.finally(() => { this.pending = null; });
    return this.pending;
  }
  async changePlaylist(url: string, expectedEpoch: string, expectedRevision: number): Promise<RadioState> {
    if (!this.available()) throw new HttpError(503, 'Rádio indisponível.');
    if (this.pending || expectedEpoch !== this.epoch || expectedRevision !== this.revision) throw new HttpError(409, 'A rádio mudou ou está preparando uma faixa. Atualize antes de salvar.');
    const task = this.load(url, true);
    this.pending = task.finally(() => { this.pending = null; });
    try { await this.pending; }
    finally { if (this.track) this.schedule(Math.max(100, this.startedAt + this.track.durationSec * 1000 - this.now())); }
    this.initialized = true;
    return this.snapshot();
  }
  async nextTrack(expectedEpoch: string, expectedRevision: number): Promise<RadioState> {
    if (!this.available()) throw new HttpError(503, 'Rádio indisponível.');
    if (this.pending || expectedEpoch !== this.epoch || expectedRevision !== this.revision) throw new HttpError(409, 'A rádio mudou ou está preparando uma faixa. Atualize antes de avançar.');
    if (!this.playlist) throw new HttpError(409, 'A rádio ainda está carregando.');
    this.status = 'loading'; this.emit();
    const task = (async () => {
      try {
        const queue = this.queue.length ? [...this.queue] : this.shuffle(this.playlist!.tracks);
        this.install(this.playlist!, await this.prepare(queue));
      } catch {
        if (this.available()) { this.status = 'unavailable'; this.error = 'Faixa indisponível. Tentando novamente…'; this.emit(); this.schedule(60000); }
      }
    })();
    this.pending = task.finally(() => { this.pending = null; });
    await this.pending;
    return this.snapshot();
  }
  async previousTrack(expectedEpoch: string, expectedRevision: number): Promise<RadioState> {
    if (!this.available()) throw new HttpError(503, 'Rádio indisponível.');
    if (this.pending || expectedEpoch !== this.epoch || expectedRevision !== this.revision) throw new HttpError(409, 'A rádio mudou ou está preparando uma faixa. Atualize antes de voltar.');
    if (!this.playlist || !this.track) throw new HttpError(409, 'A rádio ainda está carregando.');
    const previous = this.history.pop();
    if (previous) {
      const remaining = [{ uri: this.track.uri, title: this.track.title, artist: this.track.artist }, ...this.queue];
      this.install(this.playlist, { track: previous, remaining }, false);
    } else {
      // No earlier track in history: restart current track from 0s
      this.startedAt = this.now();
      this.status = 'playing';
      this.error = null;
      this.emit();
      this.schedule(this.track.durationSec * 1000);
    }
    return this.snapshot();
  }
  seek(positionSec: number, expectedEpoch: string, expectedRevision: number): RadioState {
    if (!this.available()) throw new HttpError(503, 'Rádio indisponível.');
    if (this.pending || expectedEpoch !== this.epoch || expectedRevision !== this.revision) throw new HttpError(409, 'A rádio mudou ou está preparando uma faixa.');
    if (!this.track || this.status !== 'playing') throw new HttpError(409, 'Nenhuma faixa em reprodução.');
    const clamped = Math.max(0, Math.min(Math.max(0, this.track.durationSec - 1), positionSec));
    this.startedAt = this.now() - Math.round(clamped * 1000);
    this.emit();
    this.schedule(Math.max(100, (this.track.durationSec - clamped) * 1000));
    return this.snapshot();
  }
  async tick(): Promise<void> {
    if (!this.available() || this.pending) return;
    if (!this.playlist || !this.track) { this.initialized = false; await this.start(); return; }
    if (this.now() < this.startedAt + this.track.durationSec * 1000) {
      this.schedule(this.startedAt + this.track.durationSec * 1000 - this.now()); return;
    }
    this.status = 'loading'; this.emit();
    const task = (async () => {
      try {
        const queue = this.queue.length ? [...this.queue] : this.shuffle(this.playlist!.tracks);
        this.install(this.playlist!, await this.prepare(queue));
      } catch {
        if (this.available()) { this.status = 'unavailable'; this.error = 'Faixa indisponível. Tentando novamente…'; this.emit(); this.schedule(60000); }
      }
    })();
    this.pending = task.finally(() => { this.pending = null; });
    await this.pending;
  }
  close() { this.disposed = true; if (this.timer) clearTimeout(this.timer); }
}
