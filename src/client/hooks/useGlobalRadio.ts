import { useEffect } from 'react';
import { getSocket } from '../store/useGameStore';
import { useRadioStore } from '../store/useRadioStore';
import type { RadioState } from '../../shared/radio';

/** One subscription and clock per browser, unrelated to the selected game session. */
export function useGlobalRadio() {
  useEffect(() => {
    let alive = true, generation = 0, request = 0;
    let bestRtt = Infinity;
    let controller: AbortController | null = null;
    const socket = getSocket();
    const sync = async (newConnection = false) => {
      const ownRequest = ++request, ownGeneration = generation;
      controller?.abort(); controller = new AbortController();
      const sent = performance.now();
      try {
        const response = await fetch('/api/radio', { cache: 'no-store', signal: controller.signal });
        if (!response.ok) throw new Error('Rádio desconectada. Tentando novamente…');
        const station = await response.json() as RadioState;
        const received = performance.now();
        if (!alive || ownRequest !== request || ownGeneration !== generation) return;
        const rtt = received - sent;
        // Prefer the lowest-RTT sample (NTP-style) so a slow initial fetch doesn't lock in a skewed clock offset.
        const useClock = rtt <= bestRtt + 40 || newConnection;
        if (rtt < bestRtt) bestRtt = rtt;
        useRadioStore.getState().apply(
          station,
          useClock ? { server: station.serverNow + rtt / 2, client: received } : undefined,
          newConnection
        );
      } catch (error) {
        if (alive && ownRequest === request && !controller?.signal.aborted) useRadioStore.setState({ connectionError: 'Sem conexão com a rádio. Aguardando reconexão…' });
      }
    };
    const onState = (station: RadioState) => { if (alive) useRadioStore.getState().apply(station); };
    const onConnect = () => {
      generation++;
      bestRtt = Infinity;
      socket.emit('radio:subscribe');
      void sync(true);
      // Take a second quick sample after TCP/TLS warm-up for a tighter clock offset between TVs.
      setTimeout(() => { if (alive) void sync(false); }, 800);
    };
    const onDisconnect = () => { useRadioStore.setState({ connectionError: 'Rádio desconectada. Aguardando reconexão…' }); };
    const onVisible = () => { if (document.visibilityState === 'visible') void sync(true); };
    socket.on('radio:state', onState); socket.on('connect', onConnect); socket.on('disconnect', onDisconnect);
    if (socket.connected) onConnect(); else { socket.connect(); void sync(true); }
    const timer = setInterval(() => { void sync(true); }, 10000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onVisible);
    return () => {
      alive = false; controller?.abort(); clearInterval(timer);
      socket.emit('radio:unsubscribe');
      socket.off('radio:state', onState); socket.off('connect', onConnect); socket.off('disconnect', onDisconnect);
      document.removeEventListener('visibilitychange', onVisible); window.removeEventListener('online', onVisible);
    };
  }, []);
}
