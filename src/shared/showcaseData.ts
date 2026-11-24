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
];
