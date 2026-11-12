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
* **🛡️ Contas administrativas e moderação (`/admin`):**
  * Login por e-mail e senha, com hash scrypt, sessão HttpOnly, expiração e troca obrigatória da senha inicial.
  * Administrador cadastra operadores. Cada sala tem um moderador responsável e pode ser transferida para outro operador.
  * Operadores podem visualizar outras salas, mas somente o responsável ou o administrador pode controlá-las.
  * Perfis, pontos e histórico de participantes são independentes por sala.
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
     * `BOOTSTRAP_ADMIN_EMAIL=contatovschneider@gmail.com`
     * `BOOTSTRAP_ADMIN_PASSWORD=<senha inicial configurada fora do Git>`
     * `SESSION_SECRET=<segredo aleatório de pelo menos 32 caracteres>`
     * `OPENAI_API_KEY=sk-...`
     * `OPENAI_MODEL=gpt-4o-mini`
     * `SPOTIFY_PLAYLIST_URL=https://open.spotify.com/playlist/...`
3. O container compila o Vite SPA para `dist/public`, o servidor TypeScript para `dist/server`, e serve tudo em um único processo Node.js de alta performance com WebSocket e healthcheck integrado.

## Contas, segurança e migração

O cadastro de operadores não é público. Na primeira inicialização sem administrador, as variáveis `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_PASSWORD` criam a conta inicial. Depois disso, mudar essas variáveis **não redefine senhas existentes**. A conta inicial precisa trocar a senha antes de administrar; a nova senha deve ter pelo menos 12 caracteres. Operadores cadastrados pelo admin também trocam sua senha inicial.

Em desenvolvimento, `.env.local` pode guardar configuração privada. Ele não entra no Git nem na imagem Docker. Em produção, configure as variáveis no ambiente do serviço; `DATABASE_URL` e `SESSION_SECRET` são obrigatórios. Gere o segredo com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` e mantenha-o estável entre reinícios: trocá-lo invalida as sessões de participantes. Não compartilhe cookies nem copie senhas para arquivos versionados.

**Antes de atualizar produção, faça backup completo do PostgreSQL.** A migração automática troca a unicidade global de dispositivo por `(room_code, device_id)`, mantém IDs/totais existentes e cadastra usuários, sessões e responsáveis. Há cópia de segurança dos jogadores na migração SQL e backup do JSON legado, mas isso não substitui backup externo. Não há redistribuição automática de totais já misturados por versões anteriores; eles permanecem na sala armazenada até revisão administrativa.

As sessões antigas usavam identificadores públicos. Por isso, o navegador recebe agora uma identidade privada por cookie: informar um ID antigo não dá acesso à conta. Para recuperar um perfil legado, o administrador valida a pessoa e usa **Recuperar vínculo** com o código de recuperação mostrado no celular. A operação exige sala ociosa, preserva os pontos e rejeita conflito com outro perfil; não mescla nem apaga contas automaticamente. O histórico local antigo não é apagado nem importado para outra identidade.

**Fechar entradas** oculta o QR Code e bloqueia novas participações, mantendo a rodada atual e reconexões de quem já entrou. Reiniciar/cancelar é outra ação, com confirmação. Manutenção aguarda o término de gravações em andamento. O moderador anterior perde autorização para novos comandos após a transferência.

O arquivo `docs/session-security-plan.md` registra o contrato. Rode `npm test`, `npm run build` e `npx tsc --noEmit` antes de publicar. Os testes usam dados temporários; não apontam para o banco de produção. O mock de módulos usado nos testes do motor exige Node com `--experimental-test-module-mocks` (o script já inclui a opção).
