declare const __DEV_LAN_IP__: string | undefined;
declare const __PUBLIC_APP_URL__: string | undefined;

export function detectMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  const isTouchMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return window.innerWidth < 960 || isTouchMobileUA;
}

export function getInitialDevLanIp(): string {
  return typeof __DEV_LAN_IP__ === 'string' ? __DEV_LAN_IP__.trim() : '';
}

export function getProductionPublicUrl(): string {
  if (typeof __PUBLIC_APP_URL__ === 'string' && __PUBLIC_APP_URL__.trim()) {
    return __PUBLIC_APP_URL__.trim().replace(/\/+$/, '');
  }
  return 'https://dprompt.mermasdigitais.com.br';
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
  const isDevMode = Boolean(
    (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV
  );

  // ============================================================================
  // 1. EM PRODUÇÃO (ou acessado fora de localhost/dev)
  // SEMPRE usar o endereço público oficial da aplicação (NUNCA mostrar IP)
  // ============================================================================
  if (!isDevMode) {
    let prodOrigin = '';

    // a) URL pública passada pelo backend via /api/config
    const backendPub = (params.publicAppUrl || '').trim().replace(/\/+$/, '');
    if (backendPub && !/localhost|127\.0\.0\.1|0\.0\.0\.0|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+/i.test(backendPub)) {
      prodOrigin = backendPub;
    }

    // b) Domínio público real da janela atual (ex: dprompt.mermasdigitais.com.br)
    if (!prodOrigin && typeof window !== 'undefined') {
      const { hostname, origin } = window.location;
      const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
      if (!isIp && hostname.includes('.')) {
        prodOrigin = origin.replace(/\/+$/, '');
      }
    }

    // c) Fallback oficial compilado / padrão
    if (!prodOrigin) {
      prodOrigin = getProductionPublicUrl();
    }

    const fullUrl = `${prodOrigin}/play?room=${roomCode}`;
    const cleanHost = prodOrigin.replace(/^https?:\/\//i, '');
    return {
      playUrl: fullUrl,
      playDisplayUrl: `${cleanHost}/play`,
    };
  }

  // ============================================================================
  // 2. EM DESENVOLVIMENTO LOCAL (DEV)
  // Usa o IP da LAN do Wi-Fi com a porta ativa para que celulares na mesma rede acessem
  // ============================================================================
  const fallbackLanIp = params.lanIp || getInitialDevLanIp();
  const { protocol, hostname, port } =
    typeof window !== 'undefined'
      ? window.location
      : { protocol: 'http:', hostname: 'localhost', port: '5173' };

  const targetHost =
    fallbackLanIp && fallbackLanIp !== 'localhost' && fallbackLanIp !== '127.0.0.1'
      ? fallbackLanIp
      : hostname;
  const effectivePort = port || '5173';
  const baseOrigin = `${protocol}//${targetHost}:${effectivePort}`;

  return {
    playUrl: `${baseOrigin}/play?room=${roomCode}`,
    playDisplayUrl: `${targetHost}:${effectivePort}/play`,
  };
}
