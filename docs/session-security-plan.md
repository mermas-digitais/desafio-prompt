# Contas, salas e moderação — contrato de implementação

Atualizado em 2026-11-23: o usuário substituiu o responsável por sala por moderação compartilhada entre todas as contas da organização. Cadastro de usuários e manutenção global continuam exclusivos do administrador.

## Objetivo
Corrigir a auditoria da v1.1.0 sem apagar perfis, partidas ou rankings existentes. Mesmo dispositivo tem perfis independentes por sala. Fechar entradas preserva rodada atual. Cadastro de operadores é feito pelo administrador; não há inscrição pública.

## Papéis
- Admin global: cria operadores, controla qualquer sala, acessa manutenção global e recupera vínculos de perfis legados.
- Moderador: qualquer conta cadastrada da organização pode criar e controlar qualquer sala, após a troca inicial de senha. Não cadastra usuários nem faz manutenção global. Não há atribuição nem transferência de salas.
- Visitante: vê salas/telões, sem controles administrativos.
- Participante: sessão anônima privada por cookie; atua somente no próprio perfil da sala.

## Contrato HTTP
- `GET /api/auth/me` -> `{ok:true,user:StaffUser|null}`.
- `POST /api/auth/login` `{email,password}` -> cookie HttpOnly + `{ok:true,user}`.
- `POST /api/auth/logout` -> revoga cookie/sessão.
- `POST /api/auth/password` `{currentPassword,newPassword}` -> altera hash/revoga sessões anteriores, emite nova sessão.
- `GET /api/users` -> lista de operadores para gestão da equipe; somente admin.
- `POST /api/users` `{name,email,password}` -> somente admin, cria moderador com troca inicial obrigatória.
- `POST /api/player/session` -> cookie privado novo/recuperado + `{ok:true,deviceId}`; não aceita identidade arbitrária do cliente.
- `POST /api/rooms/create` `{roomCode,name}` -> qualquer conta da organização autenticada cria a sala, sem responsável exclusivo.
- `POST /api/rooms/open|close` `{roomCode,name?}` -> qualquer conta da organização autenticada.
- `DELETE /api/rooms/:code?confirm=CODE` -> qualquer conta da organização autenticada, com troca inicial concluída e confirmação exata. Apaga somente a sala e seus perfis, pontos e partidas; não altera equipe ou outras salas.
- Não existe endpoint de transferência; a rota antiga retorna 404.
- Administração de ranking segue endpoints existentes, com cookie de operador e escopo explícito de sala; manutenção global apenas admin.

## Tipos
`StaffUser={id,email,name,role:'admin'|'moderator',mustChangePassword,createdAt}`.
O estado público das salas não inclui responsável. A coluna legada `moderator_id` é mantida no banco por compatibilidade, mas não participa das permissões nem recebe novas atribuições. Não é necessário apagar salas ou jogadores para adotar o novo modelo.
Dados públicos de participantes nunca incluem deviceId, socketId ou rascunhos. Perfil pessoal recuperado por cookie; servidor ignora identidade de payload.

## Persistência
Unicidade de jogador em `(room_code,device_id)`. IDs e totais legados permanecem na sala armazenada; não repartir totais históricos por suposição. Backup antes da migração. Sessões de operadores usam tokens aleatórios armazenados somente como hash, com validade e revogação. Senhas usam scrypt com salt. Admin inicial vem de `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` e troca obrigatória; senha nunca é incorporada em código ou bundle.

## Estados e integridade
Fechar entradas altera somente isOpen. Participantes já vinculados podem terminar/reconectar; nenhuma nova entrada aceita. Reabrir não troca token em rodada vigente. Cancelar/reset é ação distinta autorizada. Cada avaliação valida roundId/geração após awaits; reset e limpeza invalidam trabalho pendente. Kick bloqueia perfil pela rodada. Token obrigatório para nova entrada/envio. Consultar sala inexistente não cria motor. Estados socket sempre segmentados e filtrados por sala no cliente.

### Cancelar uma partida no lobby
O controle **Cancelar partida…** fica ao lado de iniciar com bots, somente para a organização. Exige confirmação e envia `room:cancel-lobby` com `roomCode` e o `roundToken` observado. O servidor exige operador autenticado com troca inicial concluída e recusa token desatualizado ou fase diferente de `LOBBY`. A ação notifica as participantes, esvazia a rodada e volta para `IDLE` com novo QR. Não grava partida/pontos, não apaga perfis/histórico, não altera entradas abertas/fechadas nem outras salas. O QR antigo não permite reentrada; o novo QR permite uma nova tentativa. O reset geral de manutenção continua separado.

### Revelação de palavras durante o jogo
Antes de 60 segundos restantes, nenhuma palavra do prompt é revelada. Aos 60s, no máximo uma palavra da camada de estilo; aos 30s, mais uma de assunto e uma de ambiente, totalizando no máximo três. Não há revelação extra de conectores curtos. A escolha permanece estável durante a rodada; palavras ocultas não são enviadas no estado público. `REVEALING`/`PODIUM` continuam mostrando o prompt completo. Imagens, desfoque, dicas textuais e duração da rodada não foram alterados.

## Migração de identidade anônima
IDs antigos eram públicos, portanto não são prova de posse. Novas sessões privadas não podem reivindicar outro perfil apenas informando deviceId. Preservar dados legados; qualquer recuperação de vínculo legado precisa de verificação administrativa, nunca apropriação automática por ID público.

## Exclusão de salas
MDX26 e a última sala podem ser excluídas. Uma lista intencionalmente vazia permanece vazia após reiniciar; a sala inicial só é criada no primeiro bootstrap de administrador. Healthcheck, configuração, sockets e interface funcionam sem salas. Recriar o código inicia sem os perfis e partidas anteriores.

A inicialização do esquema PostgreSQL também não insere salas. Um seed legado nesse caminho foi identificado no smoke de deploy e removido; `tests/postgres-startup.test.ts` cobre inicialização e reinício com o cliente PostgreSQL simulado, além dos testes de reinício local existentes.

A exclusão é transacional em PostgreSQL; o armazenamento local restaura o estado em memória se a gravação falhar. Registro de participante usa bloqueio compartilhado da linha da sala, enquanto a exclusão usa bloqueio exclusivo: o registro termina antes da limpeza ou falha por sala inexistente. Avaliação, gravação de resultado e edição de sala em andamento impedem exclusão. O motor fica pausado durante a exclusão, volta se houver falha e é descartado no sucesso, sem timer ou broadcasts tardios.

O evento público `room:deleted` informa somente o código, remove os sockets daquele canal e faz telão/celular conectados voltarem ao início. Clientes conectados limpam as chaves v2 de histórico local atribuíveis à sala; chaves legadas mistas não são apagadas por suposição. A exclusão no servidor **não apaga cópias de navegadores offline, imagens baixadas ou backups independentes**. Estes seguem sua própria retenção; restaurar um backup pode trazer dados antigos de volta.

## Validação
Testes unitários e integração em banco temporário: isolamento A/B; usuário/senha/hash/sessão; duas contas distintas controlam a mesma sala em REST e socket; ambas são impedidas de cadastrar usuários e fazer manutenção global; visitante não reseta/inicia bots; payload de identidade não personifica terceiros; fechamento preserva rodada; cancelamento impede avaliação tardia; token obrigatório; expulso não retorna; GET desconhecido não cria sala; produção sem banco falha. UI: controles disponíveis para a organização em todas as salas, sem seletor de responsável; teclado/foco/Escape, confirmação contextual e telas baixas, erros/timeouts.

## Escopo operacional
Implementar e validar localmente. Não publicar, reiniciar produção, migrar banco real ou alterar credenciais remotas sem autorização específica.
