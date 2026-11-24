# Imagens e rotação dos desafios

## Estado atual

Catálogo atual: **50 desafios**, todos com **50 imagens WebP (1024×1024)** em `public/challenges/`. Os 50 arquivos têm caminhos próprios; o teste `tests/challenge-catalog.test.ts` verifica arquivo decodificável, IDs/URLs/conteúdo sem duplicatas e dados de avaliação presentes.

Concluído em 2026-11-24:
- Geradas as **20 cenas novas** em `.webp` (1024×1024) e cadastradas em `src/server/db/challengesData.ts` e `src/shared/showcaseData.ts` com prompt completo em português, camadas (`subjectLayer`, `styleLayer`, `environmentLayer`), dicas de 60s e 30s (`hint1`, `hint2`), grupos semânticos com sinônimos e pesos calibrados (`subject`, `style`, `environment`) e palpites de bots (`botPrompts`) coerentes com o que cada imagem exibe.
- Substituídos os 5 arquivos `.svg` (`boto-cor-de-rosa-synthwave`, `panda-quimico-bambu`, `canguru-boxeador-arcade`, `fenix-cristal-vulcao` e `dragao-biblioteca-cha`) por imagens `.webp` 1024×1024 geradas, preservando os IDs originais dos desafios.

## Cenas novas para completar 50

Uma imagem quadrada por cena, sem texto/logos/marca d'água. Variar personagem, ambiente, composição, paleta e técnica. Cada cena precisa depois de prompt em português, três camadas, dicas, sinônimos/pesos e palpites de bot coerentes com o que a imagem realmente mostra.

| ID proposto | Cena | Direção visual |
|---|---|---|
| jacare-astronomo | Jacaré de cachecol violeta observando estrelas por telescópio de latão num observatório sobre manguezal | Aquarela/gouache, índigo, turquesa e dourado |
| tamandua-carteiro | Tamanduá de bolsa vermelha entregando carta a uma casa em ilha flutuante ligada por pontes | Diorama de papel recortado, coral e azul |
| coelho-relojoeiro | Coelho branco de macacão azul consertando relógio dourado na oficina de uma torre | Massinha stop-motion, âmbar e verde-petróleo |
| lontra-engenheira | Lontra de capacete amarelo construindo roda d'água numa vila ecológica com estufas e painéis solares | Ilustração isométrica solarpunk |
| sapo-saxofonista | Sapo de terno vinho tocando saxofone sob poste numa rua chuvosa à noite | Pintura a óleo, reflexos quentes e sombras azuis |
| peixe-balao-confeiteiro | Peixe-balão de chapéu de chef decorando bolo numa confeitaria submarina | Animação 3D, tons pastel e corais |
| caranguejo-ferreiro | Caranguejo com avental forjando espada numa oficina na encosta de um vulcão | Arte voxel, laranja e cinza vulcânico |
| morcego-bibliotecario | Morcego de óculos organizando livros numa biblioteca gótica à luz da lua | Papel recortado em camadas, azul e prata |
| girafa-fotografa | Girafa de chapéu fotografando a savana a bordo de balão de ar quente | Ilustração retrô de viagem, ocre e céu azul |
| zebra-patinadora | Zebra de jaqueta rosa patinando numa pista com globo espelhado | Vaporwave, ciano e magenta |
| cachorro-arqueologo | Cachorro de chapéu explorador escavando um vaso em ruínas no deserto | Cel shading, areia e azul-lápis-lazúli |
| gato-vendedor-planetas | Gato de avental vendendo pequenos planetas luminosos numa banca de feira noturna | Miniatura cinematográfica, azul-noite e âmbar |
| abelha-pilota-dirigivel | Abelha de óculos de aviadora pilotando dirigível sobre uma estufa de flores gigantes | Livro ilustrado, verde e amarelo-mel |
| joaninha-inventora | Joaninha de óculos montando máquina de engrenagens numa oficina entre cogumelos | Fantasia macro steampunk, cobre e vermelho |
| lobo-ceramista | Lobo de avental moldando tigela num ateliê de cerâmica com neve na janela | Nanquim e aquarela, cinza e terracota |
| coala-meteorologista | Coala de capa amarela medindo vento numa estação sobre nuvens | Massinha stop-motion, azul-claro e amarelo |
| iguana-tenista | Iguana de viseira rebatendo bola numa quadra sobre telhado de vidro | História em quadrinhos, verde-lima e azul |
| cavalo-marinho-rei | Cavalo-marinho coroado sentado num trono de coral com peixes ao redor | Vitral, turquesa e dourado |
| esquilo-cartografo | Esquilo desenhando mapa sobre mesa dentro de uma árvore com janelas | Lápis de cor, verde-musgo e castanho |
| borboleta-maestra | Borboleta regendo orquestra de insetos num jardim de flores gigantes | Colagem de papel, lilás e verde |

Substituir os SVG existentes de boto-cor-de-rosa-synthwave, panda-quimico-bambu, canguru-boxeador-arcade, fenix-cristal-vulcao e dragao-biblioteca-cha usando seus prompts já cadastrados. Não remover os SVG antes das novas imagens serem verificadas e os caminhos atualizados.

## Rotação corrigida

Fisher–Yates continua usando `crypto.randomInt(0, i + 1)`, sem sorteio por comparador de `sort` ou viés de módulo. O problema encontrado era o ciclo de vida: inicialização/reset consumia uma carta, e COUNTDOWN consumia outra. Agora a carta é retirada somente ao começar a contagem da partida. IDLE, lobby e cancelamento de lobby não consomem cartas.

Cada ciclo percorre o catálogo inteiro uma vez. As dez últimas cartas ficam em uma janela de exclusão, inclusive na virada do baralho: cartas ainda recentes são adiadas dentro do novo baralho, não descartadas. O controle é por sala. O desafio fica nulo antes da contagem para não expor antecipadamente a imagem que será usada.

Testes cobrem ciclos reais completos, reset/cancelamento sem consumo, janela de dez imagens, independência das salas e distribuição das primeiras posições em 600 ciclos com RNG determinístico. O teste de distribuição detecta regressões grosseiras; não é prova estatística da fonte criptográfica.

Limitação: baralho e janela permanecem em memória; reiniciar o servidor reinicia a sequência e não impede repetir uma imagem de antes do reinício. Salas diferentes podem mostrar a mesma imagem; não há fila global compartilhada.

Sem commit, deploy ou alteração no banco de produção nesta etapa.
