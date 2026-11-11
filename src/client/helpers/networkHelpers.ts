declare const __IS_PRODUCTION_BUILD__: boolean | undefined;
declare const __DEV_LAN_IP__: string | undefined;
declare const __PUBLIC_APP_URL__: string | undefined;

const DEFAULT_PUBLIC_APP_URL = 'https://dprompt.mermasdigitais.com.br';

function isRawIpOrLocalUrl(urlOrHost: string): boolean {
  const clean = (urlOrHost || '')
    .trim()
    .replace(/^https?:\/\//i, '')
    .split('/')[0]
    .split(':')[0]
    .toLowerCase();
  if (!clean) return true;
  if (
    clean === 'localhost' ||
    clean === '0.0.0.0' ||
    clean === '[::1]' ||
    clean === '::1' ||
    clean.endsWith('.local') ||
    clean.endsWith('.internal')
  ) {
    return true;
  }
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(clean)) {
    return true;
  }
  return false;
}

export function detectMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  const isTouchMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return window.innerWidth < 960 || isTouchMobileUA;
}

export function getInitialDevLanIp(): string {
  return typeof __DEV_LAN_IP__ === 'string' ? __DEV_LAN_IP__.trim() : '';
}

export function getProductionPublicUrl(): string {
  if (
    typeof __PUBLIC_APP_URL__ === 'string' &&
    __PUBLIC_APP_URL__.trim() &&
    !isRawIpOrLocalUrl(__PUBLIC_APP_URL__)
  ) {
    return __PUBLIC_APP_URL__.trim().replace(/\/+$/, '');
  }
  return DEFAULT_PUBLIC_APP_URL;
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
  const isProdBuild =
    typeof __IS_PRODUCTION_BUILD__ === 'boolean' ? __IS_PRODUCTION_BUILD__ : false;
  const backendPub = (params.publicAppUrl || '').trim().replace(/\/+$/, '');
  const hasValidBackendPub = Boolean(backendPub && !isRawIpOrLocalUrl(backendPub));
  const hasValidBuildPub = Boolean(
    typeof __PUBLIC_APP_URL__ === 'string' &&
      __PUBLIC_APP_URL__.trim() &&
      !isRawIpOrLocalUrl(__PUBLIC_APP_URL__)
  );
  const isBrowserOnPublicDomain =
    typeof window !== 'undefined' &&
    window.location.hostname.includes('.') &&
    !isRawIpOrLocalUrl(window.location.hostname);

  // ============================================================================
  // 1. EM PRODUÇÃO (ou quando PUBLIC_APP_URL / domínio público está presente)
  // SEMPRE usar o endereço público oficial da aplicação (NUNCA mostrar IP)
  // ============================================================================
  if (isProdBuild || hasValidBackendPub || hasValidBuildPub || isBrowserOnPublicDomain) {
    let prodOrigin = '';

    if (hasValidBackendPub) {
      prodOrigin = backendPub;
    } else if (hasValidBuildPub && typeof __PUBLIC_APP_URL__ === 'string') {
      prodOrigin = __PUBLIC_APP_URL__.trim().replace(/\/+$/, '');
    } else if (isBrowserOnPublicDomain && typeof window !== 'undefined') {
      prodOrigin = window.location.origin.replace(/\/+$/, '');
    } else {
      prodOrigin = DEFAULT_PUBLIC_APP_URL;
    }

    if (!/^https?:\/\//i.test(prodOrigin)) {
      prodOrigin = `https://${prodOrigin}`;
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
