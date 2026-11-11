import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import os from 'os';
import path from 'path';

function detectPrimaryLanIp(): string {
  const nets = os.networkInterfaces();
  const candidates: { ip: string; score: number }[] = [];

  for (const [name, interfaces] of Object.entries(nets)) {
    if (!interfaces) continue;
    for (const net of interfaces) {
      if (net.family === 'IPv4' && !net.internal) {
        const ip = net.address;
        if (ip.startsWith('169.254.')) continue;
        let score = 10;
        const lower = name.toLowerCase();
        if (lower.includes('wi-fi') || lower.includes('wlan') || lower.includes('wireless')) {
          score += 40;
        } else if (lower.includes('ethernet') || lower.includes('eth') || lower.includes('en0')) {
          score += 20;
        }
        if (
          ip.startsWith('192.168.56.') ||
          ip.startsWith('192.168.137.') ||
          lower.includes('vethernet') ||
          lower.includes('wsl') ||
          lower.includes('vbox') ||
          lower.includes('vmware') ||
          lower.includes('conexão local*') ||
          lower.includes('local area connection*')
        ) {
          score -= 35;
        }
        candidates.push({ ip, score });
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.ip || '';
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __DEV_LAN_IP__: JSON.stringify(detectPrimaryLanIp()),
    __PUBLIC_APP_URL__: JSON.stringify(
      process.env.PUBLIC_APP_URL || process.env.VITE_PUBLIC_APP_URL || 'https://dprompt.mermasdigitais.com.br'
    ),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/.data/**'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/public',
    emptyOutDir: true,
  },
});
