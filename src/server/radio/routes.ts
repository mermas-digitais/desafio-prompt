import type { FastifyInstance } from 'fastify';
import type { Server } from 'socket.io';
import { z } from 'zod';
import { AuthService, HttpError } from '../auth.js';
import { database } from '../db/index.js';
import { DEFAULT_RADIO_PLAYLIST, RadioStation, type RadioCatalog } from './RadioStation.js';
import { SpotifyCatalog } from './SpotifyCatalog.js';

export function registerRadio(app: FastifyInstance, io: Server, auth: AuthService, isAvailable: () => boolean, catalog?: RadioCatalog): RadioStation {
  const radio = new RadioStation({
    catalog: catalog || new SpotifyCatalog(),
    defaultUrl: process.env.SPOTIFY_PLAYLIST_URL || process.env.VITE_SPOTIFY_PLAYLIST_URL || DEFAULT_RADIO_PLAYLIST,
    readUrl: () => database.getRadioPlaylistUrl(), saveUrl: (url) => database.setRadioPlaylistUrl(url),
    active: isAvailable,
    publish: (state) => { if (isAvailable()) io.to('radio:global').emit('radio:state', state); },
  });
  const requireRuntime = () => { if (!isAvailable()) throw new HttpError(503, 'Rádio indisponível. Atualize após o serviço reconectar.'); };
  app.get('/api/radio', async () => { requireRuntime(); void radio.start(); return radio.snapshot(); });
  app.put('/api/radio/playlist', async (req) => {
    requireRuntime();
    const user = await auth.requireUser(req.headers);
    const input = z.object({ url: z.string().trim().min(1).max(500), epoch: z.string().uuid(), revision: z.number().int().nonnegative() }).parse(req.body);
    if (!await database.consumeAuthAttempt(`radio:${user.id}`, 6, 60000)) throw new HttpError(429, 'Muitas alterações de playlist. Aguarde um minuto.');
    return radio.changePlaylist(input.url, input.epoch, input.revision);
  });
  const controlSchema = z.object({ epoch: z.string().uuid(), revision: z.number().int().nonnegative() });
  app.post('/api/radio/next', async (req) => {
    requireRuntime();
    const user = await auth.requireUser(req.headers);
    const input = controlSchema.parse(req.body);
    if (!await database.consumeAuthAttempt(`radio-ctrl:${user.id}`, 30, 60000)) throw new HttpError(429, 'Muitos comandos de rádio. Aguarde um instante.');
    return radio.nextTrack(input.epoch, input.revision);
  });
  app.post('/api/radio/previous', async (req) => {
    requireRuntime();
    const user = await auth.requireUser(req.headers);
    const input = controlSchema.parse(req.body);
    if (!await database.consumeAuthAttempt(`radio-ctrl:${user.id}`, 30, 60000)) throw new HttpError(429, 'Muitos comandos de rádio. Aguarde um instante.');
    return radio.previousTrack(input.epoch, input.revision);
  });
  app.post('/api/radio/seek', async (req) => {
    requireRuntime();
    const user = await auth.requireUser(req.headers);
    const input = controlSchema.extend({ positionSec: z.number().finite().min(0).max(7200) }).parse(req.body);
    if (!await database.consumeAuthAttempt(`radio-ctrl:${user.id}`, 60, 60000)) throw new HttpError(429, 'Muitos comandos de rádio. Aguarde um instante.');
    return radio.seek(input.positionSec, input.epoch, input.revision);
  });
  io.on('connection', (socket) => {
    // Public subscription independent of room/session; no game engine or participant slot.
    socket.on('radio:subscribe', (ack?: (state: ReturnType<RadioStation['snapshot']>) => void) => {
      socket.join('radio:global');
      if (typeof ack === 'function') ack(radio.snapshot());
    });
    socket.on('radio:unsubscribe', () => socket.leave('radio:global'));
  });
  return radio;
}
