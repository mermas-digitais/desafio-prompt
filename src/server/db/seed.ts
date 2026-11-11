import 'dotenv/config';
import { database } from './index.js';

async function runSeed() {
  console.log('🌱 Iniciando seed do Desafio de Prompt MDX STEAM 2026...');
  await database.init();
  const leaderboards = await database.getLeaderboards(10);
  console.log(
    `✅ Seed concluído! Total de jogadoras no ranking: ${leaderboards.stats.totalPlayers} | Maior pontuação: ${leaderboards.stats.highestScoreEver}`
  );
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Erro ao executar seed:', err);
  process.exit(1);
});
