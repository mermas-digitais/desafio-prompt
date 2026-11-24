# Sessões independentes por sala

Implementação local; publicar exige aprovação separada. Nenhuma migração ou alteração em produção foi executada durante a implementação.

## Uso

- `/tv?room=CODIGO` lista as sessões; abrir a sala ou assistir não cria jogo nem ocupa vaga.
- Admins e moderadores, após a troca inicial de senha, podem criar e controlar até **duas sessões ativas por sala**, inclusive usando a mesma conta.
- Cada sessão tem UUID, nome, lobby, participantes, relógio, QR e rodada próprios. O diretório permite encerrá-la com confirmação, inclusive fora do lobby. Encerrar não apaga carreiras nem resultados gravados.
- No diretório, **Assistir** abre `mode=watch`; **Controlar** abre `mode=control` para organização autenticada. Criar sessão já abre controle. URLs antigas ou modo inválido assumem assistir, mesmo com login ativo.
- Dentro da sessão, nome, sala e modo aparecem discretamente no cabeçalho. O próprio texto do modo permite alternar. O telão não exibe uma barra de ações: iniciar/cancelar partida e remover participantes ficam no modal, acessível por “Moderar” no QR/lobby. Modo na URL não substitui autenticação nem concede permissão no servidor.
- Acesso direto ao controle sem login oferece autenticação com retorno à mesma sessão (somente rota local validada). Links de sessão indisponível mostram recuperação para o diretório; encerramento ao vivo retorna com aviso.
- Perfis, pontos, conquistas e histórico são compartilhados **dentro da sala**. Salas distintas continuam isoladas.
- Uma identidade privada de navegador só participa de uma partida no sistema inteiro. Abas compartilham essa identidade; outro navegador/dispositivo pode ter outra. Não há identificação de pessoa entre dispositivos.
- Cancelar lobby ou sair dele libera a participação; desconectar durante jogo não libera imediatamente. A reserva permanece durante avaliação e resultados, até a limpeza da rodada ou encerramento.
- Fechar entradas e cancelar rodada afetam só a sessão selecionada. Renomear a sala é compartilhado. Zerar ranking cancela as rodadas de todas as sessões da sala; manutenção global e contas continuam exclusivas de admin.

## Contratos

QR: `/play?room=CODIGO&session=UUID&round=TOKEN`.

Telão: `/tv?room=CODIGO&session=UUID&mode=watch` ou `mode=control`. O QR de participante nunca herda esse modo.

Links antigos com `round`, mas sem `session`, podem consultar resultados históricos; não ingressam automaticamente em uma sessão. Sem rodada nem sessão, a página mostra o diretório. Um `GET /api/state` sem sessão só resolve quando houver exatamente uma sessão candidata; comandos de jogo exigem `sessionId` explícito.

| Operação | Contrato |
|---|---|
| Listar | `GET /api/sessions?room=CODIGO`, público |
| Criar | `POST /api/sessions`, organização; `{ roomCode, id: UUID, name }` |
| Encerrar | `DELETE /api/sessions/UUID?room=CODIGO&confirm=true`, organização |
| Observar | Socket `room:watch` (sala) ou `room:join-session` (sala + sessão); sem admissão |
| Estado | `GET /api/state?room=CODIGO&session=UUID` |

Repetir criação com mesmo UUID/nome/sala ativa é idempotente; UUID encerrado não ressuscita um jogo. Encerramento durante entrada, avaliação ou gravação é recusado: aguardar e atualizar antes de tentar novamente.

## Persistência e concorrência

- `game_sessions`: metadados e estado `active`, `ended` ou `interrupted`.
- `active_participations`: unicidade global de `device_id` e `profile_id`, vinculada a sessão/rodada. Liberações conferem ID da reserva, sessão e token para não apagar uma admissão mais nova.
- `matches.session_id`: UUID **nullable**, preservando partidas históricas. Carreiras existentes não são unidas nem recriadas.
- `RoomManager` mantém metadados por sala e `GameEngine` por sessão. Estado via `session:UUID`; ranking compartilhado via `room:CODIGO`.
- Baralho por sala evita reutilizar a imagem exibida simultaneamente pela outra TV.
- `commitRound` mantém transação e bloqueio da sala para resultados simultâneos; cliente rejeita estado atrasado de outra sessão, mesmo na mesma sala.

## Publicação: parar antes de iniciar

**Não usar rolling deploy com sobreposição, múltiplas réplicas nem cluster de workers.** O runtime usa uma conexão PostgreSQL dedicada com advisory lock `(7140, 1)`. Outro runtime recusa iniciar. Perda dessa conexão desativa os engines e faz `/api/health` responder 503; reiniciar o serviço após investigar a conexão.

1. Agendar janela sem partidas; conferir backup PostgreSQL e configuração do deploy com **um único worker**.
2. Parar a versão antiga por completo. A versão antiga não conhece esse lock; só iniciar a nova depois que ela parar.
3. Iniciar a nova versão. `AppDatabase.init()` aplica DDL aditiva (`IF NOT EXISTS`); depois o runtime obtém o lock, marca sessões antigas como interrompidas e limpa reservas antigas.
4. Conferir health, perfis/ranking históricos, diretório vazio e criação autenticada de duas sessões. Validar assistir público e bloqueio de participação entre TVs.
5. Restart interrompe jogos em memória; não retoma relógios. Perfis e partidas já gravadas sobrevivem. Criar sessões novas e usar QRs novos.

Rollback também exige parar primeiro. As tabelas/coluna aditivas podem permanecer; não removê-las para voltar versão. A versão anterior não oferece isolamento de sessões nem exclusividade global; não apontar TVs para URLs de sessões antigas. Nunca restaurar uma versão anterior ao isolamento de perfis por sala.

## Validação local segura

O `.env` normal pode apontar para produção. **Não usar `npm run dev` para estes testes.**

```sh
npm test
npx tsc --noEmit
npm run build
git diff --check
npm run test:ui:serve
```

Fixture UI: `http://127.0.0.1:5187`, API 3017, JSON temporário e sem chamadas a provedores de IA. Executar os arquivos `tests/session-modes.browser.mjs`, `tests/multi-session.browser.mjs`, `tests/lobby-cancellation.browser.mjs` e `tests/organization-ui.browser.mjs` pelo Playwright MCP (`browser_run_code_unsafe`, parâmetro `filename`); usar fixture nova para cenários destrutivos/repetições.

Teste PostgreSQL é opcional na suíte normal e roda separado com binários externos ao projeto:

```sh
npm install --prefix <diretorio-temporario-de-ferramentas> --no-save embedded-postgres@18.6.0-beta.19
node tests/run-postgres-sessions.mjs <diretorio-temporario-de-ferramentas>
```

O runner cria banco descartável loopback, senha aleatória e encerra PostgreSQL ao terminar. O teste recusa hosts externos e nomes fora de `desafio_session_test_*`. Não adicionar essas ferramentas às dependências do aplicativo nem fornecer URL de produção.

Cobertura: concorrência entre reservas, liberação cercada por token, duas TVs, espectadores, identidade entre abas/salas, resultados simultâneos e idempotentes, restart, falhas de persistência local, indisponibilidade do runtime e estado atrasado de sessão.

Limites ainda não medidos: carga real em provedores de IA e em TVs físicas. A avaliação conserva o `Promise.all` por rodada; duas sessões podem somar até dez avaliações concorrentes por sala, além das demais salas. Não há limitador global novo; verificar quotas/latência antes do evento. O aviso Vite de bundle acima de 500 kB continua existente.
