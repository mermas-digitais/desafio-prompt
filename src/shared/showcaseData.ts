export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  samplePrompt: string;
}

export const ARENA_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'boi-cyberpunk',
    title: 'Boi de Bumbá Cyberpunk',
    category: 'Cultura Maranhense & Sci-Fi',
    imageUrl: '/challenges/boi-cyberpunk.webp',
    samplePrompt:
      'Boi de Bumbá maranhense estilizado em estética cyberpunk neon com bordados holográficos dourados em São Luís do futuro',
  },
  {
    id: 'cientista-espacial',
    title: 'Mermã Cientista em Órbita',
    category: 'Mulheres na Ciência',
    imageUrl: '/challenges/cientista-espacial.webp',
    samplePrompt:
      'Jovem cientista negra brasileira flutuando em estação espacial com hologramas de DNA roxos e dourados ao redor',
  },
  {
    id: 'capivara-dj',
    title: 'Capivara DJ no Festival',
    category: 'Pop Art & Música',
    imageUrl: '/challenges/capivara-dj.webp',
    samplePrompt:
      'Capivara fofa usando fones de ouvido gigantes de neon e óculos de estrela tocando em mesa de DJ sob chuva de confetes',
  },
  {
    id: 'robo-skatista',
    title: 'Robô Skatista Solar',
    category: 'Robótica & Esporte',
    imageUrl: '/challenges/robo-skatista.webp',
    samplePrompt:
      'Robô amigável branco e roxo fazendo manobra radical de skate voador com rastro de faíscas douradas no pôr do sol',
  },
  {
    id: 'gato-alquimista',
    title: 'Gato Alquimista Digital',
    category: 'Fantasia & Magia',
    imageUrl: '/challenges/gato-alquimista.webp',
    samplePrompt:
      'Gato místico usando chapéu de mago preparando poções brilhantes rosas e amarelas em laboratório mágico com livros flutuando',
  },
  {
    id: 'astronauta-cafe',
    title: 'Café Expresso na Lua',
    category: 'Surrealismo Espacial',
    imageUrl: '/challenges/astronauta-cafe.webp',
    samplePrompt:
      'Astronauta relaxado sentado em cadeira de praia na cratera da Lua tomando café expresso com nebulosa colorida no céu',
  },
  {
    id: 'sereia-holografica',
    title: 'Sereia Programadora Subaquática',
    category: 'Oceano & Código',
    imageUrl: '/challenges/sereia-holografica.webp',
    samplePrompt:
      'Sereia cibernética programando em telas holográficas flutuantes no fundo de um recife de corais bioluminescente roxo e rosa',
  },
  {
    id: 'dragao-origami',
    title: 'Dragão de Origami na Biblioteca',
    category: 'Arte & Papel',
    imageUrl: '/challenges/dragao-origami.webp',
    samplePrompt:
      'Dragão majestoso dobrado em papel de origami colorido ganhando vida entre estantes de uma biblioteca mágica iluminada',
  },
  {
    id: 'banda-forro-robo',
    title: 'Trio Robô de Forró Neon',
    category: 'Cultura Nordestina & Robótica',
    imageUrl: '/challenges/banda-forro-robo.webp',
    samplePrompt:
      'Três robôs carismáticos tocando sanfona, zabumba e triângulo de luz neon sob bandeirinhas coloridas de São João futurista',
  },
  {
    id: 'coruja-professora',
    title: 'Coruja Cientista das Galáxias',
    category: 'Ciência & Química',
    imageUrl: '/challenges/coruja-professora.webp',
    samplePrompt:
      'Coruja sábia de óculos redondos e jaleco branco misturando galáxias brilhantes dentro de tubos de ensaio em laboratório STEAM',
  },
  {
    id: 'onca-neon',
    title: 'Onça-Pintada Cibernética',
    category: 'Biodiversidade & Tech',
    imageUrl: '/challenges/onca-neon.webp',
    samplePrompt:
      'Onça-pintada majestosa com manchas de circuitos luminosos dourados e roxos caminhando em floresta tropical bioluminescente',
  },
  {
    id: 'trem-lencois',
    title: 'Expresso Solar nos Lençóis Maranhenses',
    category: 'Maranhão do Futuro',
    imageUrl: '/challenges/trem-lencois.webp',
    samplePrompt:
      'Trem futurista de levitação magnética branco e dourado deslizando sobre as dunas e lagoas cristalinas dos Lençóis Maranhenses',
  },
  {
    id: 'arara-dj-carnaval',
    title: 'Arara-Azul DJ no Trio Elétrico Futurista',
    category: 'Brasilidades & Música',
    imageUrl: '/challenges/arara_dj_carnaval.webp',
    samplePrompt:
      'Arara-azul cibernética de óculos espelhados e fones neon tocando em mesa de DJ flutuante sobre trio elétrico futurista',
  },
  {
    id: 'guaxinim-chef-sushi',
    title: 'Guaxinim Mestre Cuca em Tóquio Cyberpunk',
    category: 'Gastronomia & Sci-Fi',
    imageUrl: '/challenges/guaxinim_chef_sushi.webp',
    samplePrompt:
      'Guaxinim fofo vestido de chef japonês preparando sushis brilhantes e ramen fumegante em barraca de rua cyberpunk sob chuva fina',
  },
  {
    id: 'tartaruga-ilha-biblioteca',
    title: 'Tartaruga Celeste da Biblioteca Astral',
    category: 'Fantasia & Conhecimento',
    imageUrl: '/challenges/tartaruga_ilha_biblioteca.webp',
    samplePrompt:
      'Tartaruga marinha gigante nadando entre as nuvens do pôr do sol carregando uma biblioteca mágica e observatório no casco',
  },
  {
    id: 'preguica-gamer-espaco',
    title: 'Preguiça Streamer na Estação Espacial',
    category: 'Games & Espaço',
    imageUrl: '/challenges/preguica_gamer_espaco.webp',
    samplePrompt:
      'Bicho-preguiça carismático com headset gamer RGB jogando em gravidade zero cercado por monitores holográficos e fatias de pizza',
  },
  {
    id: 'caravela-voadora-sao-luis',
    title: 'Galeão Solar sobre os Azulejos de São Luís',
    category: 'Maranhão & Solarpunk',
    imageUrl: '/challenges/caravela_voadora_sao_luis.webp',
    samplePrompt:
      'Galeão histórico voador com velas solares douradas sobrevoando os casarões coloniais e fachadas de azulejos de São Luís',
  },
  {
    id: 'polvo-maestro-orquestra',
    title: 'Polvo Maestro da Sinfonia Bioluminescente',
    category: 'Oceano & Música',
    imageUrl: '/challenges/polvo_maestro_orquestra.webp',
    samplePrompt:
      'Polvo elegante de fraque regendo uma orquestra subaquática com oito batutas luminosas e instrumentos de corais brilhantes',
  },
  {
    id: 'lhama-astronauta-andes',
    title: 'Lhama Astronauta nos Andes Cósmicos',
    category: 'América Latina & Espaço',
    imageUrl: '/challenges/lhama_astronauta_andes.webp',
    samplePrompt:
      'Lhama simpática em traje espacial com poncho andino holográfico tirando selfie no topo da montanha sob aurora boreal e planetas',
  },
  {
    id: 'raposa-relojoeira-steampunk',
    title: 'Raposa Relojoeira do Tempo Quântico',
    category: 'Steampunk & Invenções',
    imageUrl: '/challenges/raposa_relojoeira_steampunk.webp',
    samplePrompt:
      'Raposa inteligente de monóculo e colete vitoriano ajustando engrenagens douradas flutuantes de um relógio astronômico steampunk',
  },
  {
    id: 'boto-cor-de-rosa-synthwave',
    title: 'Boto-Cor-de-Rosa no Rio Synthwave',
    category: 'Amazônia & Retrô-Futurismo',
    imageUrl: '/challenges/boto_cor_de_rosa_synthwave.webp',
    samplePrompt:
      'Boto-cor-de-rosa cibernético usando chapéu neon saltando de um rio amazônico espelhado diante de um sol synthwave roxo e dourado',
  },
  {
    id: 'panda-quimico-bambu',
    title: 'Panda Cientista no Laboratório de Bambu',
    category: 'Ciência & Natureza',
    imageUrl: '/challenges/panda_quimico_bambu.webp',
    samplePrompt:
      'Urso panda fofo de jaleco branco e óculos fazendo experimento químico que solta nuvens de estrelas coloridas entre bambus',
  },
  {
    id: 'canguru-boxeador-arcade',
    title: 'Canguru Campeão no Ringue Arcade',
    category: 'Esporte & Fliperama',
    imageUrl: '/challenges/canguru_boxeador_arcade.webp',
    samplePrompt:
      'Canguru atlético com luvas de boxe elétricas azuis e jaqueta brilhante em ringue futurista cercado por placares holográficos',
  },
  {
    id: 'fenix-cristal-vulcao',
    title: 'Fênix de Cristal sobre o Vulcão de Ametista',
    category: 'Mitologia & Fantasia Épica',
    imageUrl: '/challenges/fenix_cristal_vulcao.webp',
    samplePrompt:
      'Fênix majestosa feita de cristais translúcidos roxos, rosas e dourados abrindo as asas sobre a cratera de um vulcão de ametista',
  },
  {
    id: 'tucano-pintor-aquarela',
    title: 'Tucano Artista no Ateliê das Nuvens',
    category: 'Brasilidades & Belas Artes',
    imageUrl: '/challenges/tucano_pintor_aquarela.webp',
    samplePrompt:
      'Tucano brasileiro de boina e avental colorido pintando o pôr do sol em um cavalete sobre varanda flutuante nas nuvens',
  },
  {
    id: 'hamster-piloto-mecha',
    title: 'Hamster Piloto de Mecha Gigante',
    category: 'Anime & Robótica',
    imageUrl: '/challenges/hamster_piloto_mecha.webp',
    samplePrompt:
      'Pequeno hamster corajoso pilotando controles duplos na cabine iluminada de um robô mecha gigante rosa e roxo com radares',
  },
  {
    id: 'camaleao-grafiteiro-neon',
    title: 'Camaleão Grafiteiro no Beco Cyberpunk',
    category: 'Arte Urbana & Animação',
    imageUrl: '/challenges/camaleao_grafiteiro_neon.webp',
    samplePrompt:
      'Camaleão multicolorido segurando latas de spray e pintando um mural de grafite holográfico num beco futurista estilo Spider-Verse',
  },
  {
    id: 'pinguim-surfista-aurora',
    title: 'Pinguim Surfista na Onda de Aurora Boreal',
    category: 'Esporte & Natureza Mágica',
    imageUrl: '/challenges/pinguim_surfista_aurora.webp',
    samplePrompt:
      'Pinguim radical de óculos espelhados surfando em prancha de gelo sobre onda gigante feita de luzes de aurora boreal',
  },
  {
    id: 'elefante-jardineiro-espacial',
    title: 'Elefante Botânico no Domo de Marte',
    category: 'Ecologia Espacial & Solarpunk',
    imageUrl: '/challenges/elefante_jardineiro_espacial.webp',
    samplePrompt:
      'Pequeno elefante em traje espacial regando flores bioluminescentes gigantes com a tromba num domo geodésico em Marte',
  },
  {
    id: 'dragao-biblioteca-cha',
    title: 'Dragãozinho Leitor na Casa de Chá Mágica',
    category: 'Fantasia Aconchegante & Leitura',
    imageUrl: '/challenges/dragao_biblioteca_cha.webp',
    samplePrompt:
      'Pequeno dragão verde de óculos redondos lendo um livro na poltrona enquanto aquece uma chaleira de chá com sopro de fogo',
  },
  {
    id: 'jacare-astronomo',
    title: 'Jacaré Astrônomo no Manguezal',
    category: 'Astronomia & Biodiversidade',
    imageUrl: '/challenges/jacare-astronomo.webp',
    samplePrompt:
      'Jacaré simpático de cachecol violeta observando estrelas por um telescópio de latão dourado num observatório sobre o manguezal',
  },
  {
    id: 'tamandua-carteiro',
    title: 'Tamanduá Carteiro nas Ilhas Flutuantes',
    category: 'Aventura & Papel Recortado',
    imageUrl: '/challenges/tamandua-carteiro.webp',
    samplePrompt:
      'Tamanduá de bolsa vermelha entregando carta numa casinha em ilha flutuante ligada por pontes de corda em diorama de papel',
  },
  {
    id: 'coelho-relojoeiro',
    title: 'Coelho Relojoeiro na Torre de Massinha',
    category: 'Stop-Motion & Ofícios',
    imageUrl: '/challenges/coelho-relojoeiro.webp',
    samplePrompt:
      'Coelho branco de macacão azul diante de um relógio dourado iluminado na oficina de uma torre em estilo massinha stop-motion',
  },
  {
    id: 'lontra-engenheira',
    title: 'Lontra Engenheira na Vila Solarpunk',
    category: 'Sustentabilidade & Engenharia',
    imageUrl: '/challenges/lontra-engenheira.webp',
    samplePrompt:
      'Lontra de capacete amarelo construindo roda d’água de madeira numa vila ecológica com estufas de vidro e painéis solares',
  },
  {
    id: 'sapo-saxofonista',
    title: 'Sapo Saxofonista na Noite de Jazz',
    category: 'Música & Belas Artes',
    imageUrl: '/challenges/sapo-saxofonista.webp',
    samplePrompt:
      'Sapo elegante de terno vinho tocando saxofone dourado sob um poste antigo numa rua de paralelepípedos chuvosa à noite',
  },
  {
    id: 'peixe-balao-confeiteiro',
    title: 'Peixe-Balão Confeiteiro Submarino',
    category: 'Gastronomia & Fundo do Mar',
    imageUrl: '/challenges/peixe-balao-confeiteiro.webp',
    samplePrompt:
      'Peixe-balão fofo de chapéu branco de chef decorando um bolo de dois andares numa confeitaria submarina cercada por corais',
  },
  {
    id: 'caranguejo-ferreiro',
    title: 'Caranguejo Ferreiro na Forja do Vulcão',
    category: 'Games & Arte Voxel',
    imageUrl: '/challenges/caranguejo-ferreiro.webp',
    samplePrompt:
      'Caranguejo vermelho de avental forjando uma espada dourada incandescente na bigorna em uma oficina voxel na encosta de um vulcão',
  },
  {
    id: 'morcego-bibliotecario',
    title: 'Morcego Bibliotecário ao Luar Gótico',
    category: 'Literatura & Arte em Papel',
    imageUrl: '/challenges/morcego-bibliotecario.webp',
    samplePrompt:
      'Morcego simpático de óculos organizando livros numa biblioteca gótica sob a luz da lua cheia em papel recortado em camadas',
  },
  {
    id: 'girafa-fotografa',
    title: 'Girafa Fotógrafa no Passeio de Balão',
    category: 'Viagem & Ilustração Retrô',
    imageUrl: '/challenges/girafa-fotografa.webp',
    samplePrompt:
      'Girafa de chapéu de palha fotografando a savana dourada ao lado de um balão de ar quente colorido em ilustração retrô',
  },
  {
    id: 'zebra-patinadora',
    title: 'Zebra Patinadora na Pista Vaporwave',
    category: 'Esporte & Estética Retrô',
    imageUrl: '/challenges/zebra-patinadora.webp',
    samplePrompt:
      'Zebra estilosa de jaqueta rosa choque e patins deslizando numa pista neon espelhada sob um globo de discoteca vaporwave',
  },
  {
    id: 'cachorro-arqueologo',
    title: 'Cachorro Arqueólogo nas Ruínas do Deserto',
    category: 'História & Quadrinhos',
    imageUrl: '/challenges/cachorro-arqueologo.webp',
    samplePrompt:
      'Cachorro sorridente de chapéu de explorador limpando um vaso antigo decorado em azul entre colunas de ruínas no deserto',
  },
  {
    id: 'gato-vendedor-planetas',
    title: 'Gato Mercador de Planetas na Feira Noturna',
    category: 'Fantasia & Miniatura',
    imageUrl: '/challenges/gato-vendedor-planetas.webp',
    samplePrompt:
      'Gatinho laranja de avental vendendo pequenos planetas luminosos numa banca de feira noturna iluminada por varal de lâmpadas',
  },
  {
    id: 'abelha-pilota-dirigivel',
    title: 'Abelha Aviadora sobre a Estufa Gigante',
    category: 'Natureza & Aviação',
    imageUrl: '/challenges/abelha-pilota-dirigivel.webp',
    samplePrompt:
      'Abelha fofa de óculos de aviadora pilotando um pequeno dirigível de madeira sobre flores gigantes dentro de uma estufa de vidro',
  },
  {
    id: 'joaninha-inventora',
    title: 'Joaninha Inventora na Oficina de Cogumelos',
    category: 'Macro Fantasia & Steampunk',
    imageUrl: '/challenges/joaninha-inventora.webp',
    samplePrompt:
      'Joaninha vermelha usando lupa de latão montando uma máquina de engrenagens douradas numa oficina miniatura entre cogumelos',
  },
  {
    id: 'lobo-ceramista',
    title: 'Lobo Ceramista no Ateliê de Inverno',
    category: 'Artesanato & Aquarela',
    imageUrl: '/challenges/lobo-ceramista.webp',
    samplePrompt:
      'Lobo cinzento amigável de avental moldando uma tigela de argila terracota no torno giratório em um ateliê de cerâmica',
  },
  {
    id: 'coala-meteorologista',
    title: 'Coala Meteorologista na Estação das Nuvens',
    category: 'Clima & Stop-Motion',
    imageUrl: '/challenges/coala-meteorologista.webp',
    samplePrompt:
      'Coala fofo de capa de chuva amarela segurando medidor de vento numa estação meteorológica sobre as nuvens em stop-motion',
  },
  {
    id: 'iguana-tenista',
    title: 'Iguana Tenista no Terraço da Cidade',
    category: 'Esporte & Quadrinhos',
    imageUrl: '/challenges/iguana-tenista.webp',
    samplePrompt:
      'Iguana verde atlética de viseira rebatendo uma bola de tênis amarela numa quadra azul no terraço de um prédio em estilo HQ',
  },
  {
    id: 'cavalo-marinho-rei',
    title: 'Rei Cavalo-Marinho em Vitral Submarino',
    category: 'Fundo do Mar & Vitral',
    imageUrl: '/challenges/cavalo-marinho-rei.webp',
    samplePrompt:
      'Cavalo-marinho dourado coroado sentado num trono de corais cercado por peixes em estilo vitral colorido turquesa e dourado',
  },
  {
    id: 'esquilo-cartografo',
    title: 'Esquilo Cartógrafo na Casa da Árvore',
    category: 'Aventura & Lápis de Cor',
    imageUrl: '/challenges/esquilo-cartografo.webp',
    samplePrompt:
      'Esquilo ruivo desenhando um mapa sobre uma mesa dentro do tronco de uma árvore com janelas redondas e estantes de livros',
  },
  {
    id: 'borboleta-maestra',
    title: 'Borboleta Maestra e a Orquestra do Jardim',
    category: 'Música & Colagem de Papel',
    imageUrl: '/challenges/borboleta-maestra.webp',
    samplePrompt:
      'Borboleta roxa e verde com uma orquestra de insetos músicos tocando instrumentos num jardim de flores gigantes em colagem de papel',
  },
  {
    "id": "flamingo-bailarino-vitral",
    "title": "Flamingo Bailarino em Vitral de Lótus",
    "category": "Dança & Vitral",
    "imageUrl": "/challenges/flamingo-bailarino-vitral.webp",
    "samplePrompt": "Um flamingo cor-de-rosa usando coroa dourada dançando em um lago cercado por flores de lótus rosas em estilo vitral colorido azul e magenta"
  },
  {
    "id": "urso-polar-sorveteiro",
    "title": "Urso Polar Sorveteiro sob a Aurora Boreal",
    "category": "Gastronomia & Ártico",
    "imageUrl": "/challenges/urso-polar-sorveteiro.webp",
    "samplePrompt": "Um urso polar fofo de gravata-borboleta vendendo casquinhas de sorvete coloridas num carrinho sobre o gelo do Ártico com aurora boreal no céu, animação 3D Pixar"
  },
  {
    "id": "macaco-barista-selva",
    "title": "Macaco Barista na Cafeteria da Floresta",
    "category": "Gastronomia & Natureza",
    "imageUrl": "/challenges/macaco-barista-selva.webp",
    "samplePrompt": "Um macaco simpático de avental verde preparando café numa máquina de expresso de cobre em uma cafeteria na floresta iluminada por lâmpadas penduradas, ilustração digital"
  },
  {
    "id": "canguru-baterista-festival",
    "title": "Canguru Baterista no Festival do Parque",
    "category": "Música & Animação 3D",
    "imageUrl": "/challenges/canguru-baterista-festival.webp",
    "samplePrompt": "Um canguru fofo usando fones de ouvido tocando uma bateria colorida com baquetas num parque ensolarado com lanternas amarelas nas árvores, animação 3D Pixar"
  },
  {
    "id": "hipopotamo-submarino-steampunk",
    "title": "Hipopótamo Capitão no Submarino Steampunk",
    "category": "Aventura & Steampunk",
    "imageUrl": "/challenges/hipopotamo-submarino-steampunk.webp",
    "samplePrompt": "Um hipopótamo simpático usando quepe de capitão pilotando um submarino amarelo e cobre estilo steampunk no fundo do mar cercado por corais, ilustração 3D"
  },
  {
    "id": "suricato-detetive-londres",
    "title": "Suricato Detetive na Rua de Paralelepípedos",
    "category": "Mistério & Aquarela",
    "imageUrl": "/challenges/suricato-detetive-londres.webp",
    "samplePrompt": "Um suricato vestido de detetive com chapéu xadrez e sobretudo segurando uma lupa para examinar pegadas numa rua de paralelepípedos sob um lampião, ilustração em aquarela"
  },
  {
    "id": "ornitorrinco-lutier-violino",
    "title": "Ornitorrinco Lutier na Oficina de Violinos",
    "category": "Música & Ofícios",
    "imageUrl": "/challenges/ornitorrinco-lutier-violino.webp",
    "samplePrompt": "Um ornitorrinco simpático de óculos e avental trabalhando em um violino de madeira sobre a bancada de uma oficina cheia de instrumentos pendurados, pintura digital quente"
  },
  {
    "id": "pelicano-faroleiro-tempestade",
    "title": "Pelicano Faroleiro no Pôr do Sol Marítimo",
    "category": "Oceano & Pintura a Guache",
    "imageUrl": "/challenges/pelicano-faroleiro-tempestade.webp",
    "samplePrompt": "Um pelicano de capa amarela de marinheiro e quepe acendendo a lanterna brilhante no topo de um farol vermelho e branco sobre as ondas do mar ao pôr do sol, pintura em guache"
  },
  {
    "id": "castor-arquiteto-ponte",
    "title": "Castor Arquiteto na Ponte da Montanha",
    "category": "Engenharia & Ilustração 3D",
    "imageUrl": "/challenges/castor-arquiteto-ponte.webp",
    "samplePrompt": "Um castor fofo de capacete azul e óculos segurando plantas de arquitetura sobre uma ponte de madeira acima de um rio com pinheiros, ilustração 3D cartoon"
  },
  {
    "id": "foca-malabarista-circo",
    "title": "Foca Malabarista de Planetas no Circo Estelar",
    "category": "Circo & Ilustração Vintage",
    "imageUrl": "/challenges/foca-malabarista-circo.webp",
    "samplePrompt": "Uma foca simpática com gola de circo equilibrando pequenos planetas luminosos no focinho dentro de uma tenda azul estrelada com holofotes dourados, ilustração vintage"
  },
  {
    "id": "texugo-relojoeiro-cuco",
    "title": "Texugo Artesão e o Relógio Cuco Alpino",
    "category": "Artesanato & Aquarela",
    "imageUrl": "/challenges/texugo-relojoeiro-cuco.webp",
    "samplePrompt": "Um texugo simpático usando colete e monóculo pintando um relógio cuco de madeira com passarinho dentro de uma cabana alpina, ilustração em lápis de cor e aquarela"
  },
  {
    "id": "alce-carteiro-treno",
    "title": "Alce Carteiro no Trenó da Floresta Nevada",
    "category": "Inverno & Guache",
    "imageUrl": "/challenges/alce-carteiro-treno.webp",
    "samplePrompt": "Um alce simpático vestindo suéter vermelho e cachecol conduzindo um trenó de madeira cheio de presentes coloridos pela floresta de pinheiros na neve, ilustração em guache"
  },
  {
    "id": "porco-espinho-tricoteiro",
    "title": "Porco-Espinho Tricoteiro na Poltrona de Balanço",
    "category": "Aconchego & Stop-Motion",
    "imageUrl": "/challenges/porco-espinho-tricoteiro.webp",
    "samplePrompt": "Um porco-espinho fofo de óculos redondos sentado numa cadeira de balanço tricotando um cachecol colorido de arco-íris perto da lareira com novelos de lã, estilo massinha stop-motion"
  },
  {
    "id": "cisne-harpista-nuvens",
    "title": "Cisne Harpista no Pavilhão das Nuvens",
    "category": "Música & Fantasia",
    "imageUrl": "/challenges/cisne-harpista-nuvens.webp",
    "samplePrompt": "Um cisne branco elegante usando coroa dourada tocando uma harpa de ouro num pavilhão de mármore flutuando entre nuvens cor-de-rosa, pintura digital de fantasia"
  },
  {
    "id": "tatu-minerador-cristais",
    "title": "Tatu Minerador na Caverna de Cristais",
    "category": "Aventura & Animação 3D",
    "imageUrl": "/challenges/tatu-minerador-cristais.webp",
    "samplePrompt": "Um tatu fofo usando capacete de minerador com lanterna empurrando um carrinho cheio de cristais brilhantes turquesa e rosa dentro de uma caverna, animação 3D Pixar"
  },
  {
    "id": "lagosta-maestra-culinaria",
    "title": "Lagosta Chef na Cozinha Mediterrânea",
    "category": "Gastronomia & Ilustração 2D",
    "imageUrl": "/challenges/lagosta-maestra-culinaria.webp",
    "samplePrompt": "Uma lagosta vermelha alegre usando chapéu branco de chef salteando legumes numa frigideira de cobre dentro de uma cozinha com azulejos azuis, ilustração cel shading"
  },
  {
    "id": "baleia-dirigivel-nuvens",
    "title": "Baleia-Dirigível sobre a Cidade Costeira",
    "category": "Fantasia & Steampunk",
    "imageUrl": "/challenges/baleia-dirigivel-nuvens.webp",
    "samplePrompt": "Uma baleia-azul gigante com cabine de madeira e hélices de latão como um dirigível voando entre nuvens douradas do pôr do sol sobre uma cidade costeira, pintura de fantasia steampunk"
  },
  {
    "id": "flamingo-fotografo-retro",
    "title": "Flamingo Fotógrafo no Calçadão Synthwave",
    "category": "Retrô & Vaporwave",
    "imageUrl": "/challenges/flamingo-fotografo-retro.webp",
    "samplePrompt": "Um flamingo rosa estiloso de óculos de sol e camisa tropical segurando uma câmera retrô num calçadão de praia com palmeiras ao pôr do sol, estilo synthwave anos 80"
  },
  {
    "id": "lemure-astronomo-baoba",
    "title": "Lêmure Astrônomo na Copa do Baobá",
    "category": "Astronomia & Fantasia",
    "imageUrl": "/challenges/lemure-astronomo-baoba.webp",
    "samplePrompt": "Um lêmure de cauda listrada usando uma capa estrelada observando uma esfera astronômica dourada em uma plataforma no alto de uma grande árvore sob um céu de galáxias, ilustração digital"
  },
  {
    "id": "quati-botanico-orquideas",
    "title": "Quati Botânico no Jardim de Orquídeas",
    "category": "Ciência & Aquarela Botânica",
    "imageUrl": "/challenges/quati-botanico-orquideas.webp",
    "samplePrompt": "Um quati curioso usando lupa e colete anotando em um caderno enquanto examina uma orquídea roxa brilhante dentro de uma estufa de vidro cheia de plantas, ilustração em aquarela"
  },
  {
    "id": "mico-leao-violinista",
    "title": "Mico-Leão-Dourado Violinista na Mata Atlântica",
    "category": "Brasilidades & Música",
    "imageUrl": "/challenges/mico-leao-violinista.webp",
    "samplePrompt": "Um mico-leão-dourado vestindo casaco verde tocando violino sobre um galho de árvore com flores e vaga-lumes brilhantes na floresta, pintura de livro ilustrado"
  },
  {
    "id": "jabuti-relojoeiro-solar",
    "title": "Jabuti Sábio e o Relógio de Sol",
    "category": "Ciência & Ilustração Solar",
    "imageUrl": "/challenges/jabuti-relojoeiro-solar.webp",
    "samplePrompt": "Um jabuti sábio de óculos ajustando um relógio de sol dourado em um pátio ensolarado com vasos de terracota e fontes, ilustração colorida"
  },
  {
    "id": "ariranha-canoista-cristal",
    "title": "Ariranha Canoísta no Rio das Lanternas",
    "category": "Brasilidades & Aventura 3D",
    "imageUrl": "/challenges/ariranha-canoista-cristal.webp",
    "samplePrompt": "Uma ariranha alegre com faixa na cabeça remando uma canoa de madeira cheia de lanternas iluminadas em um rio cristalino na floresta com cachoeiras, animação 3D"
  },
  {
    "id": "seriema-carteira-sertao",
    "title": "Seriema Mensageira em Xilogravura de Cordel",
    "category": "Cultura Nordestina & Cordel",
    "imageUrl": "/challenges/seriema-carteira-sertao.webp",
    "samplePrompt": "Uma ave seriema de chapéu e bolsa de carteiro correndo por uma trilha entre cactos e um catavento sob o sol, estilo xilogravura de cordel colorida"
  },
  {
    "id": "jaguatirica-pianista-jazz",
    "title": "Jaguatirica Pianista no Clube de Jazz",
    "category": "Música & Pintura a Guache",
    "imageUrl": "/challenges/jaguatirica-pianista-jazz.webp",
    "samplePrompt": "Uma jaguatirica elegante usando gravata-borboleta turquesa tocando piano de madeira com candelabros de velas acesas num salão de jazz aconchegante, pintura em guache e óleo"
  },
  {
    "id": "tucunare-dj-submarino",
    "title": "Tucunaré DJ na Festa do Navio Naufragado",
    "category": "Música & Fundo do Mar",
    "imageUrl": "/challenges/tucunare-dj-submarino.webp",
    "samplePrompt": "Um peixe colorido usando fones de ouvido neon tocando numa mesa de DJ de conchas sobre um navio naufragado cercado por águas-vivas brilhantes, animação cartoon 3D"
  },
  {
    "id": "garca-caligrafa-lagoa",
    "title": "Garça Calígrafa no Pavilhão do Lago",
    "category": "Arte Oriental & Aquarela",
    "imageUrl": "/challenges/garca-caligrafa-lagoa.webp",
    "samplePrompt": "Uma garça branca elegante segurando um pincel de bambu e pintando caligrafia dourada em um pergaminho num pavilhão sobre uma lagoa de lótus, pintura oriental em aquarela e nanquim"
  },
  {
    "id": "cutia-padeiro-forno",
    "title": "Cutia Padeira e os Pães Dourados no Forno a Lenha",
    "category": "Gastronomia & Livro Ilustrado",
    "imageUrl": "/challenges/cutia-padeiro-forno.webp",
    "samplePrompt": "Uma cutia fofa usando chapéu branco de padeiro e avental segurando uma cesta de pães dourados diante de um forno de pedra a lenha aceso, ilustração de livro infantil"
  },
  {
    "id": "prea-jardineiro-bonsai",
    "title": "Preá Jardineiro e o Bonsai de Cerejeira",
    "category": "Jardinagem & Stop-Motion",
    "imageUrl": "/challenges/prea-jardineiro-bonsai.webp",
    "samplePrompt": "Um pequeno preá fofo de chapéu de palha e avental verde podando um bonsai de cerejeira rosa com uma tesourinha numa varanda de madeira, estilo stop-motion de massinha"
  },
  {
    "id": "veado-campeiro-faroleiro",
    "title": "Veado-Campeiro Guardião da Torre Solar",
    "category": "Ecologia & Solarpunk",
    "imageUrl": "/challenges/veado-campeiro-faroleiro.webp",
    "samplePrompt": "Um veado-campeiro vestindo poncho colorido ao lado de uma torre de cristal solar no topo de uma colina verde com rio e campos dourados ao amanhecer, pintura solarpunk"
  },
  {
    "id": "anta-maquinista-vapor",
    "title": "Anta Maquinista na Locomotiva do Vale",
    "category": "Transporte & Livro Ilustrado",
    "imageUrl": "/challenges/anta-maquinista-vapor.webp",
    "samplePrompt": "Uma anta simpática usando boné de maquinista e lenço vermelho conduzindo um trem a vapor colorido sobre uma ponte de pedra acima de um vale verde, ilustração de livro infantil"
  },
  {
    "id": "quero-quero-arbitro-futebol",
    "title": "Quero-Quero Árbitro na Arena Holográfica",
    "category": "Esporte & Games 3D",
    "imageUrl": "/challenges/quero-quero-arbitro-futebol.webp",
    "samplePrompt": "Um pássaro quero-quero vestindo camisa listrada de juiz de futebol e apito mostrando um cartão amarelo num campo de futebol futurista iluminado, animação 3D"
  },
  {
    "id": "bem-te-vi-cantor-radio",
    "title": "Bem-Te-Vi Locutor na Rádio Retrô Anos 50",
    "category": "Música & Retrô",
    "imageUrl": "/challenges/bem-te-vi-cantor-radio.webp",
    "samplePrompt": "Um pássaro bem-te-vi amarelo usando fones de ouvido cantando em um microfone cromado antigo dentro de um estúdio de rádio anos 50 com discos de vinil, ilustração retrô"
  },
  {
    "id": "beija-flor-relojoeiro-flores",
    "title": "Beija-Flor Relojoeiro e a Flor Mecânica",
    "category": "Natureza & Steampunk Macro",
    "imageUrl": "/challenges/beija-flor-relojoeiro-flores.webp",
    "samplePrompt": "Um beija-flor verde-esmeralda usando uma lupa de relojoeiro pairando no ar para ajustar engrenagens douradas dentro de uma flor mecânica num jardim, arte macro steampunk"
  },
  {
    "id": "sabia-maestro-coral",
    "title": "Sabiá Maestro e o Coral na Partitura do Amanhecer",
    "category": "Música & Papel Recortado",
    "imageUrl": "/challenges/sabia-maestro-coral.webp",
    "samplePrompt": "Um pássaro sabiá de fraque regendo com batuta um coral de passarinhos coloridos pousados em fios como uma partitura ao amanhecer, estilo papel recortado em camadas"
  },
  {
    "id": "ema-maratonista-dunas",
    "title": "Ema Maratonista nas Dunas e Lagoas",
    "category": "Esporte & Brasilidades",
    "imageUrl": "/challenges/ema-maratonista-dunas.webp",
    "samplePrompt": "Uma ema atlética usando faixa esportiva e tênis de corrida correndo pelas dunas de areia branca ao lado de lagoas azul-turquesa, ilustração estilo quadrinhos cel shading"
  },
  {
    "id": "curio-vidreiro-colorido",
    "title": "Curió Mestre Vidreiro e o Vaso Arco-Íris",
    "category": "Artesanato & Pintura Digital",
    "imageUrl": "/challenges/curio-vidreiro-colorido.webp",
    "samplePrompt": "Um pássaro artesão usando óculos de proteção soprando um vaso de vidro colorido brilhante na ponta de um tubo dentro de uma oficina com forno aceso, pintura digital"
  },
  {
    "id": "pirarucu-submarino-amazonia",
    "title": "Pirarucu Mecânico na Floresta Inundada",
    "category": "Amazônia & Solarpunk",
    "imageUrl": "/challenges/pirarucu-submarino-amazonia.webp",
    "samplePrompt": "Um peixe pirarucu gigante com detalhes de latão e janelas iluminadas de submarino nadando entre troncos de uma floresta inundada com raios de sol, arte digital steampunk solarpunk"
  },
  {
    "id": "sucuri-pintora-mural",
    "title": "Sucuri Artista e o Mural Geométrico da Floresta",
    "category": "Arte Urbana & Brasilidades",
    "imageUrl": "/challenges/sucuri-pintora-mural.webp",
    "samplePrompt": "Uma cobra sucuri verde simpática usando boina roxa segurando pincel para pintar um mural geométrico colorido da floresta em uma parede de pedra, ilustração vibrante"
  },
  {
    "id": "iguana-marinha-mergulhadora",
    "title": "Iguana Mergulhadora no Recife Vulcânico",
    "category": "Oceano & Animação 3D",
    "imageUrl": "/challenges/iguana-marinha-mergulhadora.webp",
    "samplePrompt": "Uma iguana simpática usando um capacete de mergulho antigo de cobre explorando o fundo do mar cercada por estrelas-do-mar e corais coloridos, animação 3D Pixar"
  },
  {
    "id": "condor-cartografo-cordilheira",
    "title": "Condor Cartógrafo no Observatório dos Andes",
    "category": "América Latina & Arte Conceitual",
    "imageUrl": "/challenges/condor-cartografo-cordilheira.webp",
    "samplePrompt": "Um condor usando colete de couro e óculos de aviador desenhando um mapa sobre uma mesa em um observatório de madeira diante de montanhas nevadas, arte conceitual"
  },
  {
    "id": "chinchila-tecela-tapete",
    "title": "Chinchila Tecelã e o Tapete Andino",
    "category": "América Latina & Stop-Motion",
    "imageUrl": "/challenges/chinchila-tecela-tapete.webp",
    "samplePrompt": "Uma chinchila cinza fofa usando gorro andino colorido tecendo um tapete geométrico em um tear de madeira cercada por novelos de lã, estilo stop-motion de massinha"
  },
  {
    "id": "alpaca-dj-festival-montanha",
    "title": "Alpaca DJ no Festival das Montanhas",
    "category": "Música & América Latina",
    "imageUrl": "/challenges/alpaca-dj-festival-montanha.webp",
    "samplePrompt": "Uma alpaca branca fofa usando óculos de estrela e poncho colorido tocando numa mesa de DJ iluminada em um festival nas montanhas com lanternas de papel, animação 3D"
  },
  {
    "id": "vicunha-astronoma-deserto",
    "title": "Vicunha Astrônoma e o Radiotelescópio do Atacama",
    "category": "Astronomia & Ciência",
    "imageUrl": "/challenges/vicunha-astronoma-deserto.webp",
    "samplePrompt": "Uma vicunha dourada usando cachecol colorido ao lado de uma grande antena branca de radiotelescópio no deserto sob o céu estrelado da Via Láctea, ilustração digital"
  },
  {
    "id": "caracal-relojoeiro-areia",
    "title": "Caracal Artesão de Ampulhetas Douradas",
    "category": "Fantasia & Relojoaria",
    "imageUrl": "/challenges/caracal-relojoeiro-areia.webp",
    "samplePrompt": "Um gato caracal de orelhas compridas e colete bordado montando ampulhetas de vidro turquesa com areia dourada brilhante numa oficina iluminada, pintura digital de fantasia"
  },
  {
    "id": "feneco-mensageiro-vento",
    "title": "Raposa-do-Deserto no Veleiro das Dunas",
    "category": "Aventura & Anime",
    "imageUrl": "/challenges/feneco-mensageiro-vento.webp",
    "samplePrompt": "Uma raposinha feneco de orelhas grandes usando óculos de aviador pilotando um barco a vela pelas dunas de areia do deserto ao pôr do sol, estilo ilustração anime"
  },
  {
    "id": "okapi-bibliotecario-floresta",
    "title": "Ocapi Bibliotecário na Grande Árvore de Vitrais",
    "category": "Literatura & Fantasia",
    "imageUrl": "/challenges/okapi-bibliotecario-floresta.webp",
    "samplePrompt": "Um ocapi gentil de patas listradas e óculos no balcão de uma biblioteca circular construída dentro de uma árvore gigante com janelas de vitral colorido, pintura em guache"
  },
  {
    "id": "pangolim-ferreiro-armadura",
    "title": "Pangolim Artesão e o Escudo Reluzente",
    "category": "Games & Arte Voxel",
    "imageUrl": "/challenges/pangolim-ferreiro-armadura.webp",
    "samplePrompt": "Um pangolim dourado vestindo avental de ferreiro cuidando de um escudo brilhante de cobre e prata em uma oficina iluminada por lanternas, estilo arte voxel 3D"
  },
  {
    "id": "axolote-alquimista-cristal",
    "title": "Axolote Mago no Laboratório da Caverna",
    "category": "Fantasia & Animação 3D",
    "imageUrl": "/challenges/axolote-alquimista-cristal.webp",
    "samplePrompt": "Um axolote cor-de-rosa fofo usando chapéu de mago diante de frascos de vidro com poções brilhantes azuis, roxas e verdes dentro de uma caverna, animação 3D Pixar"
  },
  {
    "id": "narval-faroleiro-artico",
    "title": "Narval e o Farol sob a Aurora em Papel Recortado",
    "category": "Ártico & Papel Recortado",
    "imageUrl": "/challenges/narval-faroleiro-artico.webp",
    "samplePrompt": "Um narval azul com chifre dourado nadando ao lado de um farol flutuante nas ondas do mar sob a aurora boreal verde e rosa, estilo papel recortado em camadas"
  },
];
