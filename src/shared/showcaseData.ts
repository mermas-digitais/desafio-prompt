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
    imageUrl: '/challenges/boto_cor_de_rosa_synthwave.svg',
    samplePrompt:
      'Boto-cor-de-rosa cibernético usando chapéu neon saltando de um rio amazônico espelhado diante de um sol synthwave roxo e dourado',
  },
  {
    id: 'panda-quimico-bambu',
    title: 'Panda Cientista no Laboratório de Bambu',
    category: 'Ciência & Natureza',
    imageUrl: '/challenges/panda_quimico_bambu.svg',
    samplePrompt:
      'Urso panda fofo de jaleco branco e óculos fazendo experimento químico que solta nuvens de estrelas coloridas entre bambus',
  },
  {
    id: 'canguru-boxeador-arcade',
    title: 'Canguru Campeão no Ringue Arcade',
    category: 'Esporte & Fliperama',
    imageUrl: '/challenges/canguru_boxeador_arcade.svg',
    samplePrompt:
      'Canguru atlético com luvas de boxe elétricas azuis e jaqueta brilhante em ringue futurista cercado por placares holográficos',
  },
  {
    id: 'fenix-cristal-vulcao',
    title: 'Fênix de Cristal sobre o Vulcão de Ametista',
    category: 'Mitologia & Fantasia Épica',
    imageUrl: '/challenges/fenix_cristal_vulcao.svg',
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
    imageUrl: '/challenges/dragao_biblioteca_cha.svg',
    samplePrompt:
      'Pequeno dragão verde de óculos redondos lendo um livro na poltrona enquanto aquece uma chaleira de chá com sopro de fogo',
  },
];
