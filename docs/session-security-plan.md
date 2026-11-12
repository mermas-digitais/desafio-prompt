# Contas, salas e moderação — contrato de implementação

## Objetivo
Corrigir a auditoria da v1.1.0 sem apagar perfis, partidas ou rankings existentes. Mesmo dispositivo tem perfis independentes por sala. Fechar entradas preserva rodada atual. Cadastro de operadores é feito pelo administrador; não há inscrição pública.

## Papéis
- Admin global: cria operadores, acessa manutenção global e pode recuperar a administração das salas.
- Moderador: cria salas, controla somente salas das quais é responsável, pode transferir responsabilidade a outro operador ativo.
- Visitante: vê salas/telões, sem controles administrativos.
- Participante: sessão anônima privada por cookie; atua somente no próprio perfil da sala.

## Contrato HTTP
- `GET /api/auth/me` -> `{ok:true,user:StaffUser|null}`.
- `POST /api/auth/login` `{email,password}` -> cookie HttpOnly + `{ok:true,user}`.
- `POST /api/auth/logout` -> revoga cookie/sessão.
- `POST /api/auth/password` `{currentPassword,newPassword}` -> altera hash/revoga sessões anteriores, emite nova sessão.
- `GET /api/users` -> lista pública de operadores `{id,name,email,role}` para seleção de transferência, exige login.
- `POST /api/users` `{name,email,password}` -> somente admin, cria moderador com troca inicial obrigatória.
- `POST /api/player/session` -> cookie privado novo/recuperado + `{ok:true,deviceId}`; não aceita identidade arbitrária do cliente.
- `POST /api/rooms/create` `{roomCode,name}` -> operador autenticado se torna moderador.
- `POST /api/rooms/open|close` `{roomCode,name?}` -> responsável ou admin.
- `POST /api/rooms/transfer` `{roomCode,moderatorId}` -> responsável ou admin; efeito imediato em REST e socket.
- Administração de ranking segue endpoints existentes, com cookie de operador e escopo explícito de sala; manutenção global apenas admin.

## Tipos
`StaffUser={id,email,name,role:'admin'|'moderator',mustChangePassword,createdAt}`.
Salas incluem `moderatorId:string|null`; cadastro existente sem responsável é atribuído ao admin inicial, sem alterar jogadores.
Dados públicos de participantes nunca incluem deviceId, socketId ou rascunhos. Perfil pessoal recuperado por cookie; servidor ignora identidade de payload.

## Persistência
Unicidade de jogador em `(room_code,device_id)`. IDs e totais legados permanecem na sala armazenada; não repartir totais históricos por suposição. Backup antes da migração. Sessões de operadores usam tokens aleatórios armazenados somente como hash, com validade e revogação. Senhas usam scrypt com salt. Admin inicial vem de `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` e troca obrigatória; senha nunca é incorporada em código ou bundle.

## Estados e integridade
Fechar entradas altera somente isOpen. Participantes já vinculados podem terminar/reconectar; nenhuma nova entrada aceita. Reabrir não troca token em rodada vigente. Cancelar/reset é ação distinta autorizada. Cada avaliação valida roundId/geração após awaits; reset e limpeza invalidam trabalho pendente. Kick bloqueia perfil pela rodada. Token obrigatório para nova entrada/envio. Consultar sala inexistente não cria motor. Estados socket sempre segmentados e filtrados por sala no cliente.

## Migração de identidade anônima
IDs antigos eram públicos, portanto não são prova de posse. Novas sessões privadas não podem reivindicar outro perfil apenas informando deviceId. Preservar dados legados; qualquer recuperação de vínculo legado precisa de verificação administrativa, nunca apropriação automática por ID público.

## Validação
Testes unitários e integração em banco temporário: isolamento A/B; usuário/senha/hash/sessão; moderador alheio recebe 403; transferência revoga poder do anterior; visitante não reseta/inicia bots; payload de identidade não personifica terceiros; fechamento preserva rodada; cancelamento impede avaliação tardia; token obrigatório; expulso não retorna; GET desconhecido não cria sala; produção sem banco falha. UI: teclado/foco/Escape, confirmação contextual e telas baixas, erros/timeouts.

## Escopo operacional
Implementar e validar localmente. Não publicar, reiniciar produção, migrar banco real ou alterar credenciais remotas sem autorização específica.
