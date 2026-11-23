# Adequação visual e revisão UI/UX — organização e moderação

## Direção preservada

Identidade Mermãs existente: ameixa, lilás, rosa, fundo claro, Paytone One nos títulos, Poppins no conteúdo, ícones Lucide e ativos oficiais. Sem troca de biblioteca visual. Controles da organização reutilizam os tokens em `src/index.css`; ações principais têm contraste maior e manutenção tem tratamento destrutivo próprio.

## Ajustes entregues

- Organização: login identificado com a plataforma; navegação por Equipe, Ranking e Minha conta. Troca de senha deixa de disputar atenção com cadastro e manutenção. Primeiro acesso continua obrigatório.
- Equipe: lista de pessoas e papel, criação em diálogo com senha temporária e erro junto ao formulário.
- Ranking: seleção explícita de sala, carregamento, estado vazio e manutenção recolhida. Confirmações nomeiam a ação e explicam cancelamento da rodada, escopo e irreversibilidade.
- Moderação: abrir/fechar entradas em destaque; nome e manutenção em divulgação progressiva. Não há responsável nem transferência por sala. Qualquer conta da organização acessa os controles; visitantes continuam somente leitura.
- Diálogos: cabeçalho comum, fechamento nomeado, limite por viewport, rolagem interna, foco circular com Tab/Shift+Tab, Escape e retorno ao acionador.
- Cabeçalho: página inicial e organização não exibem estado de conexão de uma sala que não está sendo acompanhada. Por preferência do usuário, o cabeçalho do telão não tem botão de moderação; o acesso permanece exclusivamente no cartão do QR Code, na tela de espera, inclusive com entradas fechadas.
- Celular: avisos padronizados e recuperação de progresso recolhida, com confirmação de cópia. Ajuda de migração não domina mais o primeiro cadastro.

## Reprodução segura

`npm run test:ui:serve` inicia uma aplicação **isolada**, com JSON temporário e sem PostgreSQL ou provedores de IA, em `http://127.0.0.1:5187` (API em 3017). Não use `npm run dev` para este teste: o `.env` de desenvolvimento pode apontar para produção.

Contas fictícias da fixture: `ui-review@example.test` (admin) e `ana@example.test` (organização, com acesso a todas as salas), senha `review-only-password`. Não são credenciais de produção. Ctrl+C encerra os serviços e remove os dados temporários.

Com a fixture em execução, o Playwright MCP pode executar `browser_run_code_unsafe` com `filename: "tests/organization-ui.browser.mjs"`. O arquivo não instala dependências: usa o navegador do harness e restringe o teste a localhost. Comece sem sessão ou com a sessão do admin fictício.

## Validação no navegador

- Desktop: 1366×768/900; celular: 390×667; janela baixa: 902×482.
- Cadastro de moderador, navegação, seleção do ranking, rótulos e ausência de rolagem horizontal.
- Tab circulando no diálogo, Escape e retorno ao botão original. Conteúdo maior que a janela rola sem perder o fechamento.
- Moderadora: sem gestão de equipe nem manutenção global; acesso aos controles e ao ranking individual de qualquer sala.
- Partida local: fechar entradas preservou `PLAYING` e as cinco posições; remover participante funcionou durante `PLAYING`, sem cancelar as outras quatro posições.

O script de navegador cobre navegação, formulários, foco, tamanhos, escopo do ranking e divulgação progressiva. Os cenários de criação efetiva e moderação em jogo foram exercitados separadamente na fixture. Não substitui auditoria WCAG completa ou teste em Safari/Firefox.

### Simplificação das permissões — 2026-11-23

Por decisão do usuário, a definição de responsável e a transferência foram removidas por completo da interface, da autorização e dos endpoints. O modal não consulta mais a lista de usuários. Toda conta da organização pode controlar todas as salas; criar/listar usuários e manutenção global seguem exclusivos do administrador. A troca inicial de senha continua obrigatória.

O teste de navegador acessa MDX26 e PALCO2 com a mesma conta não administradora, verifica os controles e a seleção de ranking das duas salas, confirma ausência de gestão de equipe e da opção de manutenção global, e confirma ausência de seletor de responsável. Também verifica ausência de moderação no cabeçalho e retorno do foco ao botão no cartão QR.

## Fora deste ajuste

Nenhuma migração, credencial, publicação ou dado de produção alterado. As pendências de backend da revisão anterior (limite de login atrás do proxy e consulta de resultados com entradas fechadas) permanecem separadas deste trabalho visual.

## Exclusão de salas — 2026-11-23

No painel, selecione uma sala em Ranking e use **Excluir sala e dados…**. Moderadores também têm acesso. O diálogo informa escopo e irreversibilidade, exige digitar o código exato e mostra erros sem fechar. Nenhuma ação de exclusão global foi adicionada.

O script de navegador agora exclui MDX26 e PALCO2 como moderadora, verifica confirmação vazia/incorreta, retorno de telão e celular ao início, painel e home sem salas e criação de uma nova MDX26. O cenário usa somente a fixture temporária. Reinicie a fixture antes de repetir: o teste é destrutivo apenas para seus dados fictícios.

Validação: testes automatizados de persistência/rollback, autorização, exclusão da última sala/reinício, bloqueios de avaliação/gravação/edição, retomada após falha, descarte de timer/broadcasts e limpeza isolada de histórico local. SQL usa cliente simulado; concorrência com PostgreSQL real não foi exercitada. TypeScript e build passaram; Vite mantém aviso de bundle maior que 500 kB.
