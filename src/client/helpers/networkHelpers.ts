declare const __DEV_LAN_IP__: string | undefined;

export function detectMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  const isTouchMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return window.innerWidth < 960 || isTouchMobileUA;
}

export function getInitialDevLanIp(): string {
  return typeof __DEV_LAN_IP__ === 'string' ? __DEV_LAN_IP__.trim() : '';
}

export function resolvePlatformPlayUrl(params: {
  roomCode: string;
  lanIp: string;
  publicAppUrl: string;
}): {
  playUrl: string;
  playDisplayUrl: string;
} {
  const roomCode = params.roomCode || 'MDX26';
  const fallbackLanIp = params.lanIp || getInitialDevLanIp();

  if (typeof window === 'undefined') {
    const host = fallbackLanIp || 'localhost';
    return {
      playUrl: `http://${host}:5173/play?room=${roomCode}`,
      playDisplayUrl: `${host}:5173/play`,
    };
  }

  const { protocol, hostname, port, origin } = window.location;
  const isLoopback =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '[::1]' ||
    hostname === '::1';
  const isDevMode = Boolean(
    (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV
  );

  let baseOrigin = origin;

  if (isDevMode || isLoopback) {
    // Em modo dev ou quando acessado via localhost, SEMPRE usa o IP da LAN do dispositivo + porta ativa
    const targetHost =
      fallbackLanIp && fallbackLanIp !== 'localhost' && fallbackLanIp !== '127.0.0.1'
        ? fallbackLanIp
        : hostname;
    const effectivePort = port || (isDevMode ? '5173' : '');
    const portSegment = effectivePort ? `:${effectivePort}` : '';
    baseOrigin = `${protocol}//${targetHost}${portSegment}`;
  } else if (params.publicAppUrl) {
    // Em produção, usa PUBLIC_APP_URL se configurada ou o origin real da plataforma
    baseOrigin = params.publicAppUrl.replace(/\/+$/, '');
  }

  const fullUrl = `${baseOrigin}/play?room=${roomCode}`;
  const cleanHost = baseOrigin.replace(/^https?:\/\//i, '');
  return {
    playUrl: fullUrl,
    playDisplayUrl: `${cleanHost}/play`,
  };
}
