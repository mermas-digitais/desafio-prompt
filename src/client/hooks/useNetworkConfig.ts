import { useEffect, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { useTVUiStore } from '../store/useTVUiStore';
import { resolvePlatformPlayUrl } from '../helpers/networkHelpers';

export function useNetworkConfig() {
  const roomCode = useGameStore((s) => s.roomState.roomCode);
  const netConfig = useTVUiStore((s) => s.netConfig);
  const updateNetConfig = useTVUiStore((s) => s.updateNetConfig);

  useEffect(() => {
    let active = true;
    const loadNetConfig = () => {
      fetch('/api/config')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!active || !data) return;
          updateNetConfig({
            lanIp: data.lanIp,
            publicAppUrl: data.publicAppUrl,
          });
        })
        .catch(() => {});
    };

    loadNetConfig();
    const retry1 = setTimeout(loadNetConfig, 1500);
    const retry2 = setTimeout(loadNetConfig, 4000);

    return () => {
      active = false;
      clearTimeout(retry1);
      clearTimeout(retry2);
    };
  }, [updateNetConfig]);

  return useMemo(
    () =>
      resolvePlatformPlayUrl({
        roomCode,
        lanIp: netConfig.lanIp,
        publicAppUrl: netConfig.publicAppUrl,
      }),
    [roomCode, netConfig.lanIp, netConfig.publicAppUrl]
  );
}
