# 🎮 Desafio de Prompt — MDX STEAM 2026 (Mermãs Digitais)

Arena party game multiplayer interativa de **Inteligência Artificial & Engenharia de Prompt** desenvolvida para o **Espaço de IA do MDX STEAM 2026** (Mostra Digital de Tecnologia das **Mermãs Digitais** — IFMA Campus Imperatriz).

**Domínio de Produção Oficial:** [https://dprompt.mermasdigitais.com.br](https://dprompt.mermasdigitais.com.br)

---

## ✨ Funcionalidades Principais

* **📺 Modo Telão / TV (`/tv`):**
  * **3 Modos de Ranking com Indicadores de Competição:**
    1. 🌟 **Ranking Geral** (Índice ponderado de High Score + Vitórias + Partidas)
    2. 🎯 **Só Pontos** (Ordenado pelo maior High Score único)
    3. 👑 **Só Vitórias** (Ordenado pelo total de vitórias em 1º lugar)
    * Indicadores sutis de subida (`▲ +N`), descida (`▼ -N`), estreia (`✦ NOVO`) e manutenção (`—`).
  * **Sistema de Progressão em 10 Níveis & Títulos Oficiais:**
    * Molduras dinâmicas nos avatares (`Lv. 1` a `Lv. 10`) com títulos exclusivos (*Aprendiz*, *Curiosa*, *Prompt Designer*, *Maga dos Prompts*, *Lenda MDX*).
    * Strip de conquistas (*Achievements*) com animação suave de *marquee* infinito sem barras de rolagem.
  * **Lobby Pré-Game com até 5 Jogadores Simultâneos + Bot Mermã IA:**
    * Ao ler o QR Code no celular, a primeira jogadora abre o Lobby na TV com relógio de **1m30s (90s)** em destaque.
    * Capacidade expandida para **5 participantes simultâneos** por rodada.
    * Preenchimento automático com Bots IA se o tempo esgotar ou por comando rápido.
  * **Gameplay de 1m30s com Arte Cinematográfica & Dicas Estruturadas:**
    * Imagem em tela cheia sem bordas excessivas preenchendo o container.
    * Prompt original mantido em desfoque no telão, revelando dicas sem quebrar o blur do segredo.
  * **Revelação Dramática Passo a Passo (`REVEALING`):**
    * Apresentação individual com notas separadas em **Sujeito (0–400)**, **Estilo Visual (0–300)**, **Cenário (0–300)** e **Bônus de Velocidade (0–150)**, além do parecer e selo da Mermã IA.
* **📱 Modo Controle Mobile (`/play`):**
  * **Sessão Persistente no Dispositivo (`deviceId` + PostgreSQL 18):** Salva o ID do aparelho para que a participante acumule pontos, partidas, títulos e histórico.
  * **Termômetro de Qualidade em Tempo Real:** Avalia instantaneamente presença de Sujeito, Estilo e Cenário durante a digitação.
  * **Moderação de Nomes Impróprios (PT-BR & EN):** Filtro inteligente anti-palavrões com normalização de acentos e *leetspeak*.
* **🛡️ Rota Administrativa Protegida (`/admin`):**
  * Autenticação via senha protegida por variável de ambiente (`ADMIN_PASSWORD`).
  * Gerenciamento e visualização completa de participantes e botão seguro para limpar o ranking geral.
* **🧠 Avaliador Semântico de Intenção em 3 Camadas:**
  1. **Primário:** **OpenAI GPT (`gpt-4o-mini` / `gpt-4o`)** via Structured JSON.
  2. **Fallback 1:** **Groq (`llama-3.3-70b-versatile`)** via Structured JSON.
  3. **Fallback 2 (Offline/Local):** Avaliador semântico determinístico com dicionário de sinônimos e conceitos.
* **🖼️ Acervo de 30 Desafios Oficiais de IA:**
  * Imagens leves em WebP cobrindo cultura maranhense, mulheres na ciência, pop art, fantasia e tecnologia.

---

## 🚀 Como Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env

# 3. Iniciar Servidor Fastify (porta 3001) + Frontend Vite (porta 5173)
npm run dev
```

* **Hub Principal:** `http://localhost:5173/`
* **Telão da TV:** `http://localhost:5173/tv`
* **Controle Mobile:** `http://localhost:5173/play`
* **Painel Admin:** `http://localhost:5173/admin`

---

## 🐳 Deploy no Coolify v4.7 (Produção)

1. **Subdomínio no Hostinger DNS:**
   * Apontamento tipo `A`: `dprompt.mermasdigitais.com.br` -> IP do servidor Coolify (`189.90.44.226`).
2. **No Projeto Coolify (`mdx26-desafio-prompt`):**
   * Conecte o repositório Git com build pack **Dockerfile**.
   * Configure os domínios: `https://dprompt.mermasdigitais.com.br`
   * Porta exposta: `3001`
   * Variáveis de Ambiente recomendadas:
     * `NODE_ENV=production`
     * `PORT=3001`
     * `HOST=0.0.0.0`
     * `DATABASE_URL=postgres://postgres:...@ardox0curo7ezgdkvrojyadu:5432/mdx26_desafio_prompt` (URL interna do PostgreSQL 18 daquele mesmo projeto)
     * `PUBLIC_APP_URL=https://dprompt.mermasdigitais.com.br`
     * `ADMIN_PASSWORD=mdx2026`
     * `OPENAI_API_KEY=sk-...`
     * `OPENAI_MODEL=gpt-4o-mini`
     * `SPOTIFY_PLAYLIST_URL=https://open.spotify.com/playlist/...`
3. O container compila o Vite SPA para `dist/public`, o servidor TypeScript para `dist/server`, e serve tudo em um único processo Node.js de alta performance com WebSocket e healthcheck integrado.
