export interface SemanticKeywordGroup {
  concept: string;
  weight: number;
  synonyms: string[];
}

export interface ChallengeKeywordsConfig {
  subject: SemanticKeywordGroup[];
  style: SemanticKeywordGroup[];
  environment: SemanticKeywordGroup[];
  botPrompts: string[];
}

export interface ChallengeSeedData {
  id: string;
  title: string;
  category: string;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  imageUrl: string;
  fullPrompt: string;
  subjectLayer: string;
  styleLayer: string;
  environmentLayer: string;
  hint1: string;
  hint2: string;
  keywords: ChallengeKeywordsConfig;
}

export const OFFICIAL_CHALLENGES: ChallengeSeedData[] = [
  {
    id: 'boi-cyberpunk',
    title: 'Bumba-Meu-Boi Cyberpunk',
    category: 'Cultura Maranhense & Sci-Fi',
    difficulty: 'Médio',
    imageUrl: '/challenges/boi-cyberpunk.webp',
    fullPrompt:
      'Um robô futurista dançando bumba-meu-boi nas ruas históricas de São Luís do Maranhão à noite, cercado por bandeirinhas de neon rosa e roxo, estilo animação 3D Pixar, iluminação cinematográfica vibrante',
    subjectLayer: 'Um robô futurista dançando bumba-meu-boi',
    styleLayer: 'estilo animação 3D Pixar, iluminação cinematográfica vibrante',
    environmentLayer:
      'nas ruas históricas de São Luís do Maranhão à noite, cercado por bandeirinhas de neon rosa e roxo',
    hint1: 'Dica de Estilo (60s): Pense em animação 3D estilo Pixar com luzes neon rosa e roxo!',
    hint2: 'Dica Principal (30s): É um robô dançando Bumba-Meu-Boi nas ruas históricas de São Luís à noite!',
    keywords: {
      subject: [
        {
          concept: 'Robô futurista',
          weight: 0.45,
          synonyms: ['robo', 'robot', 'androide', 'ciborgue', 'mecha', 'futurista', 'maquina', 'automato'],
        },
        {
          concept: 'Dançando Bumba-Meu-Boi',
          weight: 0.55,
          synonyms: [
            'bumba-meu-boi',
            'bumba meu boi',
            'boi',
            'boizinho',
            'dancando',
            'danca',
            'folclore',
            'festa junina',
            'sao joao',
            'toada',
            'cultura maranhense',
          ],
        },
      ],
      style: [
        {
          concept: 'Animação 3D Pixar',
          weight: 0.6,
          synonyms: ['3d', 'pixar', 'disney', 'animacao', 'render', 'cartoon 3d', 'modelagem 3d', 'cgi'],
        },
        {
          concept: 'Iluminação cinematográfica vibrante',
          weight: 0.4,
          synonyms: ['cinematografica', 'vibrante', 'colorido', 'iluminacao', 'luzes', 'brilhante', 'cyberpunk'],
        },
      ],
      environment: [
        {
          concept: 'Ruas históricas de São Luís à noite',
          weight: 0.55,
          synonyms: [
            'sao luis',
            'maranhao',
            'centro historico',
            'ruas historicas',
            'casaroes',
            'azulejos',
            'rua',
            'noite',
            'noturno',
            'colonial',
          ],
        },
        {
          concept: 'Bandeirinhas de neon rosa e roxo',
          weight: 0.45,
          synonyms: ['bandeirinhas', 'neon', 'rosa', 'roxo', 'magenta', 'violeta', 'enfeites', 'festa'],
        },
      ],
      botPrompts: [
        'Um robô fofo dançando bumba meu boi no centro histórico de São Luís à noite com luzes neon rosa e roxo em estilo animação 3D Pixar',
        'Robô futurista celebrando festa junina e bumba-meu-boi nas ruas coloniais com bandeirinhas neon brilhantes, render 3D colorido',
        'Animação 3D estilo Disney Pixar de um robô no Maranhão dançando boi à noite sob bandeirinhas de neon roxo e rosa',
      ],
    },
  },
  {
    id: 'cientista-espacial',
    title: 'Cientista Afrofuturista Estelar',
    category: 'Mulheres no STEAM',
    difficulty: 'Médio',
    imageUrl: '/challenges/cientista-espacial.webp',
    fullPrompt:
      'Uma jovem cientista negra com óculos holográficos e tranças luminosas programando um holograma de constelações dentro de uma estação espacial cheia de plantas tropicais, estilo ilustração digital afrofuturista, luzes violeta e dourado',
    subjectLayer:
      'Uma jovem cientista negra com óculos holográficos e tranças luminosas programando um holograma de constelações',
    styleLayer: 'estilo ilustração digital afrofuturista, luzes violeta e dourado',
    environmentLayer: 'dentro de uma estação espacial cheia de plantas tropicais',
    hint1: 'Dica de Estilo (60s): Ilustração digital afrofuturista em tons de violeta e dourado!',
    hint2: 'Dica Principal (30s): Cientista com óculos/holograma de constelações numa estação espacial com plantas!',
    keywords: {
      subject: [
        {
          concept: 'Jovem cientista negra com tranças e óculos',
          weight: 0.55,
          synonyms: [
            'cientista',
            'jovem',
            'menina',
            'mulher',
            'negra',
            'trancas',
            'oculos',
            'pesquisadora',
            'programadora',
            'engenheira',
          ],
        },
        {
          concept: 'Programando holograma de constelações',
          weight: 0.45,
          synonyms: [
            'holograma',
            'holografico',
            'constelacoes',
            'estrelas',
            'galaxia',
            'programando',
            'interface',
            'mapa estelar',
            'astronomia',
          ],
        },
      ],
      style: [
        {
          concept: 'Ilustração digital afrofuturista',
          weight: 0.6,
          synonyms: [
            'afrofuturista',
            'afrofuturismo',
            'ilustracao digital',
            'arte digital',
            'pintura digital',
            'conceitual',
            'futurista',
          ],
        },
        {
          concept: 'Luzes violeta e dourado',
          weight: 0.4,
          synonyms: ['violeta', 'roxo', 'dourado', 'ouro', 'luminosas', 'brilhante', 'neon'],
        },
      ],
      environment: [
        {
          concept: 'Estação espacial',
          weight: 0.55,
          synonyms: ['estacao espacial', 'nave', 'espaco', 'laboratorio espacial', 'orbita', 'sci-fi', 'cosmos'],
        },
        {
          concept: 'Plantas tropicais',
          weight: 0.45,
          synonyms: ['plantas', 'tropicais', 'vegetacao', 'folhagens', 'jardim', 'natureza', 'estufa', 'verde'],
        },
      ],
      botPrompts: [
        'Jovem cientista negra com tranças brilhantes e óculos holográficos mexendo num holograma de estrelas dentro de uma nave espacial com plantas, arte afrofuturista roxa e dourada',
        'Ilustração digital afrofuturista de uma programadora espacial analisando constelações em holograma cercada por plantas tropicais, luzes violeta e dourado',
        'Uma menina cientista com óculos tecnológicos criando um mapa de constelações holográfico numa estação espacial verde, estilo afrofuturismo',
      ],
    },
  },
  {
    id: 'gato-alquimista',
    title: 'O Gato Mago do Código Binário',
    category: 'Fantasia & Programação',
    difficulty: 'Fácil',
    imageUrl: '/challenges/gato-alquimista.webp',
    fullPrompt:
      'Um gato laranja usando chapéu de mago misturando poções brilhantes de código binário em um laboratório medieval iluminado por velas flutuantes, estilo pintura digital fantasia mágica, cores quentes e místicas',
    subjectLayer: 'Um gato laranja usando chapéu de mago misturando poções brilhantes de código binário',
    styleLayer: 'estilo pintura digital fantasia mágica, cores quentes e místicas',
    environmentLayer: 'em um laboratório medieval iluminado por velas flutuantes',
    hint1: 'Dica de Estilo (60s): Pintura digital de fantasia mágica com cores quentes e velas flutuantes!',
    hint2: 'Dica Principal (30s): Um gato laranja de chapéu de mago criando poções de código binário!',
    keywords: {
      subject: [
        {
          concept: 'Gato laranja com chapéu de mago',
          weight: 0.55,
          synonyms: ['gato', 'gatinho', 'felino', 'laranja', 'ruivo', 'mago', 'bruxo', 'feiticeiro', 'chapeu', 'alquimista'],
        },
        {
          concept: 'Misturando poções de código binário',
          weight: 0.45,
          synonyms: [
            'pocao',
            'pocoes',
            'caldeirao',
            'frascos',
            'codigo',
            'binario',
            'zeros e uns',
            'misturando',
            'alquimia',
            'magia',
          ],
        },
      ],
      style: [
        {
          concept: 'Pintura digital fantasia mágica',
          weight: 0.6,
          synonyms: ['pintura digital', 'fantasia', 'magica', 'ilustracao', 'rpg', 'arte conceitual', 'encantado'],
        },
        {
          concept: 'Cores quentes e místicas',
          weight: 0.4,
          synonyms: ['cores quentes', 'mistico', 'brilhante', 'dourado', 'laranja', 'iluminado', 'aconchegante'],
        },
      ],
      environment: [
        {
          concept: 'Laboratório medieval',
          weight: 0.55,
          synonyms: ['laboratorio', 'medieval', 'castelo', 'biblioteca', 'oficina', 'pedra', 'estantes', 'livros'],
        },
        {
          concept: 'Velas flutuantes',
          weight: 0.45,
          synonyms: ['velas', 'flutuantes', 'velas voando', 'chamas', 'luz de velas', 'tochas'],
        },
      ],
      botPrompts: [
        'Um gatinho laranja com chapéu de mago preparando poções brilhantes com números binários num laboratório medieval cheio de velas flutuantes, pintura digital de fantasia',
        'Gato bruxo alquimista misturando poção mágica de código em uma sala medieval iluminada por velas voando, estilo fantasia com cores quentes',
        'Pintura digital mágica de um gato laranja feiticeiro fazendo poções brilhantes de programação cercado por livros e velas flutuantes',
      ],
    },
  },
  {
    id: 'robo-skatista',
    title: 'Robô Skatista nos Circuitos Dourados',
    category: 'Games & Retrô',
    difficulty: 'Difícil',
    imageUrl: '/challenges/robo-skatista.webp',
    fullPrompt:
      'Um pequeno robô simpático andando de skate voador sobre uma ponte de circuitos eletrônicos dourados ao pôr do sol, estilo pixel art retrô 16 bits detalhado, céu em degradê rosa choque e laranja',
    subjectLayer: 'Um pequeno robô simpático andando de skate voador',
    styleLayer: 'estilo pixel art retrô 16 bits detalhado, céu em degradê rosa choque e laranja',
    environmentLayer: 'sobre uma ponte de circuitos eletrônicos dourados ao pôr do sol',
    hint1: 'Dica de Estilo (60s): Estética de videogame antigo — Pixel Art retrô 16 bits ao pôr do sol!',
    hint2: 'Dica Principal (30s): Um pequeno robô num skate voador sobre uma ponte de circuitos eletrônicos!',
    keywords: {
      subject: [
        {
          concept: 'Pequeno robô simpático',
          weight: 0.5,
          synonyms: ['robo', 'robozinho', 'pequeno', 'simpatico', 'fofo', 'bot', 'androide'],
        },
        {
          concept: 'Andando de skate voador',
          weight: 0.5,
          synonyms: ['skate', 'skatista', 'hoverboard', 'skate voador', 'prancha', 'flutuante', 'manobra', 'andando'],
        },
      ],
      style: [
        {
          concept: 'Pixel art retrô 16 bits',
          weight: 0.65,
          synonyms: ['pixel art', 'pixel', '16 bits', '8 bits', 'retro', 'videogame', 'arcade', 'synthwave', 'pixelado'],
        },
        {
          concept: 'Céu degradê rosa choque e laranja',
          weight: 0.35,
          synonyms: ['rosa', 'laranja', 'degrade', 'por do sol', 'entardecer', 'crepusculo', 'vaporwave'],
        },
      ],
      environment: [
        {
          concept: 'Ponte de circuitos eletrônicos dourados',
          weight: 0.6,
          synonyms: ['ponte', 'circuitos', 'placa mae', 'eletronicos', 'dourados', 'trilha', 'estrada', 'cidade digital'],
        },
        {
          concept: 'Ao pôr do sol',
          weight: 0.4,
          synonyms: ['por do sol', 'sol', 'horizonte', 'entardecer', 'ceu colorido'],
        },
      ],
      botPrompts: [
        'Pequeno robô andando de skate voador em cima de uma ponte feita de circuitos eletrônicos dourados no pôr do sol, estilo pixel art 16 bits rosa e laranja',
        'Arte em pixel art retrô de videogame mostrando um robozinho skatista num hoverboard sobre circuitos dourados com céu rosa e laranja',
        'Um robô simpático de skate flutuante atravessando uma pista de circuitos eletrônicos ao entardecer, visual 16-bit pixel art detalhado',
      ],
    },
  },
  {
    id: 'capivara-dj',
    title: 'Capivara DJ na Floresta Neon',
    category: 'Brasilidades & Música',
    difficulty: 'Fácil',
    imageUrl: '/challenges/capivara-dj.webp',
    fullPrompt:
      'Uma capivara estilosa usando fones de ouvido neon tocando como DJ em um festival de música eletrônica no meio da floresta amazônica com lasers coloridos, estilo renderização 3D low-poly vibrante, iluminação noturna',
    subjectLayer: 'Uma capivara estilosa usando fones de ouvido neon tocando como DJ',
    styleLayer: 'estilo renderização 3D low-poly vibrante, iluminação noturna',
    environmentLayer: 'em um festival de música eletrônica no meio da floresta amazônica com lasers coloridos',
    hint1: 'Dica de Estilo (60s): Renderização 3D low-poly geométrica com iluminação noturna e lasers!',
    hint2: 'Dica Principal (30s): Uma capivara de fones neon tocando como DJ no meio da floresta amazônica!',
    keywords: {
      subject: [
        {
          concept: 'Capivara estilosa com fones neon',
          weight: 0.55,
          synonyms: ['capivara', 'animal', 'fones', 'headphone', 'fones de ouvido', 'oculos', 'estilosa', 'neon'],
        },
        {
          concept: 'Tocando como DJ',
          weight: 0.45,
          synonyms: ['dj', 'tocando', 'mesa de som', 'controladora', 'musica', 'mixando', 'festa', 'balada'],
        },
      ],
      style: [
        {
          concept: 'Renderização 3D low-poly vibrante',
          weight: 0.65,
          synonyms: ['3d', 'low-poly', 'low poly', 'geometrico', 'poligonal', 'render', 'vibrante', 'estilizado'],
        },
        {
          concept: 'Iluminação noturna e lasers',
          weight: 0.35,
          synonyms: ['noturna', 'noite', 'lasers', 'coloridos', 'luzes neon', 'feixes de luz', 'brilhante'],
        },
      ],
      environment: [
        {
          concept: 'Festival na floresta amazônica',
          weight: 0.65,
          synonyms: ['floresta', 'amazonia', 'amazonica', 'selva', 'mata', 'arvores', 'natureza', 'festival', 'palco'],
        },
        {
          concept: 'Música eletrônica com lasers',
          weight: 0.35,
          synonyms: ['eletronica', 'rave', 'show', 'lasers', 'festa na floresta'],
        },
      ],
      botPrompts: [
        'Uma capivara estilosa com fones de ouvido neon sendo DJ em uma festa de música eletrônica na floresta amazônica à noite com lasers coloridos, estilo 3D low-poly',
        'Render 3D low poly de uma capivara DJ tocando som eletrônico no meio da selva amazônica iluminada por lasers e neon à noite',
        'Capivara DJ com headphone brilhante comandando um festival na floresta tropical cheia de lasers coloridos, arte 3D estilizada',
      ],
    },
  },
  {
    id: 'astronauta-cafe',
    title: 'Café em Gravidade Zero',
    category: 'Arte & Espaço',
    difficulty: 'Difícil',
    imageUrl: '/challenges/astronauta-cafe.webp',
    fullPrompt:
      'Uma astronauta flutuando em gravidade zero tomando uma xícara de café enquanto observa a Terra pela janela panorâmica da nave, estilo pintura em aquarela artística com respingos de tinta cósmica, atmosfera calma e sonhadora',
    subjectLayer: 'Uma astronauta flutuando em gravidade zero tomando uma xícara de café',
    styleLayer: 'estilo pintura em aquarela artística com respingos de tinta cósmica, atmosfera calma e sonhadora',
    environmentLayer: 'enquanto observa a Terra pela janela panorâmica da nave',
    hint1: 'Dica de Estilo (60s): Pintura artística em aquarela com respingos de tinta e clima calmo!',
    hint2: 'Dica Principal (30s): Uma astronauta flutuando com uma xícara de café olhando a Terra pela janela!',
    keywords: {
      subject: [
        {
          concept: 'Astronauta flutuando em gravidade zero',
          weight: 0.55,
          synonyms: ['astronauta', 'cosmonauta', 'mulher astronauta', 'flutuando', 'gravidade zero', 'capacete', 'traje espacial'],
        },
        {
          concept: 'Tomando uma xícara de café',
          weight: 0.45,
          synonyms: ['cafe', 'xicara', 'caneca', 'bebendo', 'tomando', 'gotas flutuando', 'cha'],
        },
      ],
      style: [
        {
          concept: 'Pintura em aquarela com respingos de tinta',
          weight: 0.65,
          synonyms: ['aquarela', 'pintura', 'tinta', 'respingos', 'artistica', 'papel', 'ilustracao em aquarela', 'manchas'],
        },
        {
          concept: 'Atmosfera calma e sonhadora',
          weight: 0.35,
          synonyms: ['calma', 'sonhadora', 'poetica', 'suave', 'serena', 'relaxante', 'delicada'],
        },
      ],
      environment: [
        {
          concept: 'Observando a Terra pela janela da nave',
          weight: 0.7,
          synonyms: ['terra', 'planeta', 'janela', 'cupula', 'nave', 'estacao espacial', 'espaco', 'orbita', 'universo'],
        },
        {
          concept: 'Tinta cósmica e estrelas',
          weight: 0.3,
          synonyms: ['cosmica', 'estrelas', 'galaxia', 'azul', 'espaco sideral'],
        },
      ],
      botPrompts: [
        'Uma astronauta flutuando sem gravidade tomando uma xícara de café e olhando o planeta Terra pela janela da nave, estilo pintura em aquarela com respingos de tinta',
        'Pintura artística em aquarela de uma astronauta relaxando com uma caneca de café em gravidade zero diante da janela panorâmica com vista para a Terra',
        'Ilustração suave em aquarela com respingos cósmicos mostrando uma astronauta flutuando na nave espacial com café na mão observando a Terra',
      ],
    },
  },
  {
    id: 'sereia-holografica',
    title: 'Sereia Programadora Subaquática',
    category: 'Oceano & Código',
    difficulty: 'Médio',
    imageUrl: '/challenges/sereia-holografica.webp',
    fullPrompt:
      'Uma sereia cibernética com cauda bioluminescente roxa e rosa programando em telas holográficas flutuantes no fundo do mar cercada por corais brilhantes, estilo animação 3D Pixar vibrante',
    subjectLayer: 'Uma sereia cibernética com cauda bioluminescente roxa e rosa programando em telas holográficas',
    styleLayer: 'estilo animação 3D Pixar vibrante, iluminação bioluminescente',
    environmentLayer: 'no fundo do mar cercada por corais brilhantes e águas cristalinas',
    hint1: 'Dica de Estilo (60s): Animação 3D vibrante estilo Pixar com brilho bioluminescente roxo e rosa!',
    hint2: 'Dica Principal (30s): Uma sereia cibernética programando em telas holográficas no fundo do mar com corais!',
    keywords: {
      subject: [
        {
          concept: 'Sereia cibernética roxa e rosa',
          weight: 0.55,
          synonyms: ['sereia', 'menina sereia', 'cauda de peixe', 'cibernetica', 'futurista', 'roxa', 'rosa', 'bioluminescente'],
        },
        {
          concept: 'Programando em telas holográficas',
          weight: 0.45,
          synonyms: ['programando', 'codigo', 'telas', 'holograficas', 'holograma', 'computador', 'digitando', 'tecnologia'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D Pixar vibrante',
          weight: 0.65,
          synonyms: ['3d', 'pixar', 'disney', 'animacao', 'render 3d', 'vibrante', 'cartoon 3d'],
        },
        {
          concept: 'Brilho bioluminescente',
          weight: 0.35,
          synonyms: ['bioluminescente', 'neon', 'brilhante', 'luminosa', 'luzes'],
        },
      ],
      environment: [
        {
          concept: 'Fundo do mar com corais brilhantes',
          weight: 0.7,
          synonyms: ['fundo do mar', 'oceano', 'subaquatico', 'embaixo dagua', 'agua', 'corais', 'recife', 'mar'],
        },
        {
          concept: 'Bolhas e luzes marinhas',
          weight: 0.3,
          synonyms: ['bolhas', 'azul', 'marinho', 'aquatico'],
        },
      ],
      botPrompts: [
        'Sereia futurista com cauda brilhante rosa e roxa programando em telas de holograma no fundo do mar cheio de corais luminosos, estilo animação 3D Pixar',
        'Animação 3D de uma sereia cibernética digitando código em monitores holográficos embaixo da água entre recifes de corais coloridos',
        'Sereia tecnológica com cauda bioluminescente usando computadores holográficos no oceano iluminado, render 3D vibrante',
      ],
    },
  },
  {
    id: 'dragao-origami',
    title: 'Dragão de Origami na Biblioteca',
    category: 'Arte & Papel',
    difficulty: 'Médio',
    imageUrl: '/challenges/dragao-origami.webp',
    fullPrompt:
      'Um pequeno dragão amigável feito de dobraduras de origami em papel colorido neon voando por uma biblioteca futurista iluminada por feixes de sol dourado e livros flutuando, estilo stop-motion papercraft 3D',
    subjectLayer: 'Um pequeno dragão amigável feito de dobraduras de origami em papel colorido neon voando',
    styleLayer: 'estilo stop-motion papercraft 3D, textura de papel dobrado e luz dourada',
    environmentLayer: 'por uma biblioteca futurista iluminada por feixes de sol e livros flutuando',
    hint1: 'Dica de Estilo (60s): Estética de papel dobrado (origami / papercraft) em 3D stop-motion com luz solar!',
    hint2: 'Dica Principal (30s): Um dragão de origami colorido voando numa biblioteca com livros flutuando!',
    keywords: {
      subject: [
        {
          concept: 'Dragão amigável de origami / papel dobrado',
          weight: 0.65,
          synonyms: ['dragao', 'dragaosinho', 'origami', 'papel', 'dobradura', 'papel colorido', 'voando'],
        },
        {
          concept: 'Cores vibrantes e neon',
          weight: 0.35,
          synonyms: ['colorido', 'neon', 'amigavel', 'fofo', 'pequeno'],
        },
      ],
      style: [
        {
          concept: 'Estilo papercraft 3D / stop-motion',
          weight: 0.65,
          synonyms: ['papercraft', 'origami', 'stop-motion', 'stop motion', '3d', 'textura de papel', 'recorte de papel', 'maquete'],
        },
        {
          concept: 'Feixes de luz solar dourada',
          weight: 0.35,
          synonyms: ['luz dourada', 'sol', 'raios de sol', 'iluminado', 'quente', 'cinematografico'],
        },
      ],
      environment: [
        {
          concept: 'Biblioteca futurista com estantes',
          weight: 0.6,
          synonyms: ['biblioteca', 'livraria', 'estantes', 'livros', 'sala de leitura', 'futurista'],
        },
        {
          concept: 'Livros flutuando no ar',
          weight: 0.4,
          synonyms: ['livros flutuando', 'voando', 'magica', 'paginas'],
        },
      ],
      botPrompts: [
        'Dragão fofo feito de dobraduras de papel origami colorido voando dentro de uma biblioteca iluminada pelo sol com livros flutuando, estilo 3D papercraft',
        'Animação stop-motion em papel de um dragão de origami sobrevoando estantes de livros e raios de sol dourados',
        'Pequeno dragão de origami colorido voando entre livros mágicos flutuantes em uma grande biblioteca ensolarada, arte 3D em papel',
      ],
    },
  },
  {
    id: 'banda-forro-robo',
    title: 'Trio Robô de Forró Neon',
    category: 'Cultura Nordestina & Robótica',
    difficulty: 'Fácil',
    imageUrl: '/challenges/banda-forro-robo.webp',
    fullPrompt:
      'Três robôs carismáticos tocando sanfona, zabumba e triângulo de luz laser em um palco de festa junina nordestina com bandeirinhas brilhantes e fogos de artifício no céu, estilo animação 3D vibrante',
    subjectLayer: 'Três robôs carismáticos tocando sanfona, zabumba e triângulo de luz laser',
    styleLayer: 'estilo animação 3D vibrante, luzes coloridas de festa e laser',
    environmentLayer: 'em um palco de festa junina nordestina com bandeirinhas brilhantes e fogos de artifício',
    hint1: 'Dica de Estilo (60s): Animação 3D vibrante e festiva cheia de luzes neon e bandeirinhas!',
    hint2: 'Dica Principal (30s): Três robôs tocando sanfona, zabumba e triângulo num palco de Festa Junina!',
    keywords: {
      subject: [
        {
          concept: 'Três robôs músicos',
          weight: 0.5,
          synonyms: ['robos', 'tres robos', 'banda de robos', 'trio', 'androide', 'musicos'],
        },
        {
          concept: 'Tocando sanfona, zabumba e triângulo',
          weight: 0.5,
          synonyms: ['sanfona', 'acordeao', 'zabumba', 'tambor', 'triangulo', 'forro', 'baião', 'instrumentos', 'tocando musica'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D colorida e vibrante',
          weight: 0.65,
          synonyms: ['3d', 'animacao', 'pixar', 'colorido', 'vibrante', 'render', 'cartoon'],
        },
        {
          concept: 'Instrumentos com luz laser / neon',
          weight: 0.35,
          synonyms: ['laser', 'neon', 'brilhante', 'holografico', 'luminoso'],
        },
      ],
      environment: [
        {
          concept: 'Palco de Festa Junina / São João com bandeirinhas',
          weight: 0.7,
          synonyms: ['festa junina', 'sao joao', 'arraial', 'palco', 'bandeirinhas', 'nordeste', 'festa'],
        },
        {
          concept: 'Céu noturno com fogos de artifício',
          weight: 0.3,
          synonyms: ['fogos', 'noite', 'estrelas', 'show'],
        },
      ],
      botPrompts: [
        'Três robôs animados tocando sanfona, zabumba e triângulo iluminados por neon em um palco de festa junina com bandeirinhas coloridas, animação 3D',
        'Banda de robôs tocando forró com sanfona e triângulo de laser em um arraial de São João à noite, render 3D vibrante',
        'Animação 3D divertida de um trio de robôs músicos em palco nordestino cheio de bandeirinhas brilhantes',
      ],
    },
  },
  {
    id: 'coruja-professora',
    title: 'Coruja Cientista das Galáxias',
    category: 'Ciência & Química',
    difficulty: 'Fácil',
    imageUrl: '/challenges/coruja-professora.webp',
    fullPrompt:
      'Uma coruja sábia e fofa usando óculos redondos dourados e jaleco branco de cientista fazendo um experimento químico que cria pequenas galáxias e estrelas dentro de tubos de ensaio, ilustração digital mágica e detalhada',
    subjectLayer: 'Uma coruja sábia e fofa usando óculos redondos dourados e jaleco branco de cientista',
    styleLayer: 'ilustração digital mágica e detalhada, brilho cósmico',
    environmentLayer: 'fazendo um experimento químico com pequenas galáxias e estrelas dentro de tubos de ensaio no laboratório',
    hint1: 'Dica de Estilo (60s): Ilustração digital mágica com brilho de estrelas e galáxias!',
    hint2: 'Dica Principal (30s): Uma coruja de óculos e jaleco branco fazendo experimento com tubos de ensaio cósmicos!',
    keywords: {
      subject: [
        {
          concept: 'Coruja sábia de óculos e jaleco branco',
          weight: 0.6,
          synonyms: ['coruja', 'ave', 'passaro', 'oculos', 'jaleco', 'cientista', 'professora', 'sabia', 'fofa'],
        },
        {
          concept: 'Fazendo experimento químico',
          weight: 0.4,
          synonyms: ['experimento', 'quimica', 'ciencia', 'misturando', 'pesquisa'],
        },
      ],
      style: [
        {
          concept: 'Ilustração digital mágica e detalhada',
          weight: 0.65,
          synonyms: ['ilustracao', 'pintura digital', 'magica', 'detalhada', 'fantasia', '3d', 'colorida'],
        },
        {
          concept: 'Brilho de galáxias e estrelas',
          weight: 0.35,
          synonyms: ['galaxias', 'estrelas', 'cosmico', 'brilhante', 'nebulosa', 'luminoso'],
        },
      ],
      environment: [
        {
          concept: 'Laboratório com tubos de ensaio e frascos',
          weight: 0.7,
          synonyms: ['laboratorio', 'tubos de ensaio', 'frascos', 'bequer', 'vidraria', 'mesa', 'bancada'],
        },
        {
          concept: 'Universo dentro dos tubos',
          weight: 0.3,
          synonyms: ['universo', 'espaco', 'pocao', 'fumaca estrelada'],
        },
      ],
      botPrompts: [
        'Uma coruja fofa de óculos redondos e jaleco branco de laboratório fazendo experimento com tubos de ensaio cheios de estrelas e galáxias brilhantes, ilustração digital',
        'Coruja cientista usando jaleco e óculos dourados misturando líquidos cósmicos com constelações em frascos de vidro no laboratório',
        'Ilustração digital mágica de uma coruja professora de química criando pequenas galáxias iluminadas em tubos de ensaio',
      ],
    },
  },
  {
    id: 'onca-neon',
    title: 'Onça-Pintada Cibernética da Floresta',
    category: 'Biodiversidade & Tech',
    difficulty: 'Médio',
    imageUrl: '/challenges/onca-neon.webp',
    fullPrompt:
      'Uma onça-pintada majestosa com manchas que brilham como circuitos de luz ciano e magenta caminhando sobre um tronco na floresta tropical bioluminescente à noite, arte conceitual sci-fi épica',
    subjectLayer: 'Uma onça-pintada majestosa com manchas que brilham como circuitos de luz ciano e magenta',
    styleLayer: 'arte conceitual sci-fi épica, iluminação bioluminescente de alto contraste',
    environmentLayer: 'caminhando sobre um tronco na floresta tropical bioluminescente à noite',
    hint1: 'Dica de Estilo (60s): Arte conceitual sci-fi com circuitos luminosos ciano e magenta!',
    hint2: 'Dica Principal (30s): Uma onça-pintada com manchas de circuitos neon caminhando na floresta à noite!',
    keywords: {
      subject: [
        {
          concept: 'Onça-pintada majestosa',
          weight: 0.55,
          synonyms: ['onca', 'onca-pintada', 'jaguar', 'felino', 'pantera', 'leopardo', 'animal'],
        },
        {
          concept: 'Manchas de circuitos neon ciano e magenta',
          weight: 0.45,
          synonyms: ['circuitos', 'manchas brilhantes', 'neon', 'ciano', 'azul', 'rosa', 'magenta', 'cibernetica', 'tecnologica'],
        },
      ],
      style: [
        {
          concept: 'Arte conceitual sci-fi épica',
          weight: 0.6,
          synonyms: ['arte conceitual', 'concept art', 'sci-fi', 'epica', 'digital', 'realista', 'ilustracao'],
        },
        {
          concept: 'Plantas e luzes bioluminescentes',
          weight: 0.4,
          synonyms: ['bioluminescente', 'brilhante', 'luminosa', 'luzes neon', 'fluorescente'],
        },
      ],
      environment: [
        {
          concept: 'Floresta tropical / Amazônia à noite',
          weight: 0.7,
          synonyms: ['floresta', 'selva', 'amazonia', 'mata', 'arvores', 'tronco', 'noite', 'noturna', 'plantas'],
        },
        {
          concept: 'Névoa e atmosfera mística',
          weight: 0.3,
          synonyms: ['nevoa', 'mistica', 'natureza', 'rio'],
        },
      ],
      botPrompts: [
        'Uma onça-pintada com manchas brilhando em formato de circuitos neon azul e rosa caminhando na floresta amazônica bioluminescente à noite, arte conceitual sci-fi',
        'Ilustração digital épica de uma onça cibernética com luzes ciano e magenta no corpo andando sobre um tronco na selva iluminada',
        'Onça-pintada tecnológica com padrões de circuito luminosos em meio a plantas bioluminescentes na floresta noturna',
      ],
    },
  },
  {
    id: 'trem-lencois',
    title: 'Expresso Solar nos Lençóis Maranhenses',
    category: 'Maranhão do Futuro',
    difficulty: 'Difícil',
    imageUrl: '/challenges/trem-lencois.webp',
    fullPrompt:
      'Um trem expresso futurista de vidro levitando sobre as dunas brancas e lagoas azul-turquesa dos Lençóis Maranhenses durante um pôr do sol rosa e dourado, estilo ilustração de anime cinematográfico',
    subjectLayer: 'Um trem expresso futurista de vidro levitando em trilhos de luz',
    styleLayer: 'estilo ilustração de anime cinematográfico, cores vibrantes de pôr do sol rosa e dourado',
    environmentLayer: 'sobre as dunas brancas e lagoas azul-turquesa dos Lençóis Maranhenses',
    hint1: 'Dica de Estilo (60s): Ilustração estilo anime cinematográfico com pôr do sol rosa e dourado!',
    hint2: 'Dica Principal (30s): Um trem futurista levitando sobre as dunas e lagoas dos Lençóis Maranhenses!',
    keywords: {
      subject: [
        {
          concept: 'Trem expresso futurista levitando',
          weight: 0.65,
          synonyms: ['trem', 'expresso', 'metrô', 'locomotiva', 'futurista', 'levitando', 'voador', 'flutuando', 'vidro', 'trilhos de luz'],
        },
        {
          concept: 'Design aerodinâmico moderno',
          weight: 0.35,
          synonyms: ['moderno', 'aerodinamico', 'alta velocidade', 'branco', 'tecnologico'],
        },
      ],
      style: [
        {
          concept: 'Estilo anime cinematográfico (Makoto Shinkai / Ghibli)',
          weight: 0.6,
          synonyms: ['anime', 'ilustracao', 'cinematografico', 'pintura digital', 'animacao japonesa', 'vibrante'],
        },
        {
          concept: 'Pôr do sol rosa, roxo e dourado',
          weight: 0.4,
          synonyms: ['por do sol', 'entardecer', 'rosa', 'dourado', 'nuvens coloridas', 'reflexo na agua'],
        },
      ],
      environment: [
        {
          concept: 'Dunas brancas e lagoas dos Lençóis Maranhenses',
          weight: 0.75,
          synonyms: ['lencois maranhenses', 'dunas', 'areia branca', 'lagoas', 'agua cristalina', 'turquesa', 'maranhao', 'deserto com lagoas'],
        },
        {
          concept: 'Reflexo espelhado na água',
          weight: 0.25,
          synonyms: ['reflexo', 'espelho dagua', 'horizonte', 'ceu'],
        },
      ],
      botPrompts: [
        'Um trem futurista de vidro levitando sobre as dunas brancas e lagoas cristalinas dos Lençóis Maranhenses no pôr do sol rosa e dourado, estilo anime cinematográfico',
        'Ilustração estilo anime de um expresso voador cruzando as lagoas azul-turquesa e dunas de areia dos Lençóis Maranhenses ao entardecer',
        'Trem tecnológico flutuando em trilhos de luz sobre as dunas e lagoas do Maranhão sob um céu rosa e dourado vibrante',
      ],
    },
  },
  {
    id: 'arara-dj-carnaval',
    title: 'Arara-Azul DJ no Trio Elétrico Futurista',
    category: 'Brasilidades & Música',
    difficulty: 'Fácil',
    imageUrl: '/challenges/arara_dj_carnaval.webp',
    fullPrompt:
      'Uma arara-azul cibernética usando óculos espelhados e fones de ouvido neon tocando em uma mesa de DJ flutuante sobre um trio elétrico futurista com confetes holográficos voando, estética synthwave brasileira em 3D estilo animação Pixar',
    subjectLayer:
      'Uma arara-azul cibernética usando óculos espelhados e fones de ouvido neon tocando em uma mesa de DJ flutuante',
    styleLayer:
      'estética synthwave brasileira em 3D estilo animação Pixar, cores saturadas e iluminação de palco',
    environmentLayer:
      'sobre um trio elétrico futurista com confetes holográficos e serpentinas luminosas no céu',
    hint1:
      'Dica de Estilo (60s): Animação 3D estilo Pixar com estética synthwave brasileira e confetes holográficos!',
    hint2:
      'Dica Principal (30s): Uma arara-azul de óculos e fones neon tocando como DJ em um trio elétrico futurista!',
    keywords: {
      subject: [
        {
          concept: 'Arara-azul cibernética de óculos e fones neon',
          weight: 0.6,
          synonyms: ['arara', 'arara azul', 'passaro', 'ave', 'oculos', 'fones', 'headphone', 'neon', 'cibernetica'],
        },
        {
          concept: 'Tocando em mesa de DJ flutuante',
          weight: 0.4,
          synonyms: ['dj', 'mesa de dj', 'tocando', 'musica', 'mixando', 'controladora', 'som'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D estilo Pixar / Synthwave brasileiro',
          weight: 0.6,
          synonyms: ['3d', 'pixar', 'animacao', 'synthwave', 'colorido', 'vibrante', 'render 3d'],
        },
        {
          concept: 'Iluminação de palco e brilho neon',
          weight: 0.4,
          synonyms: ['palco', 'holofotes', 'luzes', 'brilhante', 'saturado'],
        },
      ],
      environment: [
        {
          concept: 'Trio elétrico futurista de carnaval',
          weight: 0.55,
          synonyms: ['trio eletrico', 'carnaval', 'festa', 'caminhao de som', 'palco flutuante', 'festival'],
        },
        {
          concept: 'Confetes holográficos e serpentinas',
          weight: 0.45,
          synonyms: ['confetes', 'serpentinas', 'holograficos', 'voando', 'ceu', 'festa'],
        },
      ],
      botPrompts: [
        'Uma arara-azul estilosa de óculos de sol e fones neon tocando como DJ em cima de um trio elétrico futurista com confetes brilhantes, animação 3D Pixar',
        'Render 3D vibrante de uma arara DJ mixando som num palco de carnaval futurista cheio de luzes neon e confetes',
        'Arara-azul cibernética comandando uma mesa de DJ flutuante com estética synthwave brasileira em 3D',
      ],
    },
  },
  {
    id: 'guaxinim-chef-sushi',
    title: 'Guaxinim Mestre Cuca em Tóquio Cyberpunk',
    category: 'Gastronomia & Sci-Fi',
    difficulty: 'Médio',
    imageUrl: '/challenges/guaxinim_chef_sushi.webp',
    fullPrompt:
      'Um guaxinim fofo vestido de chef tradicional japonês preparando sushis brilhantes e ramen fumegante em uma barraca de rua flutuante de Tóquio cyberpunk sob chuva fina, lanternas de papel vermelhas refletindo, estilo animação 3D Ghibli e Pixar',
    subjectLayer:
      'Um guaxinim fofo vestido de chef tradicional japonês preparando sushis brilhantes e ramen fumegante',
    styleLayer:
      'estilo animação 3D estúdio Ghibli e Pixar, iluminação quente e aconchegante',
    environmentLayer:
      'em uma barraca de rua flutuante de Tóquio cyberpunk sob chuva fina com lanternas de papel vermelhas',
    hint1:
      'Dica de Estilo (60s): Animação 3D aconchegante unindo estética Ghibli e Pixar com luzes de lanternas!',
    hint2:
      'Dica Principal (30s): Um guaxinim chef preparando sushi e ramen numa barraca de rua em Tóquio cyberpunk!',
    keywords: {
      subject: [
        {
          concept: 'Guaxinim fofo vestido de chef japonês',
          weight: 0.55,
          synonyms: ['guaxinim', 'raccoon', 'animal', 'chef', 'cozinheiro', 'mestre cuca', 'japones', 'faixa na cabeca'],
        },
        {
          concept: 'Preparando sushi e ramen fumegante',
          weight: 0.45,
          synonyms: ['sushi', 'ramen', 'lamen', 'macarrao', 'comida japonesa', 'cozinhando', 'preparando', 'tigela', 'hashi'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D Ghibli / Pixar',
          weight: 0.6,
          synonyms: ['3d', 'ghibli', 'pixar', 'animacao', 'fofo', 'detalhado', 'render'],
        },
        {
          concept: 'Iluminação quente e reflexos na chuva',
          weight: 0.4,
          synonyms: ['quente', 'aconchegante', 'reflexo', 'brilhante', 'neon'],
        },
      ],
      environment: [
        {
          concept: 'Barraca de rua em Tóquio cyberpunk sob chuva',
          weight: 0.6,
          synonyms: ['barraca', 'yatai', 'restaurante', 'toquio', 'japao', 'cyberpunk', 'rua', 'chuva', 'noite'],
        },
        {
          concept: 'Lanternas de papel vermelhas',
          weight: 0.4,
          synonyms: ['lanternas', 'papel', 'vermelhas', 'letreiros', 'luminosos'],
        },
      ],
      botPrompts: [
        'Um guaxinim fofo vestido de chef japonês preparando sushi e ramen fumegante numa barraca de rua de Tóquio cyberpunk na chuva com lanternas vermelhas, animação 3D',
        'Animação 3D estilo Pixar e Ghibli de um guaxinim cozinheiro fazendo lamen e sushi sob lanternas japonesas numa noite chuvosa',
        'Guaxinim mestre cuca cozinhando comida japonesa em uma barraca iluminada de rua cyberpunk com chuva fina',
      ],
    },
  },
  {
    id: 'tartaruga-ilha-biblioteca',
    title: 'Tartaruga Celeste da Biblioteca Astral',
    category: 'Fantasia & Conhecimento',
    difficulty: 'Difícil',
    imageUrl: '/challenges/tartaruga_ilha_biblioteca.webp',
    fullPrompt:
      'Uma tartaruga marinha gigante nadando entre as nuvens do pôr do sol carregando no casco uma biblioteca mágica em formato de observatório astronômico com árvores de ipê-roxo e livros voadores, arte conceitual de fantasia épica dourada',
    subjectLayer:
      'Uma tartaruga marinha gigante nadando entre as nuvens carregando no casco uma biblioteca mágica e observatório',
    styleLayer:
      'arte conceitual de fantasia épica, iluminação dourada cinematográfica do pôr do sol',
    environmentLayer:
      'no céu entre nuvens alaranjadas com árvores de ipê-roxo, lanternas douradas e livros voadores',
    hint1:
      'Dica de Estilo (60s): Arte conceitual de fantasia épica com iluminação dourada de pôr do sol!',
    hint2:
      'Dica Principal (30s): Uma tartaruga gigante voando nas nuvens com uma biblioteca e observatório no casco!',
    keywords: {
      subject: [
        {
          concept: 'Tartaruga marinha gigante voadora',
          weight: 0.55,
          synonyms: ['tartaruga', 'tartaruga gigante', 'tartaruga marinha', 'animal gigante', 'casco', 'nadando no ceu', 'voando'],
        },
        {
          concept: 'Biblioteca mágica e observatório no casco',
          weight: 0.45,
          synonyms: ['biblioteca', 'observatorio', 'castelo', 'torre', 'ilha no casco', 'livros', 'telescopio', 'escadarias'],
        },
      ],
      style: [
        {
          concept: 'Arte conceitual de fantasia épica',
          weight: 0.6,
          synonyms: ['fantasia', 'epica', 'arte conceitual', 'pintura digital', 'magica', 'surreal', 'ilustracao'],
        },
        {
          concept: 'Iluminação dourada do pôr do sol',
          weight: 0.4,
          synonyms: ['dourada', 'por do sol', 'entardecer', 'quente', 'cinematografica', 'luz solar'],
        },
      ],
      environment: [
        {
          concept: 'Nuvens do céu e livros voadores',
          weight: 0.55,
          synonyms: ['nuvens', 'ceu', 'voando', 'flutuando', 'livros voadores', 'paginas'],
        },
        {
          concept: 'Árvores de ipê-roxo e lanternas',
          weight: 0.45,
          synonyms: ['ipe', 'arvore roxa', 'arvores', 'flores roxas', 'lanternas', 'natureza'],
        },
      ],
      botPrompts: [
        'Uma tartaruga gigante nadando entre as nuvens no pôr do sol carregando uma biblioteca mágica e observatório com árvores roxas nas costas, fantasia épica',
        'Pintura digital de fantasia mostrando uma tartaruga voadora com uma ilha de livros e observatório astronômico no casco sob luz dourada',
        'Tartaruga marinha colossal flutuando no céu dourado com uma biblioteca encantada, árvores de ipê e livros voando ao redor',
      ],
    },
  },
  {
    id: 'preguica-gamer-espaco',
    title: 'Preguiça Streamer na Estação Espacial',
    category: 'Games & Espaço',
    difficulty: 'Fácil',
    imageUrl: '/challenges/preguica_gamer_espaco.webp',
    fullPrompt:
      'Um bicho-preguiça carismático usando headset gamer RGB flutuando em gravidade zero dentro de uma cabine espacial repleta de monitores holográficos, controles de videogame e fatias de pizza flutuando com a Terra ao fundo, renderização 3D Octane neon',
    subjectLayer:
      'Um bicho-preguiça carismático usando headset gamer RGB jogando videogame em gravidade zero',
    styleLayer:
      'renderização 3D Octane ultra detalhada, iluminação roxo e magenta neon vibrante',
    environmentLayer:
      'dentro de uma cabine espacial com monitores holográficos, fatias de pizza flutuando e a Terra na janela',
    hint1:
      'Dica de Estilo (60s): Renderização 3D ultra detalhada com iluminação gamer RGB em tons roxo e magenta!',
    hint2:
      'Dica Principal (30s): Um bicho-preguiça de headset gamer jogando na estação espacial com pizzas flutuando!',
    keywords: {
      subject: [
        {
          concept: 'Bicho-preguiça com headset gamer RGB',
          weight: 0.6,
          synonyms: ['preguica', 'bicho preguica', 'animal', 'gamer', 'streamer', 'headset', 'fone de ouvido', 'controle', 'jogando'],
        },
        {
          concept: 'Flutuando em gravidade zero',
          weight: 0.4,
          synonyms: ['flutuando', 'gravidade zero', 'espaco', 'voando', 'relaxado'],
        },
      ],
      style: [
        {
          concept: 'Renderização 3D Octane detalhada',
          weight: 0.6,
          synonyms: ['3d', 'octane', 'render', 'animacao 3d', 'detalhado', 'pixar'],
        },
        {
          concept: 'Luzes RGB roxo e magenta neon',
          weight: 0.4,
          synonyms: ['rgb', 'neon', 'roxo', 'rosa', 'magenta', 'iluminacao gamer', 'colorido'],
        },
      ],
      environment: [
        {
          concept: 'Cabine espacial com monitores e Terra na janela',
          weight: 0.6,
          synonyms: ['nave', 'estacao espacial', 'cabine', 'monitores', 'telas holograficas', 'terra', 'planeta', 'janela'],
        },
        {
          concept: 'Fatias de pizza e controles flutuando',
          weight: 0.4,
          synonyms: ['pizza', 'fatias de pizza', 'comida flutuando', 'controles', 'joystick'],
        },
      ],
      botPrompts: [
        'Um bicho-preguiça usando fone headset gamer RGB jogando em gravidade zero dentro de uma nave espacial com pizzas e telas flutuando, render 3D neon',
        'Renderização 3D de uma preguiça gamer flutuando na estação espacial cercada por monitores holográficos, controles e fatias de pizza com a Terra na janela',
        'Bicho-preguiça streamer jogando videogame no espaço com iluminação roxa e rosa neon e pizzas voando sem gravidade',
      ],
    },
  },
  {
    id: 'caravela-voadora-sao-luis',
    title: 'Galeão Solar sobre os Azulejos de São Luís',
    category: 'Maranhão & Solarpunk',
    difficulty: 'Médio',
    imageUrl: '/challenges/caravela_voadora_sao_luis.webp',
    fullPrompt:
      'Um galeão histórico com velas solares douradas e propulsores mágicos voando sobre os telhados coloniais e fachadas de azulejos portugueses do centro histórico de São Luís do Maranhão ao entardecer, estética solarpunk fantástica em pintura digital',
    subjectLayer:
      'Um galeão histórico voador com velas solares douradas e propulsores luminosos',
    styleLayer:
      'estética solarpunk fantástica, pintura digital vibrante e rica em detalhes ao entardecer',
    environmentLayer:
      'sobre os telhados coloniais e fachadas de azulejos do centro histórico de São Luís do Maranhão',
    hint1:
      'Dica de Estilo (60s): Pintura digital solarpunk fantástica com luz dourada de entardecer!',
    hint2:
      'Dica Principal (30s): Um navio galeão voador com velas solares sobre os casarões de azulejos de São Luís!',
    keywords: {
      subject: [
        {
          concept: 'Galeão / Caravela voadora com velas solares',
          weight: 0.65,
          synonyms: ['galeao', 'caravela', 'navio', 'barco voador', 'navio voador', 'velas douradas', 'velas solares', 'propulsores'],
        },
        {
          concept: 'Navegando pelo céu',
          weight: 0.35,
          synonyms: ['voando', 'flutuando', 'ceu', 'nuvens', 'gaivotas'],
        },
      ],
      style: [
        {
          concept: 'Estética solarpunk fantástica em pintura digital',
          weight: 0.65,
          synonyms: ['solarpunk', 'steamer', 'fantasia', 'pintura digital', 'ilustracao', 'vibrante', 'detalhado'],
        },
        {
          concept: 'Luz dourada de entardecer',
          weight: 0.35,
          synonyms: ['entardecer', 'por do sol', 'dourado', 'quente', 'luminoso'],
        },
      ],
      environment: [
        {
          concept: 'Centro Histórico de São Luís e fachadas de azulejos',
          weight: 0.7,
          synonyms: ['sao luis', 'maranhao', 'centro historico', 'casaroes', 'colonial', 'telhados', 'azulejos', 'cidade historica'],
        },
        {
          concept: 'Gaivotas luminosas e baía ao fundo',
          weight: 0.3,
          synonyms: ['gaivotas', 'passaros', 'mar', 'baia', 'rua de pedra'],
        },
      ],
      botPrompts: [
        'Um navio galeão voador com velas solares douradas sobrevoando os casarões coloniais e azulejos do centro histórico de São Luís no pôr do sol, pintura digital solarpunk',
        'Ilustração fantástica solarpunk de uma caravela voadora iluminada passando sobre os telhados históricos de São Luís do Maranhão ao entardecer',
        'Barco antigo com velas douradas tecnológicas voando no céu sobre a arquitetura colonial maranhense com gaivotas ao redor',
      ],
    },
  },
  {
    id: 'polvo-maestro-orquestra',
    title: 'Polvo Maestro da Sinfonia Bioluminescente',
    category: 'Oceano & Música',
    difficulty: 'Médio',
    imageUrl: '/challenges/polvo_maestro_orquestra.webp',
    fullPrompt:
      'Um polvo elegante vestindo fraque de gala regendo uma orquestra sinfônica subaquática com oito batutas luminosas ao mesmo tempo, instrumentos feitos de corais bioluminescentes e conchas douradas no fundo do oceano, renderização 3D mágica',
    subjectLayer:
      'Um polvo elegante vestindo fraque de gala regendo uma orquestra com oito batutas luminosas',
    styleLayer:
      'renderização 3D mágica e cinematográfica, feixes de luz solar e brilho bioluminescente',
    environmentLayer:
      'no fundo do oceano com instrumentos musicais feitos de corais brilhantes e conchas douradas',
    hint1:
      'Dica de Estilo (60s): Renderização 3D mágica e cinematográfica no fundo do mar com brilho bioluminescente!',
    hint2:
      'Dica Principal (30s): Um polvo de fraque regendo uma orquestra subaquática com 8 batutas luminosas!',
    keywords: {
      subject: [
        {
          concept: 'Polvo elegante de fraque regendo como maestro',
          weight: 0.6,
          synonyms: ['polvo', 'octopus', 'maestro', 'regente', 'fraque', 'terno', 'elegante', 'regendo'],
        },
        {
          concept: 'Oito batutas luminosas nos tentáculos',
          weight: 0.4,
          synonyms: ['batutas', 'tentaculos', 'varinhas', 'luminosas', 'oito', 'musica', 'orquestra', 'sinfonia'],
        },
      ],
      style: [
        {
          concept: 'Renderização 3D mágica e cinematográfica',
          weight: 0.6,
          synonyms: ['3d', 'render', 'animacao', 'pixar', 'cinematografico', 'magico', 'detalhado'],
        },
        {
          concept: 'Bioluminescência e feixes de luz solar na água',
          weight: 0.4,
          synonyms: ['bioluminescente', 'brilhante', 'feixes de luz', 'luz solar', 'colorido', 'neon'],
        },
      ],
      environment: [
        {
          concept: 'Fundo do oceano / Anfiteatro subaquático',
          weight: 0.55,
          synonyms: ['fundo do mar', 'oceano', 'subaquatico', 'agua', 'mar', 'recife', 'bolhas'],
        },
        {
          concept: 'Instrumentos de corais e conchas douradas',
          weight: 0.45,
          synonyms: ['instrumentos', 'corais', 'conchas', 'harpa', 'violino', 'douradas', 'orquestra'],
        },
      ],
      botPrompts: [
        'Um polvo elegante de fraque regendo uma orquestra no fundo do mar segurando batutas luminosas nos tentáculos cercado por corais brilhantes, animação 3D',
        'Renderização 3D mágica de um polvo maestro conduzindo uma sinfonia subaquática com instrumentos de conchas douradas e corais bioluminescentes',
        'Polvo maestro vestindo terno de gala regendo música no oceano iluminado por feixes de luz e corais coloridos',
      ],
    },
  },
  {
    id: 'lhama-astronauta-andes',
    title: 'Lhama Astronauta nos Andes Cósmicos',
    category: 'América Latina & Espaço',
    difficulty: 'Fácil',
    imageUrl: '/challenges/lhama_astronauta_andes.webp',
    fullPrompt:
      'Uma lhama simpática vestindo traje espacial colorido com poncho tradicional andino holográfico tirando uma selfie no topo de uma montanha cristalina sob uma aurora boreal roxa e dourada com planetas gigantes no céu, estilo animação 3D Pixar vibrante',
    subjectLayer:
      'Uma lhama simpática vestindo traje espacial colorido com poncho andino holográfico tirando uma selfie',
    styleLayer:
      'estilo animação 3D Pixar vibrante, iluminação cinematográfica roxa e dourada',
    environmentLayer:
      'no topo de uma montanha cristalina sob aurora boreal e planetas gigantes no céu',
    hint1:
      'Dica de Estilo (60s): Animação 3D estilo Pixar sob aurora boreal roxa e dourada com planetas no céu!',
    hint2:
      'Dica Principal (30s): Uma lhama astronauta de poncho andino tirando selfie no topo da montanha!',
    keywords: {
      subject: [
        {
          concept: 'Lhama astronauta com poncho andino',
          weight: 0.6,
          synonyms: ['lhama', 'alpaca', 'animal', 'astronauta', 'traje espacial', 'poncho', 'andino', 'capacete'],
        },
        {
          concept: 'Tirando uma selfie sorrindo',
          weight: 0.4,
          synonyms: ['selfie', 'foto', 'camera', 'celular', 'sorrindo', 'posando'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D Pixar vibrante',
          weight: 0.6,
          synonyms: ['3d', 'pixar', 'animacao', 'render', 'colorido', 'vibrante', 'fofo'],
        },
        {
          concept: 'Brilho de aurora boreal roxa e dourada',
          weight: 0.4,
          synonyms: ['aurora', 'roxo', 'dourado', 'holografico', 'luminoso', 'cinematografico'],
        },
      ],
      environment: [
        {
          concept: 'Topo de montanha cristalina / Cordilheira dos Andes',
          weight: 0.55,
          synonyms: ['montanha', 'andes', 'pico', 'neve', 'cristal', 'rochas', 'cordilheira'],
        },
        {
          concept: 'Planetas gigantes e estrelas no céu',
          weight: 0.45,
          synonyms: ['planetas', 'aneis', 'ceu estrelado', 'espaco', 'cosmos', 'aurora boreal'],
        },
      ],
      botPrompts: [
        'Uma lhama simpática de traje espacial e poncho colorido tirando uma selfie no topo de uma montanha com aurora boreal e planetas no céu, animação 3D Pixar',
        'Render 3D vibrante de uma lhama astronauta sorrindo para uma foto nas montanhas sob um céu cósmico roxo e dourado',
        'Lhama vestindo roupa de astronauta com poncho tradicional no alto da cordilheira com planetas gigantes ao fundo',
      ],
    },
  },
  {
    id: 'raposa-relojoeira-steampunk',
    title: 'Raposa Relojoeira do Tempo Quântico',
    category: 'Steampunk & Invenções',
    difficulty: 'Médio',
    imageUrl: '/challenges/raposa_relojoeira_steampunk.webp',
    fullPrompt:
      'Uma raposa vermelha inteligente usando monóculo de latão e colete vitoriano ajustando engrenagens douradas flutuantes de um grande relógio astronômico em uma oficina steampunk iluminada por lâmpadas de filamento âmbar, pintura digital detalhada',
    subjectLayer:
      'Uma raposa vermelha inteligente usando monóculo de latão e colete vitoriano ajustando engrenagens douradas flutuantes',
    styleLayer:
      'pintura digital detalhada em estética steampunk, iluminação quente de filamento âmbar e dourado',
    environmentLayer:
      'em uma oficina relojoeira repleta de relógios astronômicos antigos e ferramentas de bronze',
    hint1:
      'Dica de Estilo (60s): Pintura digital em estética Steampunk com engrenagens douradas e luz âmbar!',
    hint2:
      'Dica Principal (30s): Uma raposa de monóculo e colete consertando um relógio astronômico flutuante!',
    keywords: {
      subject: [
        {
          concept: 'Raposa vermelha de monóculo e colete vitoriano',
          weight: 0.6,
          synonyms: ['raposa', 'animal', 'monoculo', 'oculos', 'lupa', 'colete', 'relojoeiro', 'inventora'],
        },
        {
          concept: 'Ajustando engrenagens douradas flutuantes',
          weight: 0.4,
          synonyms: ['engrenagens', 'relogio', 'mecanismo', 'douradas', 'consertando', 'ajustando', 'flutuantes'],
        },
      ],
      style: [
        {
          concept: 'Estética Steampunk em pintura digital',
          weight: 0.65,
          synonyms: ['steampunk', 'pintura digital', 'vitoriano', 'latao', 'bronze', 'retrofuturista', 'ilustracao'],
        },
        {
          concept: 'Luz quente âmbar e dourada',
          weight: 0.35,
          synonyms: ['ambar', 'dourada', 'quente', 'lampadas', 'filamento', 'aconchegante'],
        },
      ],
      environment: [
        {
          concept: 'Oficina de relógios astronômicos',
          weight: 0.65,
          synonyms: ['oficina', 'laboratorio', 'atelier', 'relogios', 'astronomico', 'bancada', 'ferramentas'],
        },
        {
          concept: 'Partículas de luz e magia temporal',
          weight: 0.35,
          synonyms: ['tempo', 'ponteiros', 'brilho', 'magia'],
        },
      ],
      botPrompts: [
        'Uma raposa vermelha usando monóculo e colete steampunk ajustando engrenagens douradas flutuantes de um relógio astronômico em uma oficina iluminada, pintura digital',
        'Ilustração digital steampunk de uma raposa relojoeira trabalhando em mecanismos de bronze e relógios antigos sob luz âmbar',
        'Raposa inventora com lupa de latão montando um grande relógio mágico cheio de engrenagens brilhantes',
      ],
    },
  },
  {
    id: 'boto-cor-de-rosa-synthwave',
    title: 'Boto-Cor-de-Rosa no Rio Synthwave',
    category: 'Amazônia & Retrô-Futurismo',
    difficulty: 'Médio',
    imageUrl: '/challenges/boto_cor_de_rosa_synthwave.webp',
    fullPrompt:
      'Um boto-cor-de-rosa cibernético usando chapéu panamá iluminado por neon saltando alegremente para fora de um rio amazônico espelhado sob um sol gradeado synthwave roxo, rosa e dourado ao entardecer, estilo arte retrô-futurista anos 80 vibrante',
    subjectLayer:
      'Um boto-cor-de-rosa cibernético usando chapéu panamá de neon saltando para fora da água',
    styleLayer:
      'estilo arte retrô-futurista synthwave anos 80 vibrante, cores roxo, rosa choque e dourado',
    environmentLayer:
      'sobre um rio amazônico espelhado sob um grande sol gradeado luminoso ao entardecer',
    hint1:
      'Dica de Estilo (60s): Arte retrô-futurista Synthwave anos 80 com sol gradeado roxo, rosa e dourado!',
    hint2:
      'Dica Principal (30s): Um boto-cor-de-rosa de chapéu neon saltando para fora de um rio amazônico!',
    keywords: {
      subject: [
        {
          concept: 'Boto-cor-de-rosa com chapéu panamá neon',
          weight: 0.6,
          synonyms: ['boto', 'boto cor de rosa', 'golfinho', 'golfinho rosa', 'chapeu', 'panama', 'malandro', 'cibernetico'],
        },
        {
          concept: 'Saltando para fora da água',
          weight: 0.4,
          synonyms: ['saltando', 'pulando', 'mergulhando', 'respingos', 'agua', 'acrobacia'],
        },
      ],
      style: [
        {
          concept: 'Arte Synthwave / Vaporwave retrô anos 80',
          weight: 0.65,
          synonyms: ['synthwave', 'vaporwave', 'retro', 'anos 80', 'outrun', 'neon', 'futurista'],
        },
        {
          concept: 'Paleta rosa choque, roxo e dourado',
          weight: 0.35,
          synonyms: ['rosa', 'roxo', 'magenta', 'dourado', 'vibrante', 'brilhante'],
        },
      ],
      environment: [
        {
          concept: 'Rio amazônico espelhado com vitórias-régias',
          weight: 0.55,
          synonyms: ['rio', 'amazonia', 'amazonico', 'floresta', 'agua espelhada', 'vitoria regia', 'palmeiras'],
        },
        {
          concept: 'Sol gradeado no horizonte ao pôr do sol',
          weight: 0.45,
          synonyms: ['sol', 'por do sol', 'grade', 'horizonte', 'entardecer'],
        },
      ],
      botPrompts: [
        'Um boto-cor-de-rosa usando chapéu iluminado por neon saltando de um rio amazônico diante de um sol synthwave roxo e dourado, arte retrô anos 80',
        'Ilustração synthwave vibrante de um boto rosa cibernético pulando fora da água com floresta e sol neon ao fundo',
        'Boto-cor-de-rosa estiloso de chapéu saltando sobre o rio espelhado no pôr do sol retrô-futurista',
      ],
    },
  },
  {
    id: 'panda-quimico-bambu',
    title: 'Panda Cientista no Laboratório de Bambu',
    category: 'Ciência & Natureza',
    difficulty: 'Fácil',
    imageUrl: '/challenges/panda_quimico_bambu.webp',
    fullPrompt:
      'Um urso panda fofo de óculos de proteção e jaleco branco fazendo um experimento químico que cria nuvens coloridas em formato de estrelas dentro de uma estufa tecnológica cheia de bambus gigantes iluminados, estilo animação 3D Pixar',
    subjectLayer:
      'Um urso panda fofo de óculos de proteção e jaleco branco fazendo um experimento químico colorido',
    styleLayer:
      'estilo animação 3D Pixar alegre e vibrante, iluminação mágica e detalhada',
    environmentLayer:
      'dentro de uma estufa tecnológica de vidro cheia de bambus gigantes e nuvens de estrelas',
    hint1:
      'Dica de Estilo (60s): Animação 3D alegre estilo Pixar com fumaça colorida em formato de estrelas!',
    hint2:
      'Dica Principal (30s): Um urso panda de jaleco e óculos fazendo experimento químico num laboratório de bambu!',
    keywords: {
      subject: [
        {
          concept: 'Urso panda de jaleco branco e óculos de proteção',
          weight: 0.6,
          synonyms: ['panda', 'urso panda', 'cientista', 'quimico', 'jaleco', 'oculos', 'fofo'],
        },
        {
          concept: 'Experimento químico com nuvens de estrelas',
          weight: 0.4,
          synonyms: ['experimento', 'quimica', 'frascos', ' bequer', 'tubo de ensaio', 'nuvens', 'estrelas', 'fumaca colorida'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D Pixar vibrante',
          weight: 0.65,
          synonyms: ['3d', 'pixar', 'animacao', 'disney', 'render', 'colorido', 'fofo'],
        },
        {
          concept: 'Brilho colorido das poções e estrelas',
          weight: 0.35,
          synonyms: ['brilhante', 'magico', 'colorido', 'iluminado', 'alegre'],
        },
      ],
      environment: [
        {
          concept: 'Estufa tecnológica com bambus gigantes',
          weight: 0.7,
          synonyms: ['bambu', 'floresta de bambu', 'estufa', 'laboratorio', 'plantas', 'vidro', 'natureza'],
        },
        {
          concept: 'Bancada científica moderna',
          weight: 0.3,
          synonyms: ['bancada', 'mesa', 'vidrarias', 'ciencia'],
        },
      ],
      botPrompts: [
        'Um urso panda fofo de jaleco branco e óculos fazendo um experimento químico que solta nuvens de estrelas coloridas num laboratório cercado de bambus, animação 3D Pixar',
        'Render 3D estilo Pixar de um panda cientista misturando líquidos brilhantes dentro de uma estufa tecnológica de bambu',
        'Panda químico sorridente criando fumaça colorida com estrelas em tubos de ensaio numa sala cheia de bambus verdes',
      ],
    },
  },
  {
    id: 'canguru-boxeador-arcade',
    title: 'Canguru Campeão no Ringue Arcade',
    category: 'Esporte & Fliperama',
    difficulty: 'Médio',
    imageUrl: '/challenges/canguru_boxeador_arcade.webp',
    fullPrompt:
      'Um canguru atlético e carismático usando luvas de boxe energizadas por raios azuis e jaqueta esportiva brilhante dentro de um ringue de fliperama futurista cercado por placares holográficos de pontuação, estilo ilustração 3D de videogame arcade neon',
    subjectLayer:
      'Um canguru atlético usando luvas de boxe com raios azuis e jaqueta esportiva brilhante',
    styleLayer:
      'estilo ilustração 3D estilizada de videogame arcade, cores neon vibrantes e raios de energia',
    environmentLayer:
      'dentro de um ringue futurista cercado por placares holográficos de fliperama e luzes de arena',
    hint1:
      'Dica de Estilo (60s): Visual 3D estilizado de videogame Arcade com raios azuis e placares holográficos!',
    hint2:
      'Dica Principal (30s): Um canguru boxeador com luvas elétricas dentro de um ringue futurista!',
    keywords: {
      subject: [
        {
          concept: 'Canguru boxeador com luvas elétricas',
          weight: 0.65,
          synonyms: ['canguru', 'animal', 'boxeador', 'lutador', 'luvas de boxe', 'raios', 'eletrico', 'jaqueta'],
        },
        {
          concept: 'Pose de campeão no combate',
          weight: 0.35,
          synonyms: ['campeao', 'luta', 'boxe', 'esporte', 'atletico', 'energia'],
        },
      ],
      style: [
        {
          concept: 'Ilustração 3D estilizada de videogame Arcade',
          weight: 0.6,
          synonyms: ['arcade', 'fliperama', 'videogame', '3d', 'estilizado', 'jogo de luta', 'neon'],
        },
        {
          concept: 'Efeitos de raios azuis e luzes vibrantes',
          weight: 0.4,
          synonyms: ['raios', 'azul', 'choque', 'brilhante', 'vibrante', 'laser'],
        },
      ],
      environment: [
        {
          concept: 'Ringue futurista com placares holográficos',
          weight: 0.7,
          synonyms: ['ringue', 'arena', 'estadio', 'cordas neon', 'placar', 'holografico', 'highscore', 'torcida'],
        },
        {
          concept: 'Holofotes de arena de e-sports',
          weight: 0.3,
          synonyms: ['holofotes', 'palco', 'luzes', 'torneio'],
        },
      ],
      botPrompts: [
        'Um canguru boxeador usando luvas com raios elétricos azuis e jaqueta brilhante em um ringue futurista com placares holográficos de fliperama, estilo 3D arcade',
        'Arte 3D de videogame mostrando um canguru lutador de boxe energizado no centro de uma arena neon cheia de telas de pontuação',
        'Canguru campeão com luvas de boxe luminosas num ringue de arcade cyberpunk vibrante',
      ],
    },
  },
  {
    id: 'fenix-cristal-vulcao',
    title: 'Fênix de Cristal sobre o Vulcão de Ametista',
    category: 'Mitologia & Fantasia Épica',
    difficulty: 'Difícil',
    imageUrl: '/challenges/fenix_cristal_vulcao.webp',
    fullPrompt:
      'Uma fênix majestosa feita de cristais translúcidos roxos, rosas e dourados abrindo as asas luminosas sobre a cratera de um vulcão de ametista brilhante sob um céu estrelado, arte conceitual de fantasia épica cinematográfica',
    subjectLayer:
      'Uma fênix majestosa feita de cristais translúcidos roxos, rosas e dourados abrindo as asas luminosas',
    styleLayer:
      'arte conceitual de fantasia épica cinematográfica, iluminação mágica e reflexos cristalinos',
    environmentLayer:
      'sobre a cratera de um vulcão de ametista brilhante sob um céu noturno estrelado',
    hint1:
      'Dica de Estilo (60s): Arte conceitual de fantasia épica com reflexos de cristal roxo, rosa e dourado!',
    hint2:
      'Dica Principal (30s): Uma fênix feita de cristal abrindo as asas sobre um vulcão de ametista!',
    keywords: {
      subject: [
        {
          concept: 'Fênix majestosa feita de cristais translúcidos',
          weight: 0.65,
          synonyms: ['fenix', 'passaro de fogo', 'ave magica', 'cristal', 'cristais', 'vidro', 'diamante', 'ametista', 'asas abertas'],
        },
        {
          concept: 'Brilho roxo, rosa e dourado nas penas',
          weight: 0.35,
          synonyms: ['penas brilhantes', 'luminosa', 'fogo magico', 'energia', 'voando'],
        },
      ],
      style: [
        {
          concept: 'Arte conceitual de fantasia épica cinematográfica',
          weight: 0.6,
          synonyms: ['fantasia', 'epica', 'arte conceitual', 'pintura digital', 'cinematografico', 'realista', 'magico'],
        },
        {
          concept: 'Reflexos translúcidos e partículas de luz',
          weight: 0.4,
          synonyms: ['translucido', 'reflexos', 'brilho', 'roxo', 'dourado', 'rosa'],
        },
      ],
      environment: [
        {
          concept: 'Cratera de vulcão de ametista brilhante',
          weight: 0.65,
          synonyms: ['vulcao', 'cratera', 'montanha', 'ametista', 'lava roxa', 'pedras preciosas', 'rochas de cristal'],
        },
        {
          concept: 'Céu noturno estrelado e nebulosa',
          weight: 0.35,
          synonyms: ['ceu estrelado', 'noite', 'estrelas', 'galaxia', 'cosmos'],
        },
      ],
      botPrompts: [
        'Uma fênix majestosa feita de cristais roxos, rosas e dourados abrindo as asas sobre um vulcão de ametista brilhante sob o céu estrelado, arte conceitual de fantasia',
        'Pintura digital épica de uma ave fênix de cristal translúcido voando acima de uma montanha vulcânica de pedras preciosas roxas à noite',
        'Fênix luminosa esculpida em cristal e ouro renascendo sobre uma cratera de ametista com estrelas ao fundo',
      ],
    },
  },
  {
    id: 'tucano-pintor-aquarela',
    title: 'Tucano Artista no Ateliê das Nuvens',
    category: 'Brasilidades & Belas Artes',
    difficulty: 'Fácil',
    imageUrl: '/challenges/tucano_pintor_aquarela.webp',
    fullPrompt:
      'Um tucano brasileiro carismático usando boina de artista francês e avental colorido pintando um quadro vivo do pôr do sol em um cavalete de madeira sobre uma varanda flutuante entre as nuvens, estilo pintura artística em aquarela e guache vibrante',
    subjectLayer:
      'Um tucano brasileiro usando boina de artista e avental colorido pintando um quadro em um cavalete',
    styleLayer:
      'estilo pintura artística em aquarela e guache vibrante, pinceladas expressivas e alegres',
    environmentLayer:
      'sobre uma varanda flutuante entre as nuvens douradas do pôr do sol com potes de tinta',
    hint1:
      'Dica de Estilo (60s): Pintura artística em aquarela e guache com pinceladas coloridas e vibrantes!',
    hint2:
      'Dica Principal (30s): Um tucano de boina pintando um quadro num cavalete em uma varanda nas nuvens!',
    keywords: {
      subject: [
        {
          concept: 'Tucano brasileiro de boina e avental',
          weight: 0.6,
          synonyms: ['tucano', 'ave', 'passaro', 'bico grande', 'boina', 'pintor', 'artista', 'avental'],
        },
        {
          concept: 'Pintando um quadro no cavalete com pincel',
          weight: 0.4,
          synonyms: ['pintando', 'quadro', 'tela', 'cavalete', 'pincel', 'paleta de cores', 'tinta'],
        },
      ],
      style: [
        {
          concept: 'Pintura em aquarela e guache vibrante',
          weight: 0.65,
          synonyms: ['aquarela', 'guache', 'pintura', 'artistica', 'pinceladas', 'ilustracao', 'colorido', 'vibrante'],
        },
        {
          concept: 'Luz alegre de pôr do sol',
          weight: 0.35,
          synonyms: ['por do sol', 'quente', 'dourado', 'alegre', 'poetico'],
        },
      ],
      environment: [
        {
          concept: 'Varanda / Ateliê flutuante entre as nuvens',
          weight: 0.65,
          synonyms: ['nuvens', 'varanda', 'atelie', 'ceu', 'flutuante', 'nas alturas'],
        },
        {
          concept: 'Potes de tinta e respingos coloridos',
          weight: 0.35,
          synonyms: ['potes de tinta', 'respingos', 'estante', 'flores'],
        },
      ],
      botPrompts: [
        'Um tucano brasileiro usando boina de pintor e avental pintando um quadro num cavalete em uma varanda flutuando nas nuvens do pôr do sol, estilo aquarela vibrante',
        'Ilustração em aquarela e guache de um tucano artista com pincel na asa pintando uma tela colorida no alto das nuvens',
        'Tucano simpático vestido de pintor francês em seu ateliê nas nuvens cercado por tintas e telas coloridas',
      ],
    },
  },
  {
    id: 'hamster-piloto-mecha',
    title: 'Hamster Piloto de Mecha Gigante',
    category: 'Anime & Robótica',
    difficulty: 'Médio',
    imageUrl: '/challenges/hamster_piloto_mecha.webp',
    fullPrompt:
      'Um pequeno hamster corajoso sentado na cabine de comando iluminada de um robô mecha gigante cor-de-rosa e roxo, segurando dois manches de controle com telas de radar holográficas ao redor, estilo ilustração de anime sci-fi cinematográfico',
    subjectLayer:
      'Um pequeno hamster corajoso pilotando controles duplos dentro da cabine de um robô mecha gigante',
    styleLayer:
      'estilo ilustração de anime sci-fi cinematográfico, luzes neon rosa e roxo vibrantes',
    environmentLayer:
      'dentro de um cockpit tecnológico cercado por telas de radar holográficas e painéis luminosos',
    hint1:
      'Dica de Estilo (60s): Ilustração estilo Anime Sci-Fi japonês com telas holográficas rosa e roxo!',
    hint2:
      'Dica Principal (30s): Um pequeno hamster pilotando a cabine de comando de um robô mecha gigante!',
    keywords: {
      subject: [
        {
          concept: 'Pequeno hamster corajoso piloto',
          weight: 0.6,
          synonyms: ['hamster', 'ratinho', 'roedor', 'esquilo', 'porquinho da india', 'piloto', 'capacete', 'fofo'],
        },
        {
          concept: 'Pilotando robô Mecha gigante pelos manches',
          weight: 0.4,
          synonyms: ['mecha', 'robo gigante', 'pilotando', 'manche', 'controles', 'alavancas', 'botoes'],
        },
      ],
      style: [
        {
          concept: 'Estilo Anime Sci-Fi cinematográfico',
          weight: 0.65,
          synonyms: ['anime', 'manga', 'sci-fi', 'ficcao cientifica', 'animacao japonesa', 'ilustracao', 'cinematografico'],
        },
        {
          concept: 'Iluminação neon rosa e roxo',
          weight: 0.35,
          synonyms: ['rosa', 'roxo', 'neon', 'brilhante', 'holografico'],
        },
      ],
      environment: [
        {
          concept: 'Cabine de comando (cockpit) cheia de radares holográficos',
          weight: 0.7,
          synonyms: ['cabine', 'cockpit', 'painel', 'radar', 'telas holograficas', 'monitores', 'interior da nave'],
        },
        {
          concept: 'Visão externa espacial ou tecnológica',
          weight: 0.3,
          synonyms: ['espaco', 'futurista', 'energia', 'hangar'],
        },
      ],
      botPrompts: [
        'Um pequeno hamster corajoso sentado na cabine de comando de um robô mecha gigante rosa e roxo segurando os controles cercado por telas holográficas, estilo anime sci-fi',
        'Ilustração estilo anime japonês de um hamster piloto dentro do cockpit iluminado de um robô gigante cheio de radares',
        'Hamster fofo comandando um mecha tecnológico com painéis neon rosa e roxo em arte de anime cinematográfica',
      ],
    },
  },
  {
    id: 'camaleao-grafiteiro-neon',
    title: 'Camaleão Grafiteiro no Beco Cyberpunk',
    category: 'Arte Urbana & Animação',
    difficulty: 'Médio',
    imageUrl: '/challenges/camaleao_grafiteiro_neon.webp',
    fullPrompt:
      'Um camaleão estiloso que muda de cor segurando latas de spray brilhantes e pintando um mural de grafite holográfico que ganha vida na parede de um beco urbano futurista à noite, estilo animação 3D Spider-Verse vibrante com luzes neon',
    subjectLayer:
      'Um camaleão estiloso multicolorido segurando latas de spray e pintando um grafite luminoso',
    styleLayer:
      'estilo animação 3D Spider-Verse com traços de quadrinhos, cores neon vibrantes e respingos de luz',
    environmentLayer:
      'na parede de tijolos de um beco urbano futurista à noite com um mural holográfico ganhando vida',
    hint1:
      'Dica de Estilo (60s): Animação 3D estilizada tipo Spider-Verse / Aranhaverso com traços gráficos e neon!',
    hint2:
      'Dica Principal (30s): Um camaleão colorido com latas de spray fazendo grafite holográfico num beco!',
    keywords: {
      subject: [
        {
          concept: 'Camaleão estiloso multicolorido',
          weight: 0.6,
          synonyms: ['camaleao', 'lagarto', 'reptil', 'colorido', 'mudando de cor', 'moletom', 'bone'],
        },
        {
          concept: 'Segurando spray e pintando grafite',
          weight: 0.4,
          synonyms: ['grafite', 'graffiti', 'spray', 'lata de tinta', 'pintando', 'mural', 'arte de rua', 'street art'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D estilizada estilo Spider-Verse / Quadrinhos',
          weight: 0.6,
          synonyms: ['spider-verse', 'aranhaverso', '3d estilizado', 'quadrinhos', 'comic', 'halftone', 'animacao', 'vibrante'],
        },
        {
          concept: 'Tinta neon holográfica que brilha no escuro',
          weight: 0.4,
          synonyms: ['neon', 'holografico', 'fluorescente', 'brilhante', 'colorido'],
        },
      ],
      environment: [
        {
          concept: 'Parede de beco urbano futurista à noite',
          weight: 0.65,
          synonyms: ['beco', 'rua', 'muro', 'parede de tijolos', 'cidade', 'urbano', 'noite', 'cyberpunk'],
        },
        {
          concept: 'Mural ganhando vida em luzes',
          weight: 0.35,
          synonyms: ['mural', 'desenho vivo', 'fumaca colorida', 'poças dagua'],
        },
      ],
      botPrompts: [
        'Um camaleão colorido estiloso segurando latas de spray e pintando um grafite neon holográfico na parede de um beco urbano à noite, estilo animação 3D Spider-Verse',
        'Render 3D com traços de quadrinhos mostrando um camaleão grafiteiro fazendo arte de rua brilhante num muro cyberpunk',
        'Camaleão artista urbano de boné pintando um mural fluorescente que ganha vida na noite futurista',
      ],
    },
  },
  {
    id: 'pinguim-surfista-aurora',
    title: 'Pinguim Surfista na Onda de Aurora Boreal',
    category: 'Esporte & Natureza Mágica',
    difficulty: 'Fácil',
    imageUrl: '/challenges/pinguim_surfista_aurora.webp',
    fullPrompt:
      'Um pinguim radical usando óculos de sol espelhados surfando em uma prancha de gelo luminosa sobre uma onda gigante feita de luzes de aurora boreal verde, roxa e rosa no oceano glacial, renderização 3D estilo animação Pixar',
    subjectLayer:
      'Um pinguim radical de óculos de sol espelhados surfando em uma prancha de gelo luminosa',
    styleLayer:
      'renderização 3D estilo animação Pixar vibrante, efeitos mágicos de luz e água',
    environmentLayer:
      'sobre uma onda gigante brilhante de aurora boreal verde, roxa e rosa no oceano glacial',
    hint1:
      'Dica de Estilo (60s): Animação 3D vibrante estilo Pixar com brilhos de aurora boreal verde, roxa e rosa!',
    hint2:
      'Dica Principal (30s): Um pinguim de óculos escuros surfando numa onda gigante feita de aurora boreal!',
    keywords: {
      subject: [
        {
          concept: 'Pinguim radical de óculos de sol',
          weight: 0.6,
          synonyms: ['pinguim', 'ave', 'oculos de sol', 'oculos escuros', 'radical', 'cachecol'],
        },
        {
          concept: 'Surfando em prancha de gelo luminosa',
          weight: 0.4,
          synonyms: ['surfando', 'surfista', 'prancha', 'prancha de surfe', 'gelo', 'manobra'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D estilo Pixar',
          weight: 0.6,
          synonyms: ['3d', 'pixar', 'animacao', 'disney', 'render', 'colorido', 'divertido'],
        },
        {
          concept: 'Brilho mágico de aurora boreal',
          weight: 0.4,
          synonyms: ['aurora boreal', 'verde', 'roxo', 'rosa', 'luminoso', 'neon', 'magico'],
        },
      ],
      environment: [
        {
          concept: 'Onda gigante feita de luz e água no oceano glacial',
          weight: 0.65,
          synonyms: ['onda', 'onda gigante', 'mar', 'oceano', 'glacial', 'artico', 'antartida', 'iceberg'],
        },
        {
          concept: 'Céu estrelado polar ao fundo',
          weight: 0.35,
          synonyms: ['ceu', 'noite estrelada', 'gelo', 'espuma brilhante'],
        },
      ],
      botPrompts: [
        'Um pinguim radical de óculos de sol surfando numa prancha de gelo sobre uma onda gigante iluminada pelas cores da aurora boreal, animação 3D Pixar',
        'Render 3D divertido de um pinguim surfista pegando uma onda mágica verde, roxa e rosa no mar glacial estrelado',
        'Pinguim estiloso surfando sobre águas brilhantes de aurora boreal entre icebergs em estilo animação 3D',
      ],
    },
  },
  {
    id: 'elefante-jardineiro-espacial',
    title: 'Elefante Botânico no Domo de Marte',
    category: 'Ecologia Espacial & Solarpunk',
    difficulty: 'Difícil',
    imageUrl: '/challenges/elefante_jardineiro_espacial.webp',
    fullPrompt:
      'Um pequeno elefante amigável vestindo traje espacial branco e roxo regando flores bioluminescentes gigantes com a tromba dentro de um domo de vidro geodésico na superfície vermelha de Marte com dois sóis no horizonte, ilustração digital solarpunk vibrante',
    subjectLayer:
      'Um pequeno elefante amigável em traje espacial regando flores bioluminescentes gigantes com a tromba',
    styleLayer:
      'ilustração digital solarpunk vibrante, iluminação alienígena suave e plantas luminosas',
    environmentLayer:
      'dentro de um domo de vidro geodésico na superfície vermelha de Marte com dois sóis no horizonte',
    hint1:
      'Dica de Estilo (60s): Ilustração digital Solarpunk vibrante com plantas bioluminescentes e dois sóis!',
    hint2:
      'Dica Principal (30s): Um elefantinho astronauta regando flores gigantes com a tromba num domo em Marte!',
    keywords: {
      subject: [
        {
          concept: 'Pequeno elefante em traje espacial',
          weight: 0.6,
          synonyms: ['elefante', 'elefantinho', 'animal', 'astronauta', 'traje espacial', 'tromba', 'jardineiro', 'botanico'],
        },
        {
          concept: 'Regando flores bioluminescentes com a tromba',
          weight: 0.4,
          synonyms: ['regando', 'agua', 'flores', 'plantas', 'bioluminescentes', 'gigantes', 'cuidando'],
        },
      ],
      style: [
        {
          concept: 'Ilustração digital Solarpunk sci-fi',
          weight: 0.6,
          synonyms: ['solarpunk', 'sci-fi', 'ilustracao digital', 'pintura digital', 'colorido', 'futurista', 'vibrante'],
        },
        {
          concept: 'Brilho bioluminescente e luz de dois sóis',
          weight: 0.4,
          synonyms: ['bioluminescente', 'brilhante', 'dois sois', 'luminoso', 'roxo e branco'],
        },
      ],
      environment: [
        {
          concept: 'Domo de vidro geodésico (estufa espacial)',
          weight: 0.55,
          synonyms: ['domo', 'cupula de vidro', 'estufa', 'jardim espacial', 'geodesico', 'base espacial'],
        },
        {
          concept: 'Superfície vermelha de Marte / Planeta alienígena',
          weight: 0.45,
          synonyms: ['marte', 'planeta vermelho', 'deserto vermelho', 'alienigena', 'horizonte', 'crateras'],
        },
      ],
      botPrompts: [
        'Um pequeno elefante de traje espacial regando flores bioluminescentes gigantes com a tromba dentro de uma cúpula de vidro em Marte, ilustração digital solarpunk',
        'Pintura digital sci-fi de um elefantinho jardineiro cuidando de plantas luminosas num domo geodésico no planeta vermelho com dois sóis',
        'Elefante astronauta fofo molhando flores brilhantes dentro de uma estufa espacial em Marte',
      ],
    },
  },
  {
    id: 'dragao-biblioteca-cha',
    title: 'Dragãozinho Leitor na Casa de Chá Mágica',
    category: 'Fantasia Aconchegante & Leitura',
    difficulty: 'Médio',
    imageUrl: '/challenges/dragao_biblioteca_cha.webp',
    fullPrompt:
      'Um pequeno dragão verde amigável usando óculos redondos na ponta do focinho lendo um livro antigo enquanto aquece uma chaleira de chá com um pequeno sopro de fogo suave sentado em uma poltrona aconchegante cercado por estantes de livros, pintura digital de fantasia aconchegante',
    subjectLayer:
      'Um pequeno dragão verde amigável de óculos redondos lendo um livro e aquecendo uma chaleira com sopro de fogo',
    styleLayer:
      'pintura digital de fantasia aconchegante (cozy fantasy), iluminação quente e mágica',
    environmentLayer:
      'sentado em uma poltrona confortável cercado por estantes altas de livros antigos e xícaras de chá',
    hint1:
      'Dica de Estilo (60s): Pintura digital de fantasia aconchegante (cozy fantasy) com luz dourada e quente!',
    hint2:
      'Dica Principal (30s): Um dragãozinho de óculos lendo um livro e esquentando chá com um sopro de fogo!',
    keywords: {
      subject: [
        {
          concept: 'Pequeno dragão verde de óculos lendo livro',
          weight: 0.6,
          synonyms: ['dragao', 'dragaozinho', 'verde', 'oculos', 'lendo', 'livro', 'leitor', 'fofo'],
        },
        {
          concept: 'Aquecendo chaleira de chá com sopro de fogo',
          weight: 0.4,
          synonyms: ['cha', 'chaleira', 'bule', 'xicara', 'fogo', 'chama', 'sopro de fogo', 'esquentando', 'aquecendo'],
        },
      ],
      style: [
        {
          concept: 'Pintura digital de fantasia aconchegante',
          weight: 0.65,
          synonyms: ['pintura digital', 'fantasia', 'aconchegante', 'cozy', 'ilustracao', 'conto de fadas', 'magica'],
        },
        {
          concept: 'Iluminação quente de lareira e velas',
          weight: 0.35,
          synonyms: ['quente', 'dourada', 'suave', 'confortavel', 'iluminada'],
        },
      ],
      environment: [
        {
          concept: 'Poltrona confortável em biblioteca antiga',
          weight: 0.7,
          synonyms: ['poltrona', 'sofa', 'biblioteca', 'estantes', 'livros', 'sala de leitura', 'casa de cha'],
        },
        {
          concept: 'Janela arredondada e poeira mágica',
          weight: 0.3,
          synonyms: ['janela', 'madeira', 'tapete', 'brilho'],
        },
      ],
      botPrompts: [
        'Um pequeno dragão verde de óculos redondos sentado numa poltrona lendo um livro e esquentando um bule de chá com uma chaminha na boca, pintura digital de fantasia aconchegante',
        'Ilustração mágica e acolhedora de um dragãozinho leitor numa biblioteca cheia de livros aquecendo chá com sopro de fogo',
        'Dragão amigável usando óculos lendo histórias antigas e preparando chá em uma sala confortável iluminada',
      ],
    },
  },
  {
    id: 'jacare-astronomo',
    title: 'Jacaré Astrônomo no Observatório do Manguezal',
    category: 'Astronomia & Biodiversidade',
    difficulty: 'Médio',
    imageUrl: '/challenges/jacare-astronomo.webp',
    fullPrompt:
      'Um jacaré verde simpático usando cachecol violeta xadrez observando as estrelas por um telescópio de latão dourado em um deque de observatório de madeira sobre as águas e folhas de um manguezal à noite, estilo pintura em aquarela e guache vibrante em tons índigo, turquesa e dourado',
    subjectLayer:
      'Um jacaré verde simpático usando cachecol violeta observando as estrelas por um telescópio de latão dourado',
    styleLayer:
      'estilo pintura em aquarela e guache vibrante em tons índigo, turquesa e dourado',
    environmentLayer:
      'em um deque de observatório de madeira sobre as águas turquesas e folhas de um manguezal sob céu estrelado',
    hint1:
      'Dica de Estilo (60s): Pintura artística em aquarela e guache em tons de índigo, turquesa e dourado!',
    hint2:
      'Dica Principal (30s): Um jacaré de cachecol violeta olhando estrelas por um telescópio dourado no manguezal!',
    keywords: {
      subject: [
        {
          concept: 'Jacaré verde usando cachecol violeta',
          weight: 0.55,
          synonyms: ['jacare', 'crocodilo', 'reptil', 'cachecol', 'violeta', 'roxo', 'xadrez', 'astronomo'],
        },
        {
          concept: 'Observando estrelas por telescópio de latão dourado',
          weight: 0.45,
          synonyms: ['telescopio', 'luneta', 'latao', 'dourado', 'observando', 'olhando', 'estrelas', 'astronomia', 'tripe'],
        },
      ],
      style: [
        {
          concept: 'Pintura em aquarela e guache vibrante',
          weight: 0.6,
          synonyms: ['aquarela', 'guache', 'gouache', 'pintura', 'ilustracao', 'livro ilustrado', 'artistico'],
        },
        {
          concept: 'Paleta índigo, turquesa e dourado',
          weight: 0.4,
          synonyms: ['indigo', 'azul escuro', 'turquesa', 'dourado', 'violeta', 'vibrante'],
        },
      ],
      environment: [
        {
          concept: 'Deque de observatório de madeira sobre manguezal',
          weight: 0.55,
          synonyms: ['observatorio', 'deque', 'varanda', 'madeira', 'manguezal', 'mangue', 'rio', 'agua', 'folhas'],
        },
        {
          concept: 'Céu noturno estrelado',
          weight: 0.45,
          synonyms: ['ceu estrelado', 'estrelas', 'noite', 'constelacoes', 'noturno'],
        },
      ],
      botPrompts: [
        'Um jacaré simpático de cachecol roxo olhando as estrelas por um telescópio dourado em um deque de madeira sobre a água do manguezal à noite, pintura em aquarela e guache',
        'Ilustração em aquarela índigo, turquesa e dourada de um jacaré astrônomo com cachecol violeta usando uma luneta de latão sob o céu estrelado',
        'Jacaré verde usando cachecol xadrez violeta observando constelações num telescópio dourado em um observatório de madeira no mangue',
      ],
    },
  },
  {
    id: 'tamandua-carteiro',
    title: 'Tamanduá Carteiro nas Ilhas Flutuantes',
    category: 'Aventura & Papel Recortado',
    difficulty: 'Médio',
    imageUrl: '/challenges/tamandua-carteiro.webp',
    fullPrompt:
      'Um tamanduá simpático carregando bolsa de carteiro vermelha entregando uma carta branca em uma ponte de corda diante de uma casinha sobre uma ilha flutuante entre nuvens, estilo diorama de papel recortado artesanal em camadas em tons coral e azul-celeste',
    subjectLayer:
      'Um tamanduá simpático carregando bolsa de carteiro vermelha e segurando uma carta branca para entrega',
    styleLayer:
      'estilo diorama de papel recortado artesanal em camadas com paleta coral, vermelho e azul-celeste',
    environmentLayer:
      'caminhando sobre pontes de corda ligadas a uma casinha em uma ilha flutuante entre nuvens',
    hint1:
      'Dica de Estilo (60s): Diorama artesanal de papel recortado em camadas nos tons coral e azul-celeste!',
    hint2:
      'Dica Principal (30s): Um tamanduá carteiro de bolsa vermelha entregando carta numa ilha flutuante com pontes de corda!',
    keywords: {
      subject: [
        {
          concept: 'Tamanduá carteiro com bolsa vermelha',
          weight: 0.6,
          synonyms: ['tamandua', 'carteiro', 'mensageiro', 'animal', 'bolsa vermelha', 'mochila', 'malote', 'focinho longo'],
        },
        {
          concept: 'Entregando uma carta / envelope branco',
          weight: 0.4,
          synonyms: ['carta', 'envelope', 'correspondencia', 'correio', 'entregando', 'mensagem'],
        },
      ],
      style: [
        {
          concept: 'Diorama de papel recortado em camadas',
          weight: 0.65,
          synonyms: ['papel recortado', 'diorama', 'colagem de papel', 'camadas', 'papercraft', 'origami', 'artesanal'],
        },
        {
          concept: 'Paleta coral e azul-celeste',
          weight: 0.35,
          synonyms: ['coral', 'laranja', 'vermelho', 'azul', 'azul celeste', 'vibrante'],
        },
      ],
      environment: [
        {
          concept: 'Casinha em ilha flutuante no céu com nuvens',
          weight: 0.55,
          synonyms: ['ilha flutuante', 'ilha voadora', 'casa', 'casinha', 'ceu', 'nuvens', 'arvores'],
        },
        {
          concept: 'Pontes de corda suspensas',
          weight: 0.45,
          synonyms: ['ponte', 'pontes de corda', 'cordas', 'suspensa', 'travessia'],
        },
      ],
      botPrompts: [
        'Um tamanduá carteiro com bolsa vermelha entregando uma carta sobre uma ponte de corda ligada a uma casa numa ilha flutuante no céu, diorama de papel recortado coral e azul',
        'Arte em camadas de papel recortado mostrando um tamanduá mensageiro levando um envelope para uma ilha voadora entre nuvens brancas',
        'Tamanduá simpático de bolsa vermelha atravessando cordas aéreas para entregar correspondência numa casinha flutuante',
      ],
    },
  },
  {
    id: 'coelho-relojoeiro',
    title: 'Coelho Relojoeiro na Torre de Massinha',
    category: 'Stop-Motion & Ofícios',
    difficulty: 'Fácil',
    imageUrl: '/challenges/coelho-relojoeiro.webp',
    fullPrompt:
      'Um coelho branco fofo vestindo macacão jeans azul diante de um grande relógio dourado iluminado dentro da oficina de madeira de uma torre do relógio, estilo animação stop-motion de massinha (claymation) em tons âmbar quente e verde-petróleo',
    subjectLayer:
      'Um coelho branco fofo vestindo macacão jeans azul trabalhando como relojoeiro',
    styleLayer:
      'estilo animação stop-motion de massinha (claymation)3D, iluminação âmbar quente e verde-petróleo',
    environmentLayer:
      'dentro da oficina de uma torre com um grande relógio dourado antigo ao fundo e prateleiras de madeira',
    hint1:
      'Dica de Estilo (60s): Animação estilo Stop-Motion de massinha (claymation) em tons âmbar e verde-petróleo!',
    hint2:
      'Dica Principal (30s): Um coelho branco de macacão azul diante de um relógio dourado na oficina de uma torre!',
    keywords: {
      subject: [
        {
          concept: 'Coelho branco vestindo macacão azul',
          weight: 0.6,
          synonyms: ['coelho', 'coelhinho', 'branco', 'orelhas longas', 'macacao', 'jardineira', 'azul', 'relojoeiro'],
        },
        {
          concept: 'Cuidando de um relógio dourado antigo',
          weight: 0.4,
          synonyms: ['relogio', 'dourado', 'ponteiros', 'consertando', 'oficina', 'tempo', 'relogio de parede'],
        },
      ],
      style: [
        {
          concept: 'Animação stop-motion de massinha (claymation)',
          weight: 0.65,
          synonyms: ['massinha', 'stop-motion', 'stop motion', 'claymation', '3d', 'boneco', 'animacao'],
        },
        {
          concept: 'Paleta âmbar quente e verde-petróleo',
          weight: 0.35,
          synonyms: ['ambar', 'dourado', 'verde petroleo', 'azul petroleo', 'luz quente', 'aconchegante'],
        },
      ],
      environment: [
        {
          concept: 'Oficina de madeira em torre de relógio',
          weight: 0.6,
          synonyms: ['oficina', 'torre', 'torre do relogio', 'prateleiras', 'bancada', 'madeira', 'portas verdes'],
        },
        {
          concept: 'Mostrador de relógio dourado iluminado ao fundo',
          weight: 0.4,
          synonyms: ['mostrador', 'numeros romanos', 'relogio gigante', 'engrenagens'],
        },
      ],
      botPrompts: [
        'Um coelho branco fofo de macacão azul na oficina de uma torre com um grande relógio dourado iluminado ao fundo, estilo animação stop-motion de massinha',
        'Visual claymation de massinha com um coelhinho relojoeiro vestindo jardineira jeans diante de relógios antigos dourados e paredes verde-petróleo',
        'Coelho branco simpático de macacão azul cuidando do relógio dourado em uma oficina aconchegante iluminada em tons âmbar',
      ],
    },
  },
  {
    id: 'lontra-engenheira',
    title: 'Lontra Engenheira na Vila Solarpunk',
    category: 'Sustentabilidade & Engenharia',
    difficulty: 'Médio',
    imageUrl: '/challenges/lontra-engenheira.webp',
    fullPrompt:
      'Uma lontra marrom simpática usando capacete de engenheira amarelo construindo uma roda d’água de madeira sobre um canal em uma vila ecológica com estufas de vidro curvas e painéis solares nos telhados, estilo ilustração isométrica solarpunk detalhada',
    subjectLayer:
      'Uma lontra marrom simpática usando capacete amarelo construindo uma roda d’água de madeira',
    styleLayer:
      'estilo ilustração isométrica solarpunk detalhada, luz solar diurna e cores naturais quentes',
    environmentLayer:
      'em uma vila ecológica sustentável cercada por estufas de vidro, jardins e painéis solares nos telhados',
    hint1:
      'Dica de Estilo (60s): Ilustração isométrica em estética ecológica Solarpunk com estufas e painéis solares!',
    hint2:
      'Dica Principal (30s): Uma lontra de capacete amarelo construindo uma roda d’água de madeira numa vila sustentável!',
    keywords: {
      subject: [
        {
          concept: 'Lontra marrom com capacete amarelo de engenharia',
          weight: 0.55,
          synonyms: ['lontra', 'animal', 'engenheira', 'construtora', 'capacete amarelo', 'capacete', 'epi'],
        },
        {
          concept: 'Construindo uma roda d’água de madeira',
          weight: 0.45,
          synonyms: ['roda dagua', 'moinho', 'madeira', 'engrenagem de madeira', 'agua', 'construindo', 'canal'],
        },
      ],
      style: [
        {
          concept: 'Ilustração isométrica Solarpunk',
          weight: 0.65,
          synonyms: ['isometrica', 'isometrico', 'solarpunk', 'ilustracao digital', '3d estilizado', 'maquete', 'jogo de construcao'],
        },
        {
          concept: 'Cores naturais ensolaradas',
          weight: 0.35,
          synonyms: ['ensolarado', 'madeira', 'verde', 'sustentavel', 'ecologico'],
        },
      ],
      environment: [
        {
          concept: 'Vila ecológica com estufas de vidro',
          weight: 0.55,
          synonyms: ['vila', 'aldeia', 'estufas', 'estufa de vidro', 'plantas', 'casas de madeira', 'jardim'],
        },
        {
          concept: 'Painéis solares nos telhados',
          weight: 0.45,
          synonyms: ['paineis solares', 'placa solar', 'energia solar', 'telhado', 'energia limpa'],
        },
      ],
      botPrompts: [
        'Uma lontra fofa de capacete amarelo montando uma roda d’água de madeira no meio de uma vila ecológica com estufas de vidro e painéis solares, ilustração isométrica solarpunk',
        'Arte isométrica solarpunk de uma lontra engenheira construindo um moinho d’água cercada por casas sustentáveis, plantas e placas solares',
        'Lontra construtora com capacete de segurança amarelo apoiada numa roda d’água numa ecovila cheia de estufas',
      ],
    },
  },
  {
    id: 'sapo-saxofonista',
    title: 'Sapo Saxofonista na Noite de Jazz',
    category: 'Música & Belas Artes',
    difficulty: 'Fácil',
    imageUrl: '/challenges/sapo-saxofonista.webp',
    fullPrompt:
      'Um sapo verde elegante vestindo terno vinho e gravata tocando um saxofone dourado encostado sob a luz quente de um poste antigo em uma rua de paralelepípedos molhada pela chuva à noite, estilo pintura a óleo expressiva com reflexos dourados e sombras azuis',
    subjectLayer:
      'Um sapo verde elegante vestindo terno vinho e gravata tocando um saxofone dourado',
    styleLayer:
      'estilo pintura a óleo expressiva com contraste de reflexos quentes dourados e sombras azuis noturnas',
    environmentLayer:
      'sob um poste de luz antigo em uma rua de paralelepípedos chuvosa à noite com cafés iluminados',
    hint1:
      'Dica de Estilo (60s): Pintura a óleo noturna com reflexos dourados no chão molhado e sombras azuis!',
    hint2:
      'Dica Principal (30s): Um sapo elegante de terno vinho tocando saxofone sob um poste numa rua chuvosa!',
    keywords: {
      subject: [
        {
          concept: 'Sapo verde vestindo terno vinho e gravata',
          weight: 0.55,
          synonyms: ['sapo', 'ra', 'perereca', 'anfibio', 'terno', 'paleto', 'vinho', 'vermelho escuro', 'gravata', 'elegante'],
        },
        {
          concept: 'Tocando saxofone dourado',
          weight: 0.45,
          synonyms: ['saxofone', 'sax', 'saxofonista', 'instrumento', 'musica', 'jazz', 'tocando', 'dourado'],
        },
      ],
      style: [
        {
          concept: 'Pintura a óleo expressiva',
          weight: 0.6,
          synonyms: ['pintura a oleo', 'oleo sobre tela', 'pintura', 'pinceladas', 'artistico', 'classico', 'ilustracao'],
        },
        {
          concept: 'Reflexos quentes dourados e sombras azuis',
          weight: 0.4,
          synonyms: ['reflexos', 'luz quente', 'sombras azuis', 'azul e dourado', 'noturno', 'cinematografico'],
        },
      ],
      environment: [
        {
          concept: 'Poste de luz antigo iluminando a calçada',
          weight: 0.5,
          synonyms: ['poste', 'lampiao', 'poste de luz', 'luminaria', 'calcada'],
        },
        {
          concept: 'Rua de paralelepípedos chuvosa à noite',
          weight: 0.5,
          synonyms: ['rua', 'chuva', 'chuvosa', 'paralelepipedos', 'chao molhado', 'noite', 'predios', 'cafe'],
        },
      ],
      botPrompts: [
        'Um sapo verde de terno vinho e gravata tocando saxofone dourado debaixo de um poste de luz numa rua chuvosa à noite, estilo pintura a óleo com reflexos dourados',
        'Pintura a óleo noturna de um sapo músico de jazz tocando sax sob a chuva com reflexos quentes nos paralelepípedos e sombras azuis',
        'Sapo elegante vestindo paletó bordô tocando saxofone iluminado por um lampião antigo numa rua molhada pela chuva',
      ],
    },
  },
  {
    id: 'peixe-balao-confeiteiro',
    title: 'Peixe-Balão Confeiteiro na Padaria Submarina',
    category: 'Gastronomia & Fundo do Mar',
    difficulty: 'Fácil',
    imageUrl: '/challenges/peixe-balao-confeiteiro.webp',
    fullPrompt:
      'Um peixe-balão azul rechonchudo e fofo usando chapéu branco de chef confeiteiro decorando um bolo de dois andares com cobertura rosa em uma confeitaria submarina cercada por corais alaranjados e bolhas de água, estilo animação 3D Pixar em tons pastel',
    subjectLayer:
      'Um peixe-balão azul fofo usando chapéu branco de chef decorando um bolo de dois andares',
    styleLayer:
      'estilo animação 3D Pixar fofa e vibrante em tons pastel suaves com iluminação subaquática',
    environmentLayer:
      'em uma confeitaria submarina cercada por corais coloridos e bolhas flutuando na água',
    hint1:
      'Dica de Estilo (60s): Animação 3D fofa estilo Pixar em tons pastel no fundo do mar!',
    hint2:
      'Dica Principal (30s): Um peixe-balão de chapéu de chef confeiteiro decorando um bolo entre corais!',
    keywords: {
      subject: [
        {
          concept: 'Peixe-balão fofo usando chapéu branco de chef',
          weight: 0.55,
          synonyms: ['peixe-balao', 'peixe balao', 'baiacu', 'peixe', 'peixinho', 'chapeu de chef', 'cozinheiro', 'confeiteiro', 'padeiro'],
        },
        {
          concept: 'Decorando um bolo de dois andares com glacê',
          weight: 0.45,
          synonyms: ['bolo', 'doce', 'torta', 'confeitando', 'decorando', 'glace', 'cobertura', 'espatula'],
        },
      ],
      style: [
        {
          concept: 'Animação 3D estilo Pixar',
          weight: 0.65,
          synonyms: ['3d', 'pixar', 'animacao', 'disney', 'render 3d', 'cartoon 3d', 'fofo'],
        },
        {
          concept: 'Paleta de tons pastel suaves',
          weight: 0.35,
          synonyms: ['tons pastel', 'pastel', 'colorido', 'suave', 'azul e coral', 'amarelo'],
        },
      ],
      environment: [
        {
          concept: 'Confeitaria / cozinha submarina no fundo do mar',
          weight: 0.55,
          synonyms: ['submarina', 'fundo do mar', 'oceano', 'debaixo dagua', 'confeitaria', 'cozinha', 'padaria'],
        },
        {
          concept: 'Corais coloridos e bolhas de água',
          weight: 0.45,
          synonyms: ['corais', 'recife', 'bolhas', 'agua'],
        },
      ],
      botPrompts: [
        'Um peixe-balão fofo usando chapéu branco de chef decorando um bolo colorido em uma confeitaria no fundo do mar com corais e bolhas, animação 3D Pixar',
        'Render 3D em tons pastel de um baiacu confeiteiro sorridente passando cobertura num bolo de dois andares cercado por corais',
        'Peixinho redondo de chapéu de cozinheiro preparando um bolo doce numa padaria submarina cheia de bolhas',
      ],
    },
  },
  {
    id: 'caranguejo-ferreiro',
    title: 'Caranguejo Ferreiro na Forja do Vulcão',
    category: 'Games & Arte Voxel',
    difficulty: 'Médio',
    imageUrl: '/challenges/caranguejo-ferreiro.webp',
    fullPrompt:
      'Um caranguejo vermelho usando avental marrom de ferreiro segurando uma espada dourada incandescente sobre uma bigorna dentro de uma oficina de blocos de pedra na encosta de um vulcão com rios de lava laranja ao fundo, estilo arte voxel 3D em laranja e cinza vulcânico',
    subjectLayer:
      'Um caranguejo vermelho de avental de ferreiro forjando uma espada dourada incandescente na bigorna',
    styleLayer:
      'estilo arte voxel 3D de blocos estilizados, paleta laranja incandescente e cinza vulcânico',
    environmentLayer:
      'dentro de uma oficina de pedra na encosta de um vulcão com cascatas de lava brilhante',
    hint1:
      'Dica de Estilo (60s): Arte Voxel 3D (blocos cúbicos estilizados) em tons de laranja lava e cinza vulcânico!',
    hint2:
      'Dica Principal (30s): Um caranguejo de avental forjando uma espada dourada numa oficina no vulcão!',
    keywords: {
      subject: [
        {
          concept: 'Caranguejo vermelho vestindo avental de ferreiro',
          weight: 0.55,
          synonyms: ['caranguejo', 'siri', 'crustaceo', 'ferreiro', 'avental', 'vermelho', 'forjador'],
        },
        {
          concept: 'Segurando espada dourada incandescente sobre a bigorna',
          weight: 0.45,
          synonyms: ['espada', 'lamina', 'forjando', 'bigorna', 'forja', 'dourada', 'incandescente', 'metal'],
        },
      ],
      style: [
        {
          concept: 'Arte Voxel 3D / blocos estilizados',
          weight: 0.65,
          synonyms: ['voxel', 'arte voxel', 'blocos', 'cubos', '3d', 'minecraft', 'estilizado', 'game'],
        },
        {
          concept: 'Paleta laranja incandescente e cinza vulcânico',
          weight: 0.35,
          synonyms: ['laranja', 'cinza', 'vulcanico', 'brilhante', 'quente', 'fogo'],
        },
      ],
      environment: [
        {
          concept: 'Oficina de forja em blocos de pedra',
          weight: 0.5,
          synonyms: ['oficina', 'forja', 'ferraria', 'pedra', 'bancada'],
        },
        {
          concept: 'Encosta de vulcão com rios de lava laranja',
          weight: 0.5,
          synonyms: ['vulcao', 'lava', 'magma', 'montanha', 'fogo'],
        },
      ],
      botPrompts: [
        'Um caranguejo vermelho de avental forjando uma espada dourada brilhante sobre uma bigorna numa oficina na encosta de um vulcão com lava, estilo arte voxel 3D',
        'Ilustração 3D em blocos voxel de um caranguejo ferreiro segurando uma espada incandescente cercado por rochas cinzas e lava laranja',
        'Caranguejo artesão vestindo avental de couro trabalhando numa ferraria vulcânica com espada luminosa',
      ],
    },
  },
  {
    id: 'morcego-bibliotecario',
    title: 'Morcego Bibliotecário ao Luar Gótico',
    category: 'Literatura & Arte em Papel',
    difficulty: 'Médio',
    imageUrl: '/challenges/morcego-bibliotecario.webp',
    fullPrompt:
      'Um morcego simpático de óculos grandes lendo e organizando livros coloridos diante de uma janela em arco gótico com a lua cheia brilhando ao fundo e estantes altas nas laterais, estilo arte em papel recortado em camadas nos tons azul-noturno, amarelo e prata',
    subjectLayer:
      'Um morcego simpático usando óculos grandes organizando e lendo livros empilhados',
    styleLayer:
      'estilo arte em papel recortado em camadas (papercut) com paleta azul-noturno, prata e luz lunar',
    environmentLayer:
      'dentro de uma biblioteca gótica com estantes de livros e uma janela em arco sob a lua cheia',
    hint1:
      'Dica de Estilo (60s): Arte em papel recortado em camadas (papercut) em tons de azul-noturno e luz da lua!',
    hint2:
      'Dica Principal (30s): Um morcego de óculos organizando livros numa biblioteca gótica diante da lua cheia!',
    keywords: {
      subject: [
        {
          concept: 'Morcego simpático usando óculos',
          weight: 0.55,
          synonyms: ['morcego', 'morceguinho', 'asas', 'oculos', 'bibliotecario', 'leitor'],
        },
        {
          concept: 'Organizando e lendo livros coloridos',
          weight: 0.45,
          synonyms: ['livros', 'lendo', 'organizando', 'pilha de livros', 'leitura', 'estudo'],
        },
      ],
      style: [
        {
          concept: 'Arte de papel recortado em camadas',
          weight: 0.65,
          synonyms: ['papel recortado', 'camadas', 'papercut', 'colagem', 'diorama', 'ilustracao plana', 'vetorial'],
        },
        {
          concept: 'Paleta azul-noturno e brilho lunar',
          weight: 0.35,
          synonyms: ['azul', 'azul escuro', 'prata', 'noturno', 'amarelo'],
        },
      ],
      environment: [
        {
          concept: 'Biblioteca gótica com estantes e janela em arco',
          weight: 0.55,
          synonyms: ['biblioteca', 'gotica', 'estantes', 'prateleiras', 'arco', 'janela'],
        },
        {
          concept: 'Lua cheia brilhando ao fundo',
          weight: 0.45,
          synonyms: ['lua', 'lua cheia', 'luar', 'noite'],
        },
      ],
      botPrompts: [
        'Um morcego fofo de óculos organizando livros em uma biblioteca gótica com janela em arco e lua cheia ao fundo, estilo papel recortado em camadas azul',
        'Ilustração em camadas de papel recortado mostrando um morceguinho bibliotecário de óculos lendo livros sob a luz da lua',
        'Morcego simpático usando óculos cercado por pilhas e estantes de livros diante de uma grande lua amarela',
      ],
    },
  },
  {
    id: 'girafa-fotografa',
    title: 'Girafa Fotógrafa no Passeio de Balão',
    category: 'Viagem & Ilustração Retrô',
    difficulty: 'Fácil',
    imageUrl: '/challenges/girafa-fotografa.webp',
    fullPrompt:
      'Uma girafa simpática usando chapéu de palha de viajante segurando uma câmera fotográfica para registrar a savana dourada com um balão de ar quente colorido flutuando no céu azul límpido ao lado, estilo ilustração retrô de pôster de viagem em tons ocre e azul',
    subjectLayer:
      'Uma girafa simpática de chapéu de palha segurando uma câmera fotográfica para tirar fotos',
    styleLayer:
      'estilo ilustração retrô de pôster de viagem com cores vibrantes em ocre dourado e céu azul',
    environmentLayer:
      'sobre a paisagem da savana ensolarada com um grande balão de ar quente listrado voando no céu',
    hint1:
      'Dica de Estilo (60s): Ilustração retrô de viagem com cores quentes em ocre dourado e céu azul vibrante!',
    hint2:
      'Dica Principal (30s): Uma girafa de chapéu tirando fotos da savana com um balão de ar quente ao lado!',
    keywords: {
      subject: [
        {
          concept: 'Girafa simpática usando chapéu de palha',
          weight: 0.55,
          synonyms: ['girafa', 'animal', 'pescoco longo', 'chapeu', 'chapeu de palha', 'viajante', 'turista'],
        },
        {
          concept: 'Segurando câmera fotográfica e tirando foto',
          weight: 0.45,
          synonyms: ['camera', 'maquina fotografica', 'fotografa', 'fotografando', 'tirando foto', 'foto'],
        },
      ],
      style: [
        {
          concept: 'Ilustração retrô de pôster de viagem',
          weight: 0.6,
          synonyms: ['ilustracao', 'retro', 'viagem', 'poster', 'pintura digital', 'colorido', 'estilizado'],
        },
        {
          concept: 'Paleta ocre dourado e céu azul límpido',
          weight: 0.4,
          synonyms: ['ocre', 'dourado', 'amarelo', 'azul', 'ceu azul', 'ensolarado'],
        },
      ],
      environment: [
        {
          concept: 'Balão de ar quente colorido com cesto de vime',
          weight: 0.55,
          synonyms: ['balao', 'balao de ar quente', 'cesto', 'voando', 'ar'],
        },
        {
          concept: 'Savana dourada com árvores ao fundo',
          weight: 0.45,
          synonyms: ['savana', 'planicie', 'africa', 'arvores', 'natureza', 'campo'],
        },
      ],
      botPrompts: [
        'Uma girafa simpática de chapéu de palha segurando uma câmera fotográfica na savana dourada com um balão de ar quente colorido no céu azul, ilustração retrô de viagem',
        'Ilustração colorida em tons ocre e azul de uma girafa turista tirando fotos perto de um balão de ar quente sobre a savana',
        'Girafa fotógrafa usando chapéu de sol e câmera no pescoço diante de um balão listrado voando sobre a savana',
      ],
    },
  },
  {
    id: 'zebra-patinadora',
    title: 'Zebra Patinadora na Pista Vaporwave',
    category: 'Esporte & Estética Retrô',
    difficulty: 'Fácil',
    imageUrl: '/challenges/zebra-patinadora.webp',
    fullPrompt:
      'Uma zebra estilosa vestindo jaqueta rosa choque e patins de quatro rodas deslizando sobre uma pista de patinação espelhada iluminada por grades de neon sob um grande globo espelhado de discoteca brilhante, estilo ilustração vaporwave em ciano, azul e magenta',
    subjectLayer:
      'Uma zebra estilosa vestindo jaqueta rosa choque e patins de rodas patinando em movimento',
    styleLayer:
      'estilo ilustração retrô vaporwave e disco neon com paleta vibrante em ciano, azul e magenta',
    environmentLayer:
      'em uma pista de patinação espelhada com grades de neon sob um globo espelhado de discoteca',
    hint1:
      'Dica de Estilo (60s): Estética Vaporwave / Disco retrô com luzes neon em ciano, azul e rosa magenta!',
    hint2:
      'Dica Principal (30s): Uma zebra de jaqueta rosa patinando numa pista neon sob um globo espelhado!',
    keywords: {
      subject: [
        {
          concept: 'Zebra estilosa vestindo jaqueta rosa',
          weight: 0.55,
          synonyms: ['zebra', 'listrada', 'animal', 'jaqueta rosa', 'casaco rosa', 'rosa choque', 'estilosa'],
        },
        {
          concept: 'Patinando com patins de rodas',
          weight: 0.45,
          synonyms: ['patinando', 'patinadora', 'patins', 'roller', 'rodinhas', 'deslizando'],
        },
      ],
      style: [
        {
          concept: 'Estética Vaporwave / Disco retrô neon',
          weight: 0.6,
          synonyms: ['vaporwave', 'synthwave', 'disco', 'retro', 'anos 80', 'neon', 'futurista'],
        },
        {
          concept: 'Paleta ciano, azul e magenta',
          weight: 0.4,
          synonyms: ['ciano', 'azul', 'magenta', 'rosa', 'roxo', 'brilhante'],
        },
      ],
      environment: [
        {
          concept: 'Pista de patinação espelhada com grades de neon',
          weight: 0.5,
          synonyms: ['pista', 'pista de patinacao', 'rinque', 'chao espelhado', 'reflexo', 'grades neon'],
        },
        {
          concept: 'Globo espelhado de discoteca no alto',
          weight: 0.5,
          synonyms: ['globo espelhado', 'bola de discoteca', 'globo de luz', 'discoteca', 'festa'],
        },
      ],
      botPrompts: [
        'Uma zebra estilosa de jaqueta rosa e patins de rodinhas patinando numa pista neon espelhada debaixo de um globo de discoteca, estilo vaporwave ciano e magenta',
        'Ilustração vaporwave retrô de uma zebra patinadora deslizando sob um globo espelhado brilhante com luzes rosa e azuis',
        'Zebra usando casaco rosa choque e patins brancos fazendo pose na pista de patinação iluminada por neon',
      ],
    },
  },
  {
    id: 'cachorro-arqueologo',
    title: 'Cachorro Arqueólogo nas Ruínas do Deserto',
    category: 'História & Quadrinhos',
    difficulty: 'Fácil',
    imageUrl: '/challenges/cachorro-arqueologo.webp',
    fullPrompt:
      'Um cachorro marrom e branco sorridente usando chapéu de explorador e lenço no pescoço escavando e limpando um vaso antigo decorado com folhas azuis na areia entre colunas de pedra de ruínas no deserto ensolarado, estilo ilustração cel shading em tons areia e azul-lápis-lazúli',
    subjectLayer:
      'Um cachorro simpático de chapéu de explorador limpando um vaso cerâmico antigo decorado em azul',
    styleLayer:
      'estilo ilustração em cel shading com contornos nítidos, paleta dourada de areia e azul-lápis-lazúli',
    environmentLayer:
      'na areia de um deserto ensolarado cercado por colunas antigas de pedra e ruínas históricas',
    hint1:
      'Dica de Estilo (60s): Ilustração estilo Cel Shading / Quadrinhos em tons de areia dourada e azul-lápis-lazúli!',
    hint2:
      'Dica Principal (30s): Um cachorro de chapéu explorador desenterrando um vaso antigo em ruínas no deserto!',
    keywords: {
      subject: [
        {
          concept: 'Cachorro simpático usando chapéu de explorador',
          weight: 0.55,
          synonyms: ['cachorro', 'cao', 'cachorrinho', 'arqueologo', 'explorador', 'aventureiro', 'chapeu', 'lenco'],
        },
        {
          concept: 'Escavando e limpando um vaso cerâmico antigo',
          weight: 0.45,
          synonyms: ['vaso', 'ceramica', 'jarro', 'artefato', 'relíquia', 'escavando', 'limpando', 'pincel'],
        },
      ],
      style: [
        {
          concept: 'Ilustração Cel Shading / Quadrinhos com traço definido',
          weight: 0.6,
          synonyms: ['cel shading', 'quadrinhos', 'cartoon', 'desenho animado', 'ilustracao 2d', 'contorno'],
        },
        {
          concept: 'Paleta areia dourada e azul-lápis-lazúli',
          weight: 0.4,
          synonyms: ['areia', 'dourado', 'azul', 'lapis-lazuli', 'laranja', 'ensolarado'],
        },
      ],
      environment: [
        {
          concept: 'Ruínas antigas com colunas de pedra',
          weight: 0.55,
          synonyms: ['ruinas', 'colunas', 'templo', 'pedras', 'antigo', 'egito', 'historico'],
        },
        {
          concept: 'Deserto de areia sob o sol brilhante',
          weight: 0.45,
          synonyms: ['deserto', 'areia', 'dunas', 'sol'],
        },
      ],
      botPrompts: [
        'Um cachorro simpático de chapéu de explorador limpando um vaso antigo pintado de azul entre colunas de ruínas no deserto, ilustração estilo cel shading',
        'Desenho estilo quadrinhos cel shading de um cãozinho arqueólogo sorridente desenterrando uma cerâmica antiga na areia do deserto',
        'Cachorro aventureiro usando chapéu de sol cuidando de um jarro histórico em ruínas ensolaradas',
      ],
    },
  },
  {
    id: 'gato-vendedor-planetas',
    title: 'Gato Mercador de Planetas na Feira Noturna',
    category: 'Fantasia & Miniatura',
    difficulty: 'Difícil',
    imageUrl: '/challenges/gato-vendedor-planetas.webp',
    fullPrompt:
      'Um gatinho laranja e branco fofo vestindo avental marrom de feirante diante de uma barraca de madeira iluminada por um varal de lâmpadas quentes vendendo pequenas esferas de planetas luminosos dourados sobre o balcão à noite, estilo diorama em miniatura cinematográfica azul-noite e âmbar',
    subjectLayer:
      'Um gatinho laranja e branco de avental marrom vendendo pequenos planetas e esferas luminosas no balcão',
    styleLayer:
      'estilo miniatura cinematográfica 3D com profundidade de campo suave, luzes âmbar quentes e fundo azul-noite',
    environmentLayer:
      'em uma barraca de feira noturna de madeira decorada com um varal de lâmpadas penduradas',
    hint1:
      'Dica de Estilo (60s): Estética de miniatura cinematográfica com contraste entre azul-noite e luz âmbar!',
    hint2:
      'Dica Principal (30s): Um gato de avental vendendo pequenos planetas luminosos numa banca de feira noturna!',
    keywords: {
      subject: [
        {
          concept: 'Gato laranja e branco vestindo avental de vendedor',
          weight: 0.55,
          synonyms: ['gato', 'gatinho', 'felino', 'laranja', 'avental', 'vendedor', 'mercador', 'feirante'],
        },
        {
          concept: 'Vendendo pequenos planetas e esferas luminosas',
          weight: 0.45,
          synonyms: ['planetas', 'esferas', 'orbes', 'aneis', 'luminosos', 'brilhantes', 'vendendo', 'miniaturas'],
        },
      ],
      style: [
        {
          concept: 'Miniatura cinematográfica / Diorama 3D',
          weight: 0.6,
          synonyms: ['miniatura', 'cinematografico', '3d', 'diorama', 'tilt-shift', 'boneco', 'realista'],
        },
        {
          concept: 'Contraste azul-noite e luz âmbar dourada',
          weight: 0.4,
          synonyms: ['azul-noite', 'azul escuro', 'ambar', 'dourado', 'luz quente', 'aconchegante'],
        },
      ],
      environment: [
        {
          concept: 'Barraca de madeira em feira noturna',
          weight: 0.55,
          synonyms: ['barraca', 'banca', 'feira', 'mercado noturno', 'balcao', 'madeira', 'noite'],
        },
        {
          concept: 'Varal de lâmpadas e lanternas penduradas',
          weight: 0.45,
          synonyms: ['lampadas', 'lanternas', 'varal de luzes', 'pisca-pisca', 'iluminacao'],
        },
      ],
      botPrompts: [
        'Um gatinho laranja de avental em uma barraca de feira noturna iluminada por lâmpadas quentes vendendo pequenos planetas luminosos no balcão, estilo miniatura cinematográfica',
        'Diorama 3D cinematográfico em azul-noite e âmbar de um gato mercador expondo esferas de planetas brilhantes sob um varal de luzes',
        'Gato fofo vestindo avental marrom cuidando de sua banca de madeira cheia de pequenos astros dourados iluminados à noite',
      ],
    },
  },
  {
    id: 'abelha-pilota-dirigivel',
    title: 'Abelha Aviadora sobre a Estufa Gigante',
    category: 'Natureza & Aviação',
    difficulty: 'Médio',
    imageUrl: '/challenges/abelha-pilota-dirigivel.webp',
    fullPrompt:
      'Uma abelha fofa e felpuda usando óculos de aviadora de latão pilotando um pequeno dirigível de madeira suspenso por balão alaranjado sobre flores gigantes coloridas dentro de uma estufa de vidro iluminada, estilo ilustração de livro infantil em verde e amarelo-mel',
    subjectLayer:
      'Uma abelha fofa usando óculos de aviadora pilotando um pequeno dirigível de madeira e balão',
    styleLayer:
      'estilo ilustração de livro infantil detalhada em aquarela com tons de verde-folha, rosa e amarelo-mel',
    environmentLayer:
      'voando acima de flores gigantes coloridas sob o teto de vidro de uma grande estufa ensolarada',
    hint1:
      'Dica de Estilo (60s): Ilustração delicada de livro infantil em tons de verde, flores coloridas e amarelo-mel!',
    hint2:
      'Dica Principal (30s): Uma abelha de óculos de aviadora pilotando um dirigível sobre uma estufa de flores gigantes!',
    keywords: {
      subject: [
        {
          concept: 'Abelha fofa usando óculos de aviadora',
          weight: 0.55,
          synonyms: ['abelha', 'abelhinha', 'mamangava', 'inseto', 'oculos de aviador', 'aviadora', 'pilota', 'oculos'],
        },
        {
          concept: 'Pilotando um pequeno dirigível de madeira',
          weight: 0.45,
          synonyms: ['dirigivel', 'zepelim', 'balao', 'nave de madeira', 'pilotando', 'voando', 'aeronave'],
        },
      ],
      style: [
        {
          concept: 'Ilustração de livro infantil / conto ilustrado',
          weight: 0.65,
          synonyms: ['livro ilustrado', 'livro infantil', 'ilustracao', 'aquarela', 'conto de fadas', 'desenho'],
        },
        {
          concept: 'Paleta verde, rosa e amarelo-mel',
          weight: 0.35,
          synonyms: ['amarelo', 'mel', 'verde', 'colorido', 'luminoso', 'floral'],
        },
      ],
      environment: [
        {
          concept: 'Estufa com teto de vidro ensolarado',
          weight: 0.5,
          synonyms: ['estufa', 'teto de vidro', 'vidro', 'jardim botanico'],
        },
        {
          concept: 'Jardim de flores gigantes coloridas',
          weight: 0.5,
          synonyms: ['flores', 'flores gigantes', 'margaridas', 'girassois', 'petalas', 'jardim'],
        },
      ],
      botPrompts: [
        'Uma abelha fofa de óculos de aviadora pilotando um dirigível de madeira sobre flores gigantes coloridas dentro de uma estufa de vidro, ilustração de livro infantil',
        'Ilustração estilo livro ilustrado em verde e amarelo-mel mostrando uma abelhinha aviadora voando num pequeno dirigível acima de um jardim florido',
        'Abelha felpuda com óculos de proteção no comando de um balão dirigível sobre margaridas gigantes numa estufa',
      ],
    },
  },
  {
    id: 'joaninha-inventora',
    title: 'Joaninha Inventora na Oficina de Cogumelos',
    category: 'Macro Fantasia & Steampunk',
    difficulty: 'Difícil',
    imageUrl: '/challenges/joaninha-inventora.webp',
    fullPrompt:
      'Uma joaninha vermelha com pintas pretas usando uma grande lente de lupa de latão nos olhos montando uma máquina de engrenagens douradas sobre uma pequena bancada de madeira cercada por cogumelos vermelhos com pintas brancas, estilo fotografia macro fantasia steampunk em cobre e vermelho',
    subjectLayer:
      'Uma joaninha vermelha usando lente de lupa de latão montando uma máquina de engrenagens douradas',
    styleLayer:
      'estilo macro fantasia steampunk ultradetalhada com iluminação quente em tons de cobre, latão e vermelho',
    environmentLayer:
      'sobre uma pequena bancada de madeira em uma oficina miniatura cercada por cogumelos vermelhos da floresta',
    hint1:
      'Dica de Estilo (60s): Fotografia Macro Fantasia Steampunk detalhada em tons de cobre, latão e vermelho!',
    hint2:
      'Dica Principal (30s): Uma joaninha com lupa de latão montando engrenagens numa oficina entre cogumelos!',
    keywords: {
      subject: [
        {
          concept: 'Joaninha vermelha usando lupa / óculos de latão',
          weight: 0.55,
          synonyms: ['joaninha', 'besouro', 'inseto', 'vermelha', 'lupa', 'monoculo', 'oculos', 'inventora', 'relojoeira'],
        },
        {
          concept: 'Montando máquina de engrenagens douradas',
          weight: 0.45,
          synonyms: ['engrenagem', 'engrenagens', 'maquina', 'mecanismo', 'montando', 'consertando', 'latao'],
        },
      ],
      style: [
        {
          concept: 'Macro fantasia Steampunk detalhada',
          weight: 0.65,
          synonyms: ['steampunk', 'macro', 'fantasia', 'miniatura', '3d realista', 'fotografia macro'],
        },
        {
          concept: 'Paleta cobre, bronze e vermelho',
          weight: 0.35,
          synonyms: ['cobre', 'dourado', 'bronze', 'vermelho', 'quente'],
        },
      ],
      environment: [
        {
          concept: 'Oficina miniatura com bancada de madeira',
          weight: 0.5,
          synonyms: ['oficina', 'bancada', 'mesa de madeira', 'ferramentas', 'miniatura'],
        },
        {
          concept: 'Cogumelos vermelhos com pintas brancas ao redor',
          weight: 0.5,
          synonyms: ['cogumelos', 'cogumelo vermelho', 'floresta', 'musgo', 'natureza'],
        },
      ],
      botPrompts: [
        'Uma joaninha vermelha usando uma lupa de latão montando uma máquina de engrenagens douradas numa bancada cercada por cogumelos vermelhos, estilo macro fantasia steampunk',
        'Arte macro steampunk em tons de cobre e vermelho de uma joaninha inventora ajustando uma engrenagem entre cogumelos da floresta',
        'Joaninha com monóculo dourado trabalhando em peças mecânicas de relojoaria numa oficina miniatura com cogumelos',
      ],
    },
  },
  {
    id: 'lobo-ceramista',
    title: 'Lobo Ceramista no Ateliê de Inverno',
    category: 'Artesanato & Aquarela',
    difficulty: 'Médio',
    imageUrl: '/challenges/lobo-ceramista.webp',
    fullPrompt:
      'Um lobo cinzento amigável usando avental bege de artesão moldando uma tigela de argila terracota com as patas sobre um torno giratório de madeira dentro de um ateliê de cerâmica cheio de vasos nas prateleiras e janela ao fundo, estilo ilustração em nanquim e aquarela em cinza e terracota',
    subjectLayer:
      'Um lobo cinzento amigável de avental bege moldando uma tigela de cerâmica terracota no torno giratório',
    styleLayer:
      'estilo ilustração tradicional em traço de nanquim e pintura em aquarela nos tons cinza e terracota',
    environmentLayer:
      'dentro de um ateliê de cerâmica com prateleiras cheias de potes de barro e uma janela de madeira',
    hint1:
      'Dica de Estilo (60s): Ilustração com traços de nanquim e pintura em aquarela nos tons cinza e terracota!',
    hint2:
      'Dica Principal (30s): Um lobo cinzento de avental moldando uma tigela de barro num ateliê de cerâmica!',
    keywords: {
      subject: [
        {
          concept: 'Lobo cinzento amigável vestindo avental',
          weight: 0.55,
          synonyms: ['lobo', 'lobo cinzento', 'animal', 'avental', 'ceramista', 'artesao', 'escultor'],
        },
        {
          concept: 'Moldando tigela de barro no torno de cerâmica',
          weight: 0.45,
          synonyms: ['tigela', 'vaso', 'ceramica', 'argila', 'barro', 'moldando', 'torno', 'roda de oleiro'],
        },
      ],
      style: [
        {
          concept: 'Ilustração em traço de nanquim e aquarela',
          weight: 0.65,
          synonyms: ['nanquim', 'aquarela', 'traco', 'ilustracao', 'desenho', 'quadrinhos', 'pintura'],
        },
        {
          concept: 'Paleta cinza e terracota quente',
          weight: 0.35,
          synonyms: ['terracota', 'laranja terroso', 'cinza', 'marrom', 'aconchegante'],
        },
      ],
      environment: [
        {
          concept: 'Ateliê de cerâmica com prateleiras de vasos',
          weight: 0.6,
          synonyms: ['atelie', 'oficina', 'estudio', 'prateleiras', 'estante', 'potes', 'vasos'],
        },
        {
          concept: 'Janela de madeira com flocos de neve claros',
          weight: 0.4,
          synonyms: ['janela', 'neve', 'inverno', 'luz clara'],
        },
      ],
      botPrompts: [
        'Um lobo cinzento amigável de avental moldando uma tigela de argila terracota num torno giratório dentro de um ateliê de cerâmica, ilustração em nanquim e aquarela',
        'Desenho em nanquim e aquarela cinza e terracota mostrando um lobo artesão fazendo potes de barro cercado por prateleiras e uma janela',
        'Lobo ceramista sorridente trabalhando com argila na roda de oleiro em seu estúdio aconchegante',
      ],
    },
  },
  {
    id: 'coala-meteorologista',
    title: 'Coala Meteorologista na Estação das Nuvens',
    category: 'Clima & Stop-Motion',
    difficulty: 'Fácil',
    imageUrl: '/challenges/coala-meteorologista.webp',
    fullPrompt:
      'Um coala cinza fofo vestindo capa de chuva e chapéu amarelos segurando um medidor de vento no alto de uma estação meteorológica sobre nuvens brancas fofas sob o céu azul-claro com uma casinha de medição ao fundo, estilo animação stop-motion de massinha em azul-claro e amarelo',
    subjectLayer:
      'Um coala fofo vestindo capa de chuva e chapéu amarelos segurando um instrumento medidor de vento',
    styleLayer:
      'estilo animação stop-motion de massinha (claymation)3D suave em tons de azul-claro, branco e amarelo',
    environmentLayer:
      'no topo de nuvens brancas fofas com uma pequena estação meteorológica elevada sob o céu azul',
    hint1:
      'Dica de Estilo (60s): Animação fofa estilo Stop-Motion / Massinha 3D em tons de azul-claro e amarelo!',
    hint2:
      'Dica Principal (30s): Um coala de capa de chuva amarela medindo o clima numa estação sobre as nuvens!',
    keywords: {
      subject: [
        {
          concept: 'Coala fofo vestindo capa de chuva e chapéu amarelos',
          weight: 0.6,
          synonyms: ['coala', 'animal', 'capa amarela', 'capa de chuva', 'chapeu amarelo', 'meteorologista', 'fofo'],
        },
        {
          concept: 'Segurando instrumento medidor de vento / clima',
          weight: 0.4,
          synonyms: ['medidor', 'vento', 'clima', 'tempo', 'instrumento', 'antena', 'termometro', 'anemometro'],
        },
      ],
      style: [
        {
          concept: 'Estilo stop-motion de massinha / animação 3D suave',
          weight: 0.65,
          synonyms: ['massinha', 'stop-motion', 'claymation', '3d', 'animacao 3d', 'boneco', 'fofo'],
        },
        {
          concept: 'Paleta azul-claro, branco e amarelo',
          weight: 0.35,
          synonyms: ['azul-claro', 'amarelo', 'branco', 'luminoso', 'suave'],
        },
      ],
      environment: [
        {
          concept: 'Estação meteorológica sobre as nuvens',
          weight: 0.6,
          synonyms: ['nuvens', 'estacao', 'casinha', 'catavento', 'nas nuvens', 'alto'],
        },
        {
          concept: 'Céu azul diurno ensolarado',
          weight: 0.4,
          synonyms: ['ceu', 'ceu azul', 'dia', 'sol'],
        },
      ],
      botPrompts: [
        'Um coala fofo de capa de chuva amarela e chapéu medindo o vento numa estação meteorológica sobre as nuvens sob o céu azul-claro, estilo stop-motion de massinha',
        'Visual 3D claymation em azul-claro e amarelo mostrando um coala meteorologista em cima de nuvens brancas com uma casinha de medição ao fundo',
        'Coala simpático vestindo roupa amarela de chuva fazendo previsão do tempo no alto das nuvens',
      ],
    },
  },
  {
    id: 'iguana-tenista',
    title: 'Iguana Tenista no Terraço da Cidade',
    category: 'Esporte & Quadrinhos',
    difficulty: 'Fácil',
    imageUrl: '/challenges/iguana-tenista.webp',
    fullPrompt:
      'Uma iguana verde atlética usando viseira esportiva rebatendo uma bola de tênis amarela com uma raquete em uma quadra azul no terraço de um prédio cercado por guarda-corpo de vidro e arranha-céus ao fundo, estilo história em quadrinhos vibrante em verde-lima e azul',
    subjectLayer:
      'Uma iguana verde atlética usando viseira esportiva rebatendo uma bola amarela com uma raquete de tênis',
    styleLayer:
      'estilo ilustração de história em quadrinhos (HQ) com contornos marcantes em verde-lima e azul',
    environmentLayer:
      'em uma quadra de tênis azul no alto de um terraço com parapeito de vidro e prédios da cidade ao fundo',
    hint1:
      'Dica de Estilo (60s): Ilustração dinâmica estilo História em Quadrinhos (HQ) em verde-lima e azul!',
    hint2:
      'Dica Principal (30s): Uma iguana de viseira jogando tênis com raquete e bola numa quadra no alto de um prédio!',
    keywords: {
      subject: [
        {
          concept: 'Iguana verde atlética usando viseira esportiva',
          weight: 0.55,
          synonyms: ['iguana', 'lagarto', 'reptil', 'verde', 'viseira', 'oculos esportivos', 'tenista', 'atleta'],
        },
        {
          concept: 'Rebatendo bola amarela com raquete de tênis',
          weight: 0.45,
          synonyms: ['tenis', 'raquete', 'bola de tenis', 'bola amarela', 'rebatendo', 'jogando tenis', 'esporte'],
        },
      ],
      style: [
        {
          concept: 'Ilustração estilo História em Quadrinhos (HQ)',
          weight: 0.65,
          synonyms: ['quadrinhos', 'hq', 'comic', 'cartoon', 'desenho', 'ilustracao', 'traco preto'],
        },
        {
          concept: 'Paleta verde-lima e azul vibrante',
          weight: 0.35,
          synonyms: ['verde-lima', 'verde', 'azul', 'amarelo', 'vibrante'],
        },
      ],
      environment: [
        {
          concept: 'Quadra de tênis azul com linhas brancas',
          weight: 0.55,
          synonyms: ['quadra', 'quadra de tenis', 'piso azul', 'esporte'],
        },
        {
          concept: 'Terraço com vidro e prédios da cidade ao fundo',
          weight: 0.45,
          synonyms: ['terraco', 'telhado', 'cobertura', 'vidro', 'predios', 'cidade', 'ceu'],
        },
      ],
      botPrompts: [
        'Uma iguana verde de viseira esportiva rebatendo uma bola de tênis amarela com uma raquete numa quadra azul no terraço de um prédio, estilo história em quadrinhos',
        'Desenho estilo HQ em verde-lima e azul mostrando uma iguana tenista jogando em uma quadra cercada por vidro com prédios ao fundo',
        'Lagarto iguana atleta segurando raquete de tênis prestes a rebater a bolinha no alto de um edifício',
      ],
    },
  },
  {
    id: 'cavalo-marinho-rei',
    title: 'Rei Cavalo-Marinho em Vitral Submarino',
    category: 'Fundo do Mar & Vitral',
    difficulty: 'Médio',
    imageUrl: '/challenges/cavalo-marinho-rei.webp',
    fullPrompt:
      'Um cavalo-marinho dourado real usando uma coroa de ouro sentado em um trono de corais roxos e alaranjados cercado por pequenos peixes vermelhos nadando no fundo do mar, estilo arte em vitral colorido (stained glass) com contornos de chumbo em turquesa e dourado',
    subjectLayer:
      'Um cavalo-marinho dourado usando uma coroa real sentado em um trono de corais',
    styleLayer:
      'estilo arte em vitral colorido (stained glass) e mosaico luminoso com contornos pretos em turquesa e dourado',
    environmentLayer:
      'no fundo do mar cercado por recifes de corais coloridos e pequenos peixes laranjas ao redor',
    hint1:
      'Dica de Estilo (60s): Arte em Vitral colorido (mosaico de vidro iluminado) em tons de turquesa e dourado!',
    hint2:
      'Dica Principal (30s): Um cavalo-marinho usando coroa de rei sentado num trono de corais com peixes ao redor!',
    keywords: {
      subject: [
        {
          concept: 'Cavalo-marinho dourado usando coroa de rei',
          weight: 0.6,
          synonyms: ['cavalo-marinho', 'cavalo marinho', 'coroa', 'rei', 'realeza', 'dourado', 'monarca'],
        },
        {
          concept: 'Sentado em um trono de coral',
          weight: 0.4,
          synonyms: ['trono', 'cadeira real', 'sentado', 'trono de coral'],
        },
      ],
      style: [
        {
          concept: 'Arte em Vitral colorido / Mosaico de vidro',
          weight: 0.65,
          synonyms: ['vitral', 'mosaico', 'vidro colorido', 'stained glass', 'contornos pretos', 'geometrico'],
        },
        {
          concept: 'Paleta turquesa, azul e dourado luminoso',
          weight: 0.35,
          synonyms: ['turquesa', 'azul', 'dourado', 'laranja', 'roxo', 'iluminado'],
        },
      ],
      environment: [
        {
          concept: 'Recife de corais coloridos no fundo do mar',
          weight: 0.55,
          synonyms: ['corais', 'recife', 'fundo do mar', 'oceano', 'submarino', 'mar'],
        },
        {
          concept: 'Pequenos peixes laranjas nadando ao redor',
          weight: 0.45,
          synonyms: ['peixes', 'peixinhos', 'cardume', 'nadando'],
        },
      ],
      botPrompts: [
        'Um cavalo-marinho dourado usando coroa real sentado num trono de corais cercado por peixinhos no fundo do mar, estilo arte em vitral turquesa e dourado',
        'Ilustração em estilo vitral colorido de vidro mostrando um rei cavalo-marinho coroado entre corais e peixes laranjas',
        'Mosaico de vitral luminoso de um cavalo-marinho com coroa de ouro em seu trono submarino',
      ],
    },
  },
  {
    id: 'esquilo-cartografo',
    title: 'Esquilo Cartógrafo na Casa da Árvore',
    category: 'Aventura & Lápis de Cor',
    difficulty: 'Médio',
    imageUrl: '/challenges/esquilo-cartografo.webp',
    fullPrompt:
      'Um esquilo ruivo fofo desenhando um mapa ilustrado com lápis sobre uma mesa de madeira dentro do tronco oco de uma árvore aconchegante com janelas redondas, estantes de livros e uma lâmpada pendurada, estilo ilustração em lápis de cor texturizado em verde-musgo e castanho',
    subjectLayer:
      'Um esquilo ruivo fofo desenhando um mapa ilustrado com lápis sobre uma mesa de madeira',
    styleLayer:
      'estilo ilustração artesanal em lápis de cor texturizado com paleta aconchegante verde-musgo e castanho',
    environmentLayer:
      'dentro de uma sala escavada no tronco de uma árvore com janelas redondas, lâmpada quente e estantes de livros',
    hint1:
      'Dica de Estilo (60s): Ilustração artesanal com textura de Lápis de Cor em tons de castanho e verde-musgo!',
    hint2:
      'Dica Principal (30s): Um esquilo desenhando um mapa sobre uma mesa dentro do tronco de uma árvore com janelas redondas!',
    keywords: {
      subject: [
        {
          concept: 'Esquilo ruivo fofo cartógrafo',
          weight: 0.55,
          synonyms: ['esquilo', 'roedor', 'ruivo', 'laranja', 'rabo felpudo', 'cartografo', 'desenhista'],
        },
        {
          concept: 'Desenhando um mapa ilustrado com lápis na mesa',
          weight: 0.45,
          synonyms: ['mapa', 'pergaminho', 'papel', 'desenhando', 'escrevendo', 'lapis', 'caneta', 'cartografia'],
        },
      ],
      style: [
        {
          concept: 'Ilustração em lápis de cor texturizado',
          weight: 0.65,
          synonyms: ['lapis de cor', 'hachuras', 'desenho a mao', 'ilustracao infantil', 'livro ilustrado', 'textura'],
        },
        {
          concept: 'Paleta castanho amadeirado e verde-musgo',
          weight: 0.35,
          synonyms: ['castanho', 'marrom', 'madeira', 'verde-musgo', 'verde', 'quente', 'aconchegante'],
        },
      ],
      environment: [
        {
          concept: 'Casa dentro de tronco de árvore com janelas redondas',
          weight: 0.6,
          synonyms: ['arvore', 'tronco', 'casa na arvore', 'toca', 'janelas redondas', 'janela', 'madeira'],
        },
        {
          concept: 'Estantes de livros e lâmpada amarela pendurada',
          weight: 0.4,
          synonyms: ['estantes', 'livros', 'mesa', 'escrivaninha', 'lampada', 'biblioteca'],
        },
      ],
      botPrompts: [
        'Um esquilo ruivo fofo desenhando um mapa sobre uma mesa de madeira dentro de uma árvore oca com janelas redondas e estantes de livros, estilo lápis de cor',
        'Ilustração em lápis de cor em tons castanho e verde-musgo de um esquilo cartógrafo fazendo um mapa em sua toca na árvore iluminada',
        'Esquilinho desenhista com lápis na pata criando um mapa antigo numa escrivaninha dentro de um tronco com livros',
      ],
    },
  },
  {
    id: 'borboleta-maestra',
    title: 'Borboleta Maestra e a Orquestra do Jardim',
    category: 'Música & Colagem de Papel',
    difficulty: 'Difícil',
    imageUrl: '/challenges/borboleta-maestra.webp',
    fullPrompt:
      'Uma borboleta roxa e verde vibrante no alto de uma orquestra de pequenos insetos músicos tocando violino e flauta sobre folhas verdes cercados por grandes flores cor-de-rosa, lilases e brancas, estilo colagem de papel artesanal em camadas nos tons lilás, rosa e verde-esmeralda',
    subjectLayer:
      'Uma borboleta roxa e verde regendo uma pequena orquestra de insetos músicos tocando violino e flauta',
    styleLayer:
      'estilo colagem de papel recortado artesanal em relevo (paper collage) em tons de lilás, rosa e verde-esmeralda',
    environmentLayer:
      'sobre folhas verdes em um jardim repleto de flores gigantes cor-de-rosa, brancas e amarelas',
    hint1:
      'Dica de Estilo (60s): Colagem artesanal de papel em relevo nos tons de lilás, rosa e verde-esmeralda!',
    hint2:
      'Dica Principal (30s): Uma borboleta com uma orquestra de insetos tocando instrumentos num jardim de flores!',
    keywords: {
      subject: [
        {
          concept: 'Borboleta roxa e verde maestra',
          weight: 0.55,
          synonyms: ['borboleta', 'asas', 'maestra', 'regente', 'roxa', 'lilas'],
        },
        {
          concept: 'Orquestra de insetos tocando violino, flauta e batuta',
          weight: 0.45,
          synonyms: ['orquestra', 'insetos', 'musicos', 'violino', 'violoncelo', 'flauta', 'batuta', 'regendo', 'musica'],
        },
      ],
      style: [
        {
          concept: 'Colagem de papel artesanal em camadas',
          weight: 0.65,
          synonyms: ['colagem de papel', 'papel recortado', 'colagem', 'papercraft', 'relevo', 'artesanal'],
        },
        {
          concept: 'Paleta lilás, rosa e verde-esmeralda',
          weight: 0.35,
          synonyms: ['lilas', 'rosa', 'roxo', 'verde', 'verde-esmeralda', 'colorido'],
        },
      ],
      environment: [
        {
          concept: 'Jardim de flores gigantes desabrochadas',
          weight: 0.6,
          synonyms: ['jardim', 'flores', 'flores gigantes', 'petalas', 'natureza'],
        },
        {
          concept: 'Folhas verdes servindo de palco para os músicos',
          weight: 0.4,
          synonyms: ['folhas', 'folha verde', 'palco', 'plantas'],
        },
      ],
      botPrompts: [
        'Uma borboleta roxa e verde com uma orquestra de pequenos insetos tocando violino e flauta sobre folhas num jardim de flores gigantes rosa, estilo colagem de papel',
        'Arte em colagem de papel recortado lilás e verde mostrando uma borboleta maestra e insetos músicos entre grandes flores de papel',
        'Borboleta colorida e conjunto musical de insetos com violoncelo e batuta num jardim florido feito de papel em camadas',
      ],
    },
  },
  {
    "id": "flamingo-bailarino-vitral",
    "title": "Flamingo Bailarino em Vitral de Lótus",
    "category": "Dança & Vitral",
    "difficulty": "Médio",
    "imageUrl": "/challenges/flamingo-bailarino-vitral.webp",
    "fullPrompt": "Um gracioso flamingo cor-de-rosa usando coroa dourada dançando em uma perna sobre um lago espelhado cercado por flores de lótus cor-de-rosa abertas, estilo arte em vitral colorido e mosaico luminoso em magenta, azul-turquesa e dourado",
    "subjectLayer": "Um gracioso flamingo cor-de-rosa usando coroa dourada dançando em uma perna sobre a água",
    "styleLayer": "estilo arte em vitral colorido (stained glass) e mosaico luminoso em magenta, azul-turquesa e dourado",
    "environmentLayer": "sobre um lago espelhado cercado por grandes flores de lótus cor-de-rosa e folhagens iluminadas",
    "hint1": "Dica de Estilo (60s): Arte em Vitral colorido (mosaico de vidro) em tons de magenta, azul-turquesa e dourado!",
    "hint2": "Dica Principal (30s): Um flamingo rosa de coroa dourada dançando num lago cheio de flores de lótus!",
    "keywords": {
      "subject": [
        {
          "concept": "Flamingo cor-de-rosa com coroa dourada",
          "weight": 0.6,
          "synonyms": [
            "flamingo",
            "ave",
            "passaro rosa",
            "coroa",
            "tiara",
            "realeza",
            "rosa"
          ]
        },
        {
          "concept": "Dançando equilibrado em uma perna",
          "weight": 0.4,
          "synonyms": [
            "dancando",
            "bailarino",
            "bailarina",
            "bale",
            "equilibrado",
            "pose",
            "elegante"
          ]
        }
      ],
      "style": [
        {
          "concept": "Arte em Vitral colorido / Mosaico de vidro",
          "weight": 0.65,
          "synonyms": [
            "vitral",
            "mosaico",
            "stained glass",
            "vidro colorido",
            "contornos",
            "vitrais"
          ]
        },
        {
          "concept": "Paleta magenta, azul-turquesa e dourado",
          "weight": 0.35,
          "synonyms": [
            "magenta",
            "rosa",
            "turquesa",
            "azul",
            "dourado",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Lago espelhado com reflexos na água",
          "weight": 0.5,
          "synonyms": [
            "lago",
            "lagoa",
            "agua",
            "espelhado",
            "reflexo",
            "ondas"
          ]
        },
        {
          "concept": "Flores de lótus cor-de-rosa abertas",
          "weight": 0.5,
          "synonyms": [
            "lotus",
            "flores de lotus",
            "flores",
            "nenufares",
            "vitoria-regia",
            "petalas"
          ]
        }
      ],
      "botPrompts": [
        "Um flamingo cor-de-rosa usando coroa dourada dançando em um lago cercado por flores de lótus rosas em estilo vitral colorido azul e magenta",
        "Arte em mosaico de vitral luminoso mostrando um flamingo bailarino coroado sobre a água entre flores de lótus abertas",
        "Flamingo elegante de coroa de ouro equilibrado na lagoa florida em ilustração de vitral turquesa e rosa"
      ]
    }
  },
  {
    "id": "urso-polar-sorveteiro",
    "title": "Urso Polar Sorveteiro sob a Aurora Boreal",
    "category": "Gastronomia & Ártico",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/urso-polar-sorveteiro.webp",
    "fullPrompt": "Um urso polar branco simpático usando gravata-borboleta xadrez servindo casquinhas de sorvete coloridas em um carrinho de sorvete de madeira com toldo sobre o gelo do Ártico sob luzes de aurora boreal verde e roxa, estilo animação 3D Pixar",
    "subjectLayer": "Um urso polar branco simpático de gravata-borboleta servindo casquinhas de sorvete coloridas",
    "styleLayer": "estilo animação 3D Pixar fofa e vibrante com iluminação suave de aurora boreal em tons pastel",
    "environmentLayer": "em um carrinho de sorvete de madeira com toldo sobre o gelo do Ártico sob a aurora boreal",
    "hint1": "Dica de Estilo (60s): Animação 3D estilo Pixar em tons pastel sob o brilho da aurora boreal!",
    "hint2": "Dica Principal (30s): Um urso polar de gravata-borboleta vendendo sorvetes num carrinho no gelo do Ártico!",
    "keywords": {
      "subject": [
        {
          "concept": "Urso polar branco com gravata-borboleta",
          "weight": 0.55,
          "synonyms": [
            "urso polar",
            "urso branco",
            "urso",
            "sorveteiro",
            "vendedor",
            "gravata-borboleta",
            "gravata"
          ]
        },
        {
          "concept": "Servindo casquinhas de sorvete coloridas",
          "weight": 0.45,
          "synonyms": [
            "sorvete",
            "casquinha",
            "sorvetes",
            "doce",
            "servindo",
            "vendendo",
            "colorido"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação 3D estilo Pixar",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "pixar",
            "animacao",
            "disney",
            "render 3d",
            "cartoon 3d",
            "fofo"
          ]
        },
        {
          "concept": "Tons pastel e luz suave de aurora",
          "weight": 0.35,
          "synonyms": [
            "pastel",
            "tons pastel",
            "colorido",
            "suave",
            "brilhante",
            "iluminado"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Carrinho de sorvete com toldo sobre o gelo do Ártico",
          "weight": 0.55,
          "synonyms": [
            "carrinho",
            "carrinho de sorvete",
            "barraca",
            "toldo",
            "gelo",
            "artico",
            "neve",
            "polo norte"
          ]
        },
        {
          "concept": "Céu noturno com aurora boreal verde e roxa",
          "weight": 0.45,
          "synonyms": [
            "aurora boreal",
            "aurora",
            "ceu",
            "luzes no ceu",
            "verde e roxo"
          ]
        }
      ],
      "botPrompts": [
        "Um urso polar fofo de gravata-borboleta vendendo casquinhas de sorvete coloridas num carrinho sobre o gelo do Ártico com aurora boreal no céu, animação 3D Pixar",
        "Render 3D estilo Pixar de um urso polar sorveteiro sorridente atrás de seu carrinho de madeira sob luzes de aurora boreal",
        "Urso branco simpático servindo sorvetes rosa, azul e verde na geleira polar iluminada pela aurora"
      ]
    }
  },
  {
    "id": "macaco-barista-selva",
    "title": "Macaco Barista na Cafeteria da Floresta",
    "category": "Gastronomia & Natureza",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/macaco-barista-selva.webp",
    "fullPrompt": "Um macaco simpático vestindo avental verde de barista operando uma máquina de café expresso dourada e cobre dentro de uma cafeteria na casa da árvore cercada por folhagens tropicais e lâmpadas amarelas penduradas, estilo ilustração digital em verde-esmeralda e cobre",
    "subjectLayer": "Um macaco simpático vestindo avental verde de barista preparando café em uma máquina de expresso de cobre",
    "styleLayer": "estilo ilustração digital aconchegante com iluminação quente em tons de verde-esmeralda, dourado e cobre",
    "environmentLayer": "dentro de uma cafeteria na floresta tropical cercada por folhas verdes, cipós e lâmpadas penduradas",
    "hint1": "Dica de Estilo (60s): Ilustração digital aconchegante em tons de verde-esmeralda e brilho de cobre!",
    "hint2": "Dica Principal (30s): Um macaco de avental verde preparando café expresso numa máquina na floresta!",
    "keywords": {
      "subject": [
        {
          "concept": "Macaco simpático vestindo avental verde de barista",
          "weight": 0.55,
          "synonyms": [
            "macaco",
            "macaquinho",
            "primata",
            "chimpanze",
            "barista",
            "avental verde",
            "avental",
            "atendente"
          ]
        },
        {
          "concept": "Operando máquina de café expresso de cobre",
          "weight": 0.45,
          "synonyms": [
            "cafe",
            "expresso",
            "maquina de cafe",
            "cafeteira",
            "cobre",
            "dourada",
            "preparando cafe"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração digital aconchegante e vibrante",
          "weight": 0.65,
          "synonyms": [
            "ilustracao digital",
            "pintura digital",
            "cartoon",
            "3d estilizado",
            "aconchegante",
            "detalhado"
          ]
        },
        {
          "concept": "Paleta verde-esmeralda e cobre dourado",
          "weight": 0.35,
          "synonyms": [
            "verde",
            "esmeralda",
            "cobre",
            "dourado",
            "ambar",
            "luz quente"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Cafeteria na floresta tropical com folhagens",
          "weight": 0.55,
          "synonyms": [
            "floresta",
            "selva",
            "folhas",
            "plantas",
            "cafeteria",
            "casa na arvore",
            "tropical"
          ]
        },
        {
          "concept": "Lâmpadas amarelas penduradas entre os ramos",
          "weight": 0.45,
          "synonyms": [
            "lampadas",
            "luzes penduradas",
            "iluminacao",
            "lanternas"
          ]
        }
      ],
      "botPrompts": [
        "Um macaco simpático de avental verde preparando café numa máquina de expresso de cobre em uma cafeteria na floresta iluminada por lâmpadas penduradas, ilustração digital",
        "Arte digital em verde e cobre mostrando um macaquinho barista sorridente operando uma cafeteira dourada entre folhas tropicais",
        "Macaco barista vestindo avental verde tirando café expresso numa casa na árvore cheia de plantas e luzes quentes"
      ]
    }
  },
  {
    "id": "canguru-baterista-festival",
    "title": "Canguru Baterista no Festival do Parque",
    "category": "Música & Animação 3D",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/canguru-baterista-festival.webp",
    "fullPrompt": "Um canguru jovem e sorridente usando fones de ouvido tocando uma bateria colorida com baquetas em um parque arborizado ensolarado decorado com lanternas de papel amarelas e laranjas penduradas, estilo animação 3D Pixar vibrante",
    "subjectLayer": "Um canguru sorridente usando fones de ouvido tocando uma bateria colorida com baquetas",
    "styleLayer": "estilo animação 3D Pixar vibrante com iluminação solar diurna e profundidade de campo suave",
    "environmentLayer": "em um parque verde ensolarado ao ar livre decorado com lanternas amarelas e laranjas nas árvores",
    "hint1": "Dica de Estilo (60s): Animação 3D estilo Pixar ensolarada com fundo desfocado e lanternas coloridas!",
    "hint2": "Dica Principal (30s): Um canguru de fones de ouvido tocando bateria num parque cheio de lanternas!",
    "keywords": {
      "subject": [
        {
          "concept": "Canguru sorridente usando fones de ouvido",
          "weight": 0.55,
          "synonyms": [
            "canguru",
            "animal",
            "fones de ouvido",
            "headphone",
            "fones",
            "musico",
            "baterista"
          ]
        },
        {
          "concept": "Tocando bateria colorida com baquetas",
          "weight": 0.45,
          "synonyms": [
            "bateria",
            "tambores",
            "pratos",
            "baquetas",
            "tocando bateria",
            "instrumento",
            "musica"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação 3D estilo Pixar",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "pixar",
            "animacao",
            "disney",
            "render 3d",
            "cartoon 3d"
          ]
        },
        {
          "concept": "Luz solar vibrante e alegre",
          "weight": 0.35,
          "synonyms": [
            "ensolarado",
            "vibrante",
            "colorido",
            "alegre",
            "luz do dia"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Parque verde arborizado ao ar livre",
          "weight": 0.55,
          "synonyms": [
            "parque",
            "jardim",
            "arvores",
            "grama",
            "ar livre",
            "natureza",
            "festival"
          ]
        },
        {
          "concept": "Lanternas de papel amarelas e laranjas penduradas",
          "weight": 0.45,
          "synonyms": [
            "lanternas",
            "lanternas de papel",
            "luminarias",
            "amarelas",
            "enfeites"
          ]
        }
      ],
      "botPrompts": [
        "Um canguru fofo usando fones de ouvido tocando uma bateria colorida com baquetas num parque ensolarado com lanternas amarelas nas árvores, animação 3D Pixar",
        "Render 3D vibrante de um canguru baterista sorridente fazendo música ao ar livre sob um varal de lanternas laranjas",
        "Canguru músico com headphone vermelho tocando tambores e pratos de bateria num jardim iluminado pelo sol"
      ]
    }
  },
  {
    "id": "hipopotamo-submarino-steampunk",
    "title": "Hipopótamo Capitão no Submarino Steampunk",
    "category": "Aventura & Steampunk",
    "difficulty": "Médio",
    "imageUrl": "/challenges/hipopotamo-submarino-steampunk.webp",
    "fullPrompt": "Um hipopótamo simpático usando quepe de capitão de latão pilotando um submarino redondo amarelo e cobre com vigias de vidro através de um cânion submarino repleto de corais coloridos e feixes de luz no oceano, estilo ilustração 3D estilizada de aventura steampunk",
    "subjectLayer": "Um hipopótamo simpático de quepe de capitão pilotando um submarino redondo amarelo e cobre",
    "styleLayer": "estilo ilustração 3D estilizada de aventura steampunk com iluminação subaquática azul e dourada",
    "environmentLayer": "navegando pelo fundo do mar entre recifes de corais coloridos e rochas submarinas",
    "hint1": "Dica de Estilo (60s): Ilustração 3D de aventura Steampunk com submarino de cobre e luz subaquática!",
    "hint2": "Dica Principal (30s): Um hipopótamo de quepe de capitão pilotando um submarino amarelo no fundo do mar!",
    "keywords": {
      "subject": [
        {
          "concept": "Hipopótamo simpático com quepe de capitão",
          "weight": 0.55,
          "synonyms": [
            "hipopotamo",
            "animal",
            "capitao",
            "marinheiro",
            "quepe",
            "chapeu de capitao",
            "piloto"
          ]
        },
        {
          "concept": "Pilotando submarino redondo amarelo e cobre",
          "weight": 0.45,
          "synonyms": [
            "submarino",
            "nave submarina",
            "amarelo",
            "cobre",
            "vigia",
            "escotilha",
            "pilotando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração 3D estilizada Steampunk",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "steampunk",
            "ilustracao 3d",
            "animacao",
            "aventura",
            "latao"
          ]
        },
        {
          "concept": "Iluminação subaquática azul e dourada",
          "weight": 0.35,
          "synonyms": [
            "subaquatico",
            "azul",
            "dourado",
            "colorido",
            "feixes de luz"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Cânion submarino no fundo do mar",
          "weight": 0.55,
          "synonyms": [
            "fundo do mar",
            "oceano",
            "mar",
            "agua",
            "submarino",
            "canion"
          ]
        },
        {
          "concept": "Recifes de corais coloridos ao redor",
          "weight": 0.45,
          "synonyms": [
            "corais",
            "recife",
            "plantas marinhas",
            "rochas"
          ]
        }
      ],
      "botPrompts": [
        "Um hipopótamo simpático usando quepe de capitão pilotando um submarino amarelo e cobre estilo steampunk no fundo do mar cercado por corais, ilustração 3D",
        "Arte 3D de aventura steampunk mostrando um capitão hipopótamo dentro de um submarino redondo navegando entre recifes de corais",
        "Hipopótamo marinheiro comandando seu submarino de latão pelas águas azuis iluminadas do oceano"
      ]
    }
  },
  {
    "id": "suricato-detetive-londres",
    "title": "Suricato Detetive na Rua de Paralelepípedos",
    "category": "Mistério & Aquarela",
    "difficulty": "Médio",
    "imageUrl": "/challenges/suricato-detetive-londres.webp",
    "fullPrompt": "Um suricato detetive esperto vestindo chapéu xadrez estilo Sherlock e sobretudo bege segurando uma lupa para examinar pegadas brilhantes em uma rua de paralelepípedos iluminada por um lampião a gás antigo, estilo ilustração de livro em aquarela e nanquim",
    "subjectLayer": "Um suricato detetive de chapéu xadrez e sobretudo segurando uma lupa para investigar pegadas",
    "styleLayer": "estilo ilustração clássica de livro de histórias em aquarela e nanquim com luz quente de lampião",
    "environmentLayer": "em uma rua histórica de paralelepípedos ao lado de um poste de lampião aceso e prédios antigos",
    "hint1": "Dica de Estilo (60s): Ilustração clássica de livro em aquarela e nanquim com luz quente de lampião!",
    "hint2": "Dica Principal (30s): Um suricato vestido de detetive com lupa investigando pegadas numa rua de pedra!",
    "keywords": {
      "subject": [
        {
          "concept": "Suricato detetive de chapéu xadrez e sobretudo",
          "weight": 0.55,
          "synonyms": [
            "suricato",
            "suricate",
            "detetive",
            "investigador",
            "sherlock",
            "chapeu xadrez",
            "sobretudo",
            "casaco"
          ]
        },
        {
          "concept": "Segurando lupa para examinar pegadas",
          "weight": 0.45,
          "synonyms": [
            "lupa",
            "lente",
            "pegadas",
            "pistas",
            "investigando",
            "olhando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração de livro em aquarela e nanquim",
          "weight": 0.65,
          "synonyms": [
            "aquarela",
            "nanquim",
            "livro ilustrado",
            "ilustracao",
            "pintura",
            "desenho"
          ]
        },
        {
          "concept": "Luz âmbar quente de lampião antigo",
          "weight": 0.35,
          "synonyms": [
            "lampiao",
            "lampiao a gas",
            "luz quente",
            "ambar",
            "dourado",
            "aconchegante",
            "classico"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Rua de paralelepípedos com prédios antigos",
          "weight": 0.55,
          "synonyms": [
            "rua",
            "paralelepipedos",
            "calcada",
            "londres",
            "predios",
            "cidade antiga"
          ]
        },
        {
          "concept": "Poste de lampião a gás iluminado",
          "weight": 0.45,
          "synonyms": [
            "lampiao",
            "poste",
            "luminaria",
            "luz de rua"
          ]
        }
      ],
      "botPrompts": [
        "Um suricato vestido de detetive com chapéu xadrez e sobretudo segurando uma lupa para examinar pegadas numa rua de paralelepípedos sob um lampião, ilustração em aquarela",
        "Ilustração estilo livro infantil em aquarela e nanquim de um suricato investigador procurando pistas na calçada antiga iluminada",
        "Suricato Sherlock Holmes com lupa na mão investigando rastros brilhantes perto de um poste de luz antigo"
      ]
    }
  },
  {
    "id": "ornitorrinco-lutier-violino",
    "title": "Ornitorrinco Lutier na Oficina de Violinos",
    "category": "Música & Ofícios",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/ornitorrinco-lutier-violino.webp",
    "fullPrompt": "Um ornitorrinco simpático usando óculos de meia-lua e avental de artesão esculpindo um violino de madeira brilhante sobre uma bancada repleta de ferramentas e lascas de madeira com violinos pendurados ao fundo, estilo pintura digital aconchegante em âmbar e mogno",
    "subjectLayer": "Um ornitorrinco simpático de óculos e avental esculpindo um violino de madeira na bancada",
    "styleLayer": "estilo pintura digital aconchegante com iluminação quente em tons de âmbar dourado e madeira mogno",
    "environmentLayer": "em uma oficina de lutier tradicional cercada por ferramentas, lascas de madeira e violinos pendurados",
    "hint1": "Dica de Estilo (60s): Pintura digital aconchegante em tons quentes de âmbar dourado e madeira mogno!",
    "hint2": "Dica Principal (30s): Um ornitorrinco de óculos e avental construindo um violino numa oficina de madeira!",
    "keywords": {
      "subject": [
        {
          "concept": "Ornitorrinco de óculos e avental de artesão",
          "weight": 0.55,
          "synonyms": [
            "ornitorrinco",
            "animal",
            "bico de pato",
            "oculos",
            "avental",
            "lutier",
            "artesao",
            "marceneiro"
          ]
        },
        {
          "concept": "Esculpindo um violino de madeira",
          "weight": 0.45,
          "synonyms": [
            "violino",
            "instrumento",
            "cordas",
            "esculpindo",
            "construindo",
            "consertando",
            "musica"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura digital aconchegante e detalhada",
          "weight": 0.65,
          "synonyms": [
            "pintura digital",
            "ilustracao digital",
            "aconchegante",
            "cozy",
            "detalhado",
            "ilustracao"
          ]
        },
        {
          "concept": "Tons quentes de âmbar e madeira mogno",
          "weight": 0.35,
          "synonyms": [
            "ambar",
            "dourado",
            "madeira",
            "marrom",
            "mogno",
            "luz quente"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Oficina de lutier com bancada e lascas de madeira",
          "weight": 0.55,
          "synonyms": [
            "oficina",
            "bancada",
            "marcenaria",
            "atelie",
            "lascas de madeira",
            "ferramentas"
          ]
        },
        {
          "concept": "Instrumentos e violinos pendurados ao fundo",
          "weight": 0.45,
          "synonyms": [
            "violinos pendurados",
            "instrumentos",
            "parede",
            "prateleiras"
          ]
        }
      ],
      "botPrompts": [
        "Um ornitorrinco simpático de óculos e avental trabalhando em um violino de madeira sobre a bancada de uma oficina cheia de instrumentos pendurados, pintura digital quente",
        "Ilustração digital aconchegante em tons âmbar mostrando um ornitorrinco lutier construindo um violino cercado por ferramentas e madeira",
        "Ornitorrinco artesão com óculos no bico polindo um violino artesanal em seu ateliê de música iluminado"
      ]
    }
  },
  {
    "id": "pelicano-faroleiro-tempestade",
    "title": "Pelicano Faroleiro no Pôr do Sol Marítimo",
    "category": "Oceano & Pintura a Guache",
    "difficulty": "Médio",
    "imageUrl": "/challenges/pelicano-faroleiro-tempestade.webp",
    "fullPrompt": "Um pelicano corajoso vestindo capa impermeável amarela de marinheiro e quepe de capitão acendendo a grande lanterna de cristal no topo de um farol listrado de vermelho e branco diante das ondas do mar ao pôr do sol, estilo pintura expressiva em guache",
    "subjectLayer": "Um pelicano vestindo capa amarela de marinheiro e quepe acendendo a lanterna no topo de um farol",
    "styleLayer": "estilo pintura expressiva em guache com pinceladas vibrantes e luz dourada de pôr do sol",
    "environmentLayer": "no alto de um farol costeiro listrado de vermelho e branco acima das ondas do oceano ao entardecer",
    "hint1": "Dica de Estilo (60s): Pintura artística em guache com cores quentes do pôr do sol sobre o mar!",
    "hint2": "Dica Principal (30s): Um pelicano de capa amarela e quepe acendendo a luz de um farol diante das ondas!",
    "keywords": {
      "subject": [
        {
          "concept": "Pelicano vestindo capa amarela e quepe de marinheiro",
          "weight": 0.55,
          "synonyms": [
            "pelicano",
            "ave marinha",
            "passaro",
            "bico grande",
            "capa amarela",
            "marinheiro",
            "faroleiro",
            "quepe"
          ]
        },
        {
          "concept": "Acendendo a grande lanterna de cristal do farol",
          "weight": 0.45,
          "synonyms": [
            "lanterna",
            "luz do farol",
            "farol",
            "acendendo",
            "iluminando",
            "cristal"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura expressiva em guache / aquarela",
          "weight": 0.65,
          "synonyms": [
            "guache",
            "gouache",
            "pintura",
            "aquarela",
            "pinceladas",
            "ilustracao",
            "artistico"
          ]
        },
        {
          "concept": "Luz dourada e alaranjada de pôr do sol",
          "weight": 0.35,
          "synonyms": [
            "por do sol",
            "entardecer",
            "dourado",
            "laranja",
            "vibrante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Topo de farol costeiro vermelho e branco",
          "weight": 0.55,
          "synonyms": [
            "farol",
            "torre do farol",
            "vermelho e branco",
            "costa",
            "varanda"
          ]
        },
        {
          "concept": "Ondas do mar e céu do entardecer ao fundo",
          "weight": 0.45,
          "synonyms": [
            "mar",
            "oceano",
            "ondas",
            "agua",
            "ceu"
          ]
        }
      ],
      "botPrompts": [
        "Um pelicano de capa amarela de marinheiro e quepe acendendo a lanterna brilhante no topo de um farol vermelho e branco sobre as ondas do mar ao pôr do sol, pintura em guache",
        "Ilustração artística em guache mostrando um pelicano faroleiro cuidando da luz do farol costeiro diante do oceano dourado",
        "Ave pelicano vestida de capitão iluminando o farol marítimo acima das ondas no entardecer colorido"
      ]
    }
  },
  {
    "id": "castor-arquiteto-ponte",
    "title": "Castor Arquiteto na Ponte da Montanha",
    "category": "Engenharia & Ilustração 3D",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/castor-arquiteto-ponte.webp",
    "fullPrompt": "Um castor fofo usando capacete azul de engenheiro e óculos segurando plantas arquitetônicas azuis enroladas sobre uma ponte pênsil de madeira acima de um rio cristalino cercado por pinheiros e montanhas, estilo ilustração 3D isométrica cartoon",
    "subjectLayer": "Um castor fofo de capacete azul e óculos segurando plantas arquitetônicas sobre uma ponte de madeira",
    "styleLayer": "estilo ilustração 3D cartoon isométrica vibrante com iluminação diurna limpa e cores alegres",
    "environmentLayer": "sobre uma ponte suspensa de madeira cruzando um rio de montanha cercado por floresta de pinheiros",
    "hint1": "Dica de Estilo (60s): Ilustração 3D cartoon estilizada com cores vibrantes e luz natural do dia!",
    "hint2": "Dica Principal (30s): Um castor de capacete azul e óculos com plantas de arquitetura numa ponte de madeira!",
    "keywords": {
      "subject": [
        {
          "concept": "Castor fofo de capacete azul e óculos",
          "weight": 0.55,
          "synonyms": [
            "castor",
            "roedor",
            "arquiteto",
            "engenheiro",
            "construtor",
            "capacete azul",
            "capacete",
            "oculos"
          ]
        },
        {
          "concept": "Segurando plantas arquitetônicas (blueprints)",
          "weight": 0.45,
          "synonyms": [
            "planta",
            "plantas",
            "mapa",
            "projeto",
            "blueprint",
            "rolo de papel",
            "desenho tecnico"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração 3D cartoon / isométrica",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "cartoon 3d",
            "isometrica",
            "animacao 3d",
            "pixar",
            "ilustracao"
          ]
        },
        {
          "concept": "Cores naturais alegres e ensolaradas",
          "weight": 0.35,
          "synonyms": [
            "vibrante",
            "colorido",
            "ensolarado",
            "azul e verde",
            "madeira"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Ponte de madeira sobre um rio cristalino",
          "weight": 0.55,
          "synonyms": [
            "ponte",
            "ponte de madeira",
            "rio",
            "riacho",
            "agua"
          ]
        },
        {
          "concept": "Floresta de pinheiros e montanhas ao fundo",
          "weight": 0.45,
          "synonyms": [
            "pinheiros",
            "arvores",
            "floresta",
            "montanhas",
            "natureza"
          ]
        }
      ],
      "botPrompts": [
        "Um castor fofo de capacete azul e óculos segurando plantas de arquitetura sobre uma ponte de madeira acima de um rio com pinheiros, ilustração 3D cartoon",
        "Render 3D colorido de um castor arquiteto conferindo o projeto de construção de uma ponte suspensa na floresta de montanha",
        "Castor engenheiro simpático usando capacete de segurança e óculos numa ponte de madeira sobre o riacho"
      ]
    }
  },
  {
    "id": "foca-malabarista-circo",
    "title": "Foca Malabarista de Planetas no Circo Estelar",
    "category": "Circo & Ilustração Vintage",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/foca-malabarista-circo.webp",
    "fullPrompt": "Uma foca simpática usando gola plissada colorida de artista equilibrando pequenos planetas luminosos com anéis no focinho dentro de uma tenda de circo mágica azul estrelada iluminada por holofotes dourados, estilo ilustração de pôster de circo vintage",
    "subjectLayer": "Uma foca simpática de gola colorida equilibrando planetas luminosos no focinho",
    "styleLayer": "estilo ilustração de pôster de circo vintage com contraste entre azul estrelado e holofotes dourados",
    "environmentLayer": "no picadeiro de uma tenda de circo mágica decorada com estrelas e luzes de palco douradas",
    "hint1": "Dica de Estilo (60s): Ilustração estilo pôster de circo vintage com luzes douradas e tenda azul estrelada!",
    "hint2": "Dica Principal (30s): Uma foca equilibrando planetas luminosos no focinho dentro de uma tenda de circo!",
    "keywords": {
      "subject": [
        {
          "concept": "Foca simpática com gola colorida de circo",
          "weight": 0.55,
          "synonyms": [
            "foca",
            "leao-marinho",
            "animal marinho",
            "malabarista",
            "artista",
            "gola",
            "colarinho"
          ]
        },
        {
          "concept": "Equilibrando planetas luminosos no focinho",
          "weight": 0.45,
          "synonyms": [
            "equilibrando",
            "malabarismo",
            "planetas",
            "esferas",
            "bolas",
            "focinho",
            "nariz"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração de pôster de circo vintage",
          "weight": 0.6,
          "synonyms": [
            "poster",
            "vintage",
            "retro",
            "ilustracao",
            "pintura digital",
            "magico"
          ]
        },
        {
          "concept": "Paleta azul estrelado e dourado brilhante",
          "weight": 0.4,
          "synonyms": [
            "dourado",
            "azul",
            "brilhante",
            "luminoso",
            "colorido"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Tenda de circo mágica com lona estrelada",
          "weight": 0.6,
          "synonyms": [
            "circo",
            "tenda",
            "picadeiro",
            "palco",
            "estrelas",
            "lona"
          ]
        },
        {
          "concept": "Holofotes dourados de espetáculo",
          "weight": 0.4,
          "synonyms": [
            "holofotes",
            "luzes",
            "espetaculo",
            "show"
          ]
        }
      ],
      "botPrompts": [
        "Uma foca simpática com gola de circo equilibrando pequenos planetas luminosos no focinho dentro de uma tenda azul estrelada com holofotes dourados, ilustração vintage",
        "Arte colorida estilo pôster de circo mostrando uma foca malabarista fazendo malabarismo com esferas de planetas no picadeiro iluminado",
        "Foca alegre equilibrando astros brilhantes no nariz sob a lona estrelada de um circo mágico"
      ]
    }
  },
  {
    "id": "texugo-relojoeiro-cuco",
    "title": "Texugo Artesão e o Relógio Cuco Alpino",
    "category": "Artesanato & Aquarela",
    "difficulty": "Médio",
    "imageUrl": "/challenges/texugo-relojoeiro-cuco.webp",
    "fullPrompt": "Um texugo simpático vestindo colete de couro e monóculo pintando com pincel um relógio cuco de madeira entalhada com pinhas e um passarinho mecânico dentro de uma cabana alpina aconchegante, estilo ilustração em lápis de cor e aquarela",
    "subjectLayer": "Um texugo simpático de colete de couro e monóculo pintando um relógio cuco de madeira entalhada",
    "styleLayer": "estilo ilustração tradicional em lápis de cor e aquarela com tons amadeirados quentes",
    "environmentLayer": "na bancada de uma cabana alpina de madeira cercada por ferramentas de entalhe e relógios",
    "hint1": "Dica de Estilo (60s): Ilustração artesanal em lápis de cor e aquarela com tons amadeirados quentes!",
    "hint2": "Dica Principal (30s): Um texugo de colete e monóculo pintando um relógio cuco de madeira numa cabana!",
    "keywords": {
      "subject": [
        {
          "concept": "Texugo simpático de colete de couro e monóculo",
          "weight": 0.55,
          "synonyms": [
            "texugo",
            "animal",
            "colete",
            "monoculo",
            "oculos",
            "relojoeiro",
            "artesao",
            "pintor"
          ]
        },
        {
          "concept": "Pintando um relógio cuco de madeira com passarinho",
          "weight": 0.45,
          "synonyms": [
            "relogio cuco",
            "relogio de madeira",
            "cuco",
            "passarinho",
            "pintando",
            "pincel",
            "relogio"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração em lápis de cor e aquarela",
          "weight": 0.65,
          "synonyms": [
            "lapis de cor",
            "aquarela",
            "ilustracao",
            "livro ilustrado",
            "desenho",
            "artesanal"
          ]
        },
        {
          "concept": "Tons amadeirados quentes e aconchegantes",
          "weight": 0.35,
          "synonyms": [
            "madeira",
            "marrom",
            "quente",
            "aconchegante",
            "dourado"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Oficina em cabana alpina de madeira",
          "weight": 0.6,
          "synonyms": [
            "cabana",
            "oficina",
            "bancada",
            "atelie",
            "alpina",
            "madeira"
          ]
        },
        {
          "concept": "Entalhes de pinhas e ferramentas ao redor",
          "weight": 0.4,
          "synonyms": [
            "pinhas",
            "ferramentas",
            "entalhe",
            "prateleiras"
          ]
        }
      ],
      "botPrompts": [
        "Um texugo simpático usando colete e monóculo pintando um relógio cuco de madeira com passarinho dentro de uma cabana alpina, ilustração em lápis de cor e aquarela",
        "Desenho aconchegante em aquarela e lápis de cor de um texugo relojoeiro decorando um relógio cuco entalhado na bancada",
        "Texugo artesão com pincel na mão finalizando um relógio de madeira tradicional em sua oficina na montanha"
      ]
    }
  },
  {
    "id": "alce-carteiro-treno",
    "title": "Alce Carteiro no Trenó da Floresta Nevada",
    "category": "Inverno & Guache",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/alce-carteiro-treno.webp",
    "fullPrompt": "Um alce simpático de grandes chifres vestindo suéter de lã vermelho e cachecol conduzindo um trenó de madeira carregado de pacotes e presentes coloridos por uma floresta de pinheiros coberta de neve sob o céu pastel do entardecer, estilo ilustração em guache de livro infantil",
    "subjectLayer": "Um alce simpático de suéter vermelho e cachecol conduzindo um trenó cheio de pacotes coloridos",
    "styleLayer": "estilo ilustração em guache de livro infantil com cores suaves de pôr do sol na neve",
    "environmentLayer": "atravessando uma trilha de neve entre pinheiros sob um céu em tons rosa e dourado",
    "hint1": "Dica de Estilo (60s): Ilustração de livro infantil pintada em guache com céu pastel sobre a neve!",
    "hint2": "Dica Principal (30s): Um alce de suéter vermelho conduzindo um trenó cheio de pacotes numa floresta nevada!",
    "keywords": {
      "subject": [
        {
          "concept": "Alce simpático vestindo suéter vermelho e cachecol",
          "weight": 0.55,
          "synonyms": [
            "alce",
            "rena",
            "cervo",
            "chifres",
            "sueter vermelho",
            "blusa de la",
            "cachecol",
            "carteiro"
          ]
        },
        {
          "concept": "Conduzindo trenó de madeira com pacotes e presentes",
          "weight": 0.45,
          "synonyms": [
            "treno",
            "pacotes",
            "presentes",
            "caixas",
            "encomendas",
            "correio",
            "levando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração em guache de livro infantil",
          "weight": 0.65,
          "synonyms": [
            "guache",
            "livro infantil",
            "livro ilustrado",
            "ilustracao",
            "pintura",
            "aquarela"
          ]
        },
        {
          "concept": "Céu pastel rosa e dourado de entardecer",
          "weight": 0.35,
          "synonyms": [
            "pastel",
            "por do sol",
            "rosa",
            "dourado",
            "suave",
            "colorido"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Floresta de pinheiros coberta de neve",
          "weight": 0.6,
          "synonyms": [
            "neve",
            "floresta",
            "pinheiros",
            "inverno",
            "arvores",
            "nevada"
          ]
        },
        {
          "concept": "Trilha branca sob o céu de fim de tarde",
          "weight": 0.4,
          "synonyms": [
            "trilha",
            "caminho",
            "ceu",
            "montanhas"
          ]
        }
      ],
      "botPrompts": [
        "Um alce simpático vestindo suéter vermelho e cachecol conduzindo um trenó de madeira cheio de presentes coloridos pela floresta de pinheiros na neve, ilustração em guache",
        "Pintura estilo livro infantil de um alce carteiro levando pacotes num trenó sob o céu rosa do pôr do sol no inverno",
        "Alce de blusa de lã vermelha entregando encomendas em um trenó através da neve entre pinheiros"
      ]
    }
  },
  {
    "id": "porco-espinho-tricoteiro",
    "title": "Porco-Espinho Tricoteiro na Poltrona de Balanço",
    "category": "Aconchego & Stop-Motion",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/porco-espinho-tricoteiro.webp",
    "fullPrompt": "Um porco-espinho fofo usando pequenos óculos redondos sentado em uma cadeira de balanço de madeira tricotando um longo cachecol de lã colorido de arco-íris cercado por novelos de lã diante de uma lareira acesa em sua toca, estilo animação stop-motion de massinha",
    "subjectLayer": "Um porco-espinho fofo de óculos redondos sentado na cadeira de balanço tricotando um cachecol arco-íris",
    "styleLayer": "estilo animação stop-motion de massinha (claymation) com iluminação quente e aconchegante de lareira",
    "environmentLayer": "dentro de uma toca aconchegante com lareira acesa e cestos cheios de novelos de lã coloridos",
    "hint1": "Dica de Estilo (60s): Animação Stop-Motion de massinha (claymation) com luz aconchegante de lareira!",
    "hint2": "Dica Principal (30s): Um porco-espinho de óculos tricotando um cachecol colorido numa cadeira de balanço!",
    "keywords": {
      "subject": [
        {
          "concept": "Porco-espinho fofo usando óculos redondos",
          "weight": 0.55,
          "synonyms": [
            "porco-espinho",
            "ourico",
            "animal",
            "espinhos",
            "oculos",
            "oculos redondos",
            "fofo"
          ]
        },
        {
          "concept": "Tricotando cachecol de lã colorido de arco-íris",
          "weight": 0.45,
          "synonyms": [
            "tricotando",
            "trico",
            "agulhas",
            "cachecol",
            "la",
            "novelos",
            "arco-iris",
            "colorido"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação stop-motion de massinha (claymation)",
          "weight": 0.65,
          "synonyms": [
            "massinha",
            "stop-motion",
            "claymation",
            "3d",
            "animacao",
            "boneco"
          ]
        },
        {
          "concept": "Iluminação quente e aconchegante",
          "weight": 0.35,
          "synonyms": [
            "aconchegante",
            "quente",
            "dourado",
            "colorido",
            "suave"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Cadeira de balanço em toca com lareira acesa",
          "weight": 0.6,
          "synonyms": [
            "cadeira de balanco",
            "poltrona",
            "lareira",
            "fogo",
            "toca",
            "sala"
          ]
        },
        {
          "concept": "Novelos de lã espalhados pelo chão",
          "weight": 0.4,
          "synonyms": [
            "novelos de la",
            "bolas de la",
            "cesto",
            "tapete"
          ]
        }
      ],
      "botPrompts": [
        "Um porco-espinho fofo de óculos redondos sentado numa cadeira de balanço tricotando um cachecol colorido de arco-íris perto da lareira com novelos de lã, estilo massinha stop-motion",
        "Visual claymation 3D aconchegante mostrando um ouriço tricoteiro fazendo um cachecol de lã colorido em sua sala aquecida",
        "Porco-espinho simpático usando óculos fazendo tricô com fios coloridos diante do fogo da lareira"
      ]
    }
  },
  {
    "id": "cisne-harpista-nuvens",
    "title": "Cisne Harpista no Pavilhão das Nuvens",
    "category": "Música & Fantasia",
    "difficulty": "Médio",
    "imageUrl": "/challenges/cisne-harpista-nuvens.webp",
    "fullPrompt": "Um cisne branco elegante usando coroa dourada tocando uma harpa de ouro ornamentada sobre um pavilhão de mármore branco flutuando entre nuvens cor-de-rosa e douradas ao pôr do sol, estilo ilustração digital de fantasia em rosa pastel e ouro",
    "subjectLayer": "Um cisne branco elegante usando coroa dourada tocando uma harpa de ouro",
    "styleLayer": "estilo ilustração digital de fantasia celestial em tons de rosa pastel, branco e dourado reluzente",
    "environmentLayer": "sobre um pavilhão de colunas de mármore flutuando entre nuvens rosadas de pôr do sol",
    "hint1": "Dica de Estilo (60s): Ilustração digital de fantasia celestial em tons de rosa pastel, branco e dourado!",
    "hint2": "Dica Principal (30s): Um cisne branco coroado tocando uma harpa dourada num pavilhão entre as nuvens!",
    "keywords": {
      "subject": [
        {
          "concept": "Cisne branco elegante usando coroa dourada",
          "weight": 0.55,
          "synonyms": [
            "cisne",
            "cisne branco",
            "ave",
            "coroa",
            "coroa dourada",
            "elegante",
            "real"
          ]
        },
        {
          "concept": "Tocando uma harpa de ouro",
          "weight": 0.45,
          "synonyms": [
            "harpa",
            "harpista",
            "instrumento",
            "cordas",
            "dourada",
            "musica",
            "tocando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração digital de fantasia celestial",
          "weight": 0.6,
          "synonyms": [
            "fantasia",
            "ilustracao digital",
            "pintura digital",
            "celestial",
            "magico",
            "sonho"
          ]
        },
        {
          "concept": "Paleta rosa pastel, branco e dourado",
          "weight": 0.4,
          "synonyms": [
            "rosa",
            "rosa pastel",
            "dourado",
            "ouro",
            "branco",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Pavilhão de mármore com colunas",
          "weight": 0.5,
          "synonyms": [
            "pavilhao",
            "templo",
            "marmore",
            "colunas",
            "coreto",
            "palco"
          ]
        },
        {
          "concept": "Flutuando entre nuvens cor-de-rosa do pôr do sol",
          "weight": 0.5,
          "synonyms": [
            "nuvens",
            "ceu",
            "flutuando",
            "por do sol",
            "nuvens rosas"
          ]
        }
      ],
      "botPrompts": [
        "Um cisne branco elegante usando coroa dourada tocando uma harpa de ouro num pavilhão de mármore flutuando entre nuvens cor-de-rosa, pintura digital de fantasia",
        "Ilustração mágica em tons de rosa e dourado mostrando um cisne coroado dedilhando uma harpa no alto das nuvens do pôr do sol",
        "Cisne real com coroa de ouro tocando harpa num coreto branco cercado por nuvens rosadas iluminadas"
      ]
    }
  },
  {
    "id": "tatu-minerador-cristais",
    "title": "Tatu Minerador na Caverna de Cristais",
    "category": "Aventura & Animação 3D",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/tatu-minerador-cristais.webp",
    "fullPrompt": "Um tatu fofo usando capacete de minerador com lanterna acesa na testa empurrando um vagão de madeira sobre trilhos cheio de cristais brilhantes turquesa e magenta dentro de uma caverna reluzente, estilo animação 3D Pixar",
    "subjectLayer": "Um tatu fofo de capacete de minerador com lanterna empurrando um vagão cheio de cristais brilhantes",
    "styleLayer": "estilo animação 3D Pixar vibrante com iluminação mágica de cristais turquesa e rosa magenta",
    "environmentLayer": "sobre trilhos de ferro dentro de uma caverna subterrânea repleta de gemas e cristais luminosos",
    "hint1": "Dica de Estilo (60s): Animação 3D estilo Pixar iluminada por cristais brilhantes em turquesa e magenta!",
    "hint2": "Dica Principal (30s): Um tatu com capacete de lanterna empurrando um carrinho cheio de cristais numa caverna!",
    "keywords": {
      "subject": [
        {
          "concept": "Tatu fofo com capacete de minerador e lanterna",
          "weight": 0.55,
          "synonyms": [
            "tatu",
            "tatuzinho",
            "animal",
            "minerador",
            "capacete",
            "lanterna",
            "capacete com luz"
          ]
        },
        {
          "concept": "Empurrando vagão / carrinho cheio de cristais",
          "weight": 0.45,
          "synonyms": [
            "vagao",
            "carrinho",
            "carrinho de mina",
            "cristais",
            "pedras preciosas",
            "gemas",
            "empurrando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação 3D estilo Pixar",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "pixar",
            "animacao",
            "disney",
            "render 3d",
            "cartoon 3d"
          ]
        },
        {
          "concept": "Brilho turquesa e rosa magenta dos cristais",
          "weight": 0.35,
          "synonyms": [
            "turquesa",
            "azul",
            "magenta",
            "rosa",
            "brilhante",
            "luminoso",
            "neon"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Caverna subterrânea repleta de cristais",
          "weight": 0.6,
          "synonyms": [
            "caverna",
            "mina",
            "gruta",
            "subterraneo",
            "rochas"
          ]
        },
        {
          "concept": "Trilhos de mina de madeira e ferro",
          "weight": 0.4,
          "synonyms": [
            "trilhos",
            "caminho",
            "mina de cristais"
          ]
        }
      ],
      "botPrompts": [
        "Um tatu fofo usando capacete de minerador com lanterna empurrando um carrinho cheio de cristais brilhantes turquesa e rosa dentro de uma caverna, animação 3D Pixar",
        "Render 3D vibrante de um tatuzinho minerador feliz ao lado de um vagão de mina carregado de gemas luminosas numa gruta",
        "Tatu simpático com luz no capacete coletando cristais coloridos que brilham no escuro da caverna"
      ]
    }
  },
  {
    "id": "lagosta-maestra-culinaria",
    "title": "Lagosta Chef na Cozinha Mediterrânea",
    "category": "Gastronomia & Ilustração 2D",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/lagosta-maestra-culinaria.webp",
    "fullPrompt": "Uma lagosta vermelha alegre usando chapéu branco alto de chef salteando legumes coloridos no ar em uma frigideira de cobre com vapor aromático dentro de uma cozinha iluminada com azulejos azuis e brancos, estilo ilustração cel shading vibrante",
    "subjectLayer": "Uma lagosta vermelha alegre de chapéu branco de chef salteando legumes em uma frigideira de cobre",
    "styleLayer": "estilo ilustração cel shading vibrante com cores quentes e contornos nítidos de animação",
    "environmentLayer": "dentro de uma cozinha mediterrânea iluminada decorada com parede de azulejos azuis e panelas",
    "hint1": "Dica de Estilo (60s): Ilustração estilo Cel Shading / Desenho Animado vibrante em vermelho, cobre e azul!",
    "hint2": "Dica Principal (30s): Uma lagosta de chapéu de chef salteando legumes numa frigideira em uma cozinha de azulejos!",
    "keywords": {
      "subject": [
        {
          "concept": "Lagosta vermelha usando chapéu branco de chef",
          "weight": 0.55,
          "synonyms": [
            "lagosta",
            "caranguejo",
            "camarao",
            "crustaceo",
            "chef",
            "cozinheiro",
            "chapeu de chef",
            "vermelha"
          ]
        },
        {
          "concept": "Salteando legumes em uma frigideira de cobre",
          "weight": 0.45,
          "synonyms": [
            "frigideira",
            "panela",
            "legumes",
            "cozinhando",
            "salteando",
            "comida",
            "cobre"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração Cel Shading / Desenho animado vibrante",
          "weight": 0.65,
          "synonyms": [
            "cel shading",
            "cartoon",
            "desenho animado",
            "ilustracao 2d",
            "quadrinhos",
            "vibrante"
          ]
        },
        {
          "concept": "Contraste vermelho, cobre e azul mediterrâneo",
          "weight": 0.35,
          "synonyms": [
            "colorido",
            "azul",
            "vermelho",
            "laranja",
            "iluminado"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Cozinha iluminada com bancada e fogão",
          "weight": 0.55,
          "synonyms": [
            "cozinha",
            "restaurante",
            "fogao",
            "bancada",
            "culinaria"
          ]
        },
        {
          "concept": "Parede de azulejos azuis decorados",
          "weight": 0.45,
          "synonyms": [
            "azulejos",
            "azulejos azuis",
            "ceramica",
            "parede",
            "mediterraneo"
          ]
        }
      ],
      "botPrompts": [
        "Uma lagosta vermelha alegre usando chapéu branco de chef salteando legumes numa frigideira de cobre dentro de uma cozinha com azulejos azuis, ilustração cel shading",
        "Desenho animado colorido de uma lagosta cozinheira preparando legumes frescos com vapor numa cozinha mediterrânea iluminada",
        "Lagosta chef sorridente segurando uma frigideira quente cercada por temperos e azulejos decorados"
      ]
    }
  },
  {
    "id": "baleia-dirigivel-nuvens",
    "title": "Baleia-Dirigível sobre a Cidade Costeira",
    "category": "Fantasia & Steampunk",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/baleia-dirigivel-nuvens.webp",
    "fullPrompt": "Uma grande baleia-azul gentil equipada com uma gôndola de madeira de passageiros e hélices de latão como um dirigível voando graciosamente entre nuvens douradas de pôr do sol acima de uma cidade costeira junto ao mar, estilo pintura de fantasia steampunk poética",
    "subjectLayer": "Uma baleia-azul gentil com gôndola de madeira e hélices de latão voando como um dirigível",
    "styleLayer": "estilo pintura digital de fantasia steampunk poética banhada pela luz dourada e rosada do pôr do sol",
    "environmentLayer": "no céu entre nuvens iluminadas acima dos telhados de uma cidade histórica à beira-mar",
    "hint1": "Dica de Estilo (60s): Pintura digital de fantasia Steampunk sob a luz dourada do pôr do sol nas nuvens!",
    "hint2": "Dica Principal (30s): Uma baleia-azul equipada como dirigível voador sobrevoando uma cidade costeira!",
    "keywords": {
      "subject": [
        {
          "concept": "Baleia-azul gentil voando no céu",
          "weight": 0.55,
          "synonyms": [
            "baleia",
            "baleia-azul",
            "baleia voadora",
            "voando",
            "gigante"
          ]
        },
        {
          "concept": "Equipada com gôndola de passageiros e hélices de dirigível",
          "weight": 0.45,
          "synonyms": [
            "dirigivel",
            "gondola",
            "cabine",
            "helices",
            "zepelim",
            "navio voador",
            "cintas"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura digital de fantasia Steampunk",
          "weight": 0.6,
          "synonyms": [
            "fantasia",
            "steampunk",
            "pintura digital",
            "ilustracao",
            "surreal",
            "magico"
          ]
        },
        {
          "concept": "Luz dourada e alaranjada de pôr do sol",
          "weight": 0.4,
          "synonyms": [
            "por do sol",
            "dourado",
            "laranja",
            "entardecer",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Nuvens iluminadas no céu aberto",
          "weight": 0.5,
          "synonyms": [
            "nuvens",
            "ceu",
            "ar",
            "alturas"
          ]
        },
        {
          "concept": "Cidade costeira e mar lá embaixo",
          "weight": 0.5,
          "synonyms": [
            "cidade",
            "costa",
            "mar",
            "porto",
            "casas",
            "telhados"
          ]
        }
      ],
      "botPrompts": [
        "Uma baleia-azul gigante com cabine de madeira e hélices de latão como um dirigível voando entre nuvens douradas do pôr do sol sobre uma cidade costeira, pintura de fantasia steampunk",
        "Ilustração digital mágica de uma baleia-dirigível sobrevoando o mar e os telhados de uma cidade ao entardecer",
        "Baleia voadora steampunk carregando uma gôndola iluminada através das nuvens alaranjadas do céu"
      ]
    }
  },
  {
    "id": "flamingo-fotografo-retro",
    "title": "Flamingo Fotógrafo no Calçadão Synthwave",
    "category": "Retrô & Vaporwave",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/flamingo-fotografo-retro.webp",
    "fullPrompt": "Um flamingo cor-de-rosa estiloso usando óculos escuros turquesa e camisa florida tropical segurando uma câmera fotográfica instantânea retrô em um calçadão de praia com palmeiras iluminadas por neon ao pôr do sol, estilo ilustração synthwave vaporwave anos 80",
    "subjectLayer": "Um flamingo rosa estiloso de óculos escuros e camisa tropical segurando uma câmera retrô",
    "styleLayer": "estilo ilustração synthwave e vaporwave anos 80 com cores neon vibrantes em rosa, ciano e laranja",
    "environmentLayer": "em um calçadão à beira-mar com silhuetas de palmeiras e sol neon no horizonte",
    "hint1": "Dica de Estilo (60s): Estética retrô Synthwave / Vaporwave anos 80 em tons de rosa, ciano e pôr do sol!",
    "hint2": "Dica Principal (30s): Um flamingo de óculos escuros e camisa florida tirando foto no calçadão da praia!",
    "keywords": {
      "subject": [
        {
          "concept": "Flamingo rosa de óculos escuros e camisa tropical",
          "weight": 0.55,
          "synonyms": [
            "flamingo",
            "ave rosa",
            "oculos escuros",
            "oculos de sol",
            "camisa florida",
            "camisa tropical",
            "estiloso"
          ]
        },
        {
          "concept": "Segurando câmera fotográfica retrô",
          "weight": 0.45,
          "synonyms": [
            "camera",
            "maquina fotografica",
            "fotografo",
            "polaroid",
            "tirando foto",
            "foto"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração Synthwave / Vaporwave anos 80",
          "weight": 0.65,
          "synonyms": [
            "synthwave",
            "vaporwave",
            "anos 80",
            "retro",
            "neon",
            "ilustracao"
          ]
        },
        {
          "concept": "Paleta rosa choque, ciano e laranja",
          "weight": 0.35,
          "synonyms": [
            "rosa",
            "ciano",
            "turquesa",
            "laranja",
            "vibrante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Calçadão de praia com palmeiras",
          "weight": 0.55,
          "synonyms": [
            "praia",
            "calcadao",
            "palmeiras",
            "coqueiros",
            "mar",
            "oceano"
          ]
        },
        {
          "concept": "Pôr do sol neon no horizonte",
          "weight": 0.45,
          "synonyms": [
            "por do sol",
            "sol",
            "horizonte",
            "entardecer"
          ]
        }
      ],
      "botPrompts": [
        "Um flamingo rosa estiloso de óculos de sol e camisa tropical segurando uma câmera retrô num calçadão de praia com palmeiras ao pôr do sol, estilo synthwave anos 80",
        "Ilustração vaporwave neon mostrando um flamingo fotógrafo na praia com luzes rosa e ciano",
        "Flamingo turista vestido com camisa havaiana e óculos escuros fotografando o entardecer tropical"
      ]
    }
  },
  {
    "id": "lemure-astronomo-baoba",
    "title": "Lêmure Astrônomo na Copa do Baobá",
    "category": "Astronomia & Fantasia",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/lemure-astronomo-baoba.webp",
    "fullPrompt": "Um lêmure de cauda anelada vestindo uma capa azul estrelada observando uma esfera armilar dourada brilhante sobre uma plataforma de madeira construída nos galhos de uma árvore baobá gigante sob um céu noturno cheio de galáxias coloridas, ilustração digital vibrante",
    "subjectLayer": "Um lêmure de cauda anelada vestindo capa estrelada estudando uma esfera armilar dourada brilhante",
    "styleLayer": "estilo ilustração digital vibrante de fantasia cósmica com brilhos dourados, roxos e azuis",
    "environmentLayer": "sobre uma plataforma de madeira no alto dos galhos de um grande baobá sob o céu da Via Láctea",
    "hint1": "Dica de Estilo (60s): Ilustração digital de fantasia cósmica com céu de galáxia roxo, azul e dourado!",
    "hint2": "Dica Principal (30s): Um lêmure de capa estrelada observando uma esfera dourada nos galhos de um baobá!",
    "keywords": {
      "subject": [
        {
          "concept": "Lêmure de cauda anelada vestindo capa estrelada",
          "weight": 0.55,
          "synonyms": [
            "lemure",
            "macaco",
            "cauda listrada",
            "capa",
            "manto",
            "astronomo",
            "mago"
          ]
        },
        {
          "concept": "Observando esfera armilar / globo astronômico dourado",
          "weight": 0.45,
          "synonyms": [
            "esfera",
            "esfera armilar",
            "globo",
            "aneis dourados",
            "astrolabio",
            "instrumento",
            "dourada",
            "astronomia"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração digital vibrante de fantasia cósmica",
          "weight": 0.6,
          "synonyms": [
            "ilustracao digital",
            "pintura digital",
            "fantasia",
            "cosmico",
            "vibrante",
            "magico"
          ]
        },
        {
          "concept": "Luzes douradas, roxas e azul-estelar",
          "weight": 0.4,
          "synonyms": [
            "dourado",
            "roxo",
            "azul",
            "brilhante",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Plataforma nos galhos de uma árvore Baobá gigante",
          "weight": 0.55,
          "synonyms": [
            "arvore",
            "baoba",
            "galhos",
            "plataforma de madeira",
            "casa na arvore",
            "copa"
          ]
        },
        {
          "concept": "Céu noturno estrelado com galáxia e nebulosa",
          "weight": 0.45,
          "synonyms": [
            "galaxia",
            "estrelas",
            "ceu estrelado",
            "noite",
            "via lactea",
            "cosmos"
          ]
        }
      ],
      "botPrompts": [
        "Um lêmure de cauda listrada usando uma capa estrelada observando uma esfera astronômica dourada em uma plataforma no alto de uma grande árvore sob um céu de galáxias, ilustração digital",
        "Pintura digital mágica de um lêmure astrônomo estudando anéis dourados brilhantes nos galhos de um baobá sob a Via Láctea",
        "Lêmure sábio de manto azul analisando um globo celeste luminoso na copa de uma árvore gigante à noite"
      ]
    }
  },
  {
    "id": "quati-botanico-orquideas",
    "title": "Quati Botânico no Jardim de Orquídeas",
    "category": "Ciência & Aquarela Botânica",
    "difficulty": "Médio",
    "imageUrl": "/challenges/quati-botanico-orquideas.webp",
    "fullPrompt": "Um quati curioso de focinho alongado usando viseira com lente de aumento e colete de explorador anotando em um caderno de campo enquanto examina uma orquídea roxa luminosa dentro de uma estufa tropical de vidro, estilo arte botânica em aquarela e nanquim",
    "subjectLayer": "Um quati curioso de viseira com lupa e colete fazendo anotações sobre uma orquídea roxa",
    "styleLayer": "estilo ilustração botânica detalhada em aquarela e traço de nanquim em tons de verde e violeta",
    "environmentLayer": "dentro de uma estufa de vidro tropical repleta de samambaias, folhagens e flores exóticas",
    "hint1": "Dica de Estilo (60s): Ilustração botânica em aquarela e nanquim em tons de verde-folha e violeta!",
    "hint2": "Dica Principal (30s): Um quati de colete e lupa anotando num caderno diante de uma orquídea roxa na estufa!",
    "keywords": {
      "subject": [
        {
          "concept": "Quati curioso com viseira de lupa e colete",
          "weight": 0.55,
          "synonyms": [
            "quati",
            "guaxinim",
            "animal",
            "botanico",
            "pesquisador",
            "cientista",
            "lupa",
            "oculos",
            "colete"
          ]
        },
        {
          "concept": "Anotando no caderno e examinando uma orquídea roxa",
          "weight": 0.45,
          "synonyms": [
            "orquidea",
            "flor roxa",
            "flor",
            "caderno",
            "diario",
            "anotando",
            "escrevendo",
            "examinando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Arte botânica em aquarela e nanquim",
          "weight": 0.65,
          "synonyms": [
            "aquarela",
            "nanquim",
            "ilustracao botanica",
            "ilustracao",
            "pintura",
            "desenho"
          ]
        },
        {
          "concept": "Paleta verde tropical e roxo luminoso",
          "weight": 0.35,
          "synonyms": [
            "verde",
            "roxo",
            "violeta",
            "natural",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Estufa de vidro tropical (conservatório)",
          "weight": 0.55,
          "synonyms": [
            "estufa",
            "estufa de vidro",
            "jardim botanico",
            "vidro"
          ]
        },
        {
          "concept": "Folhagens, samambaias e plantas tropicais",
          "weight": 0.45,
          "synonyms": [
            "tropical",
            "plantas",
            "folhagens",
            "flores",
            "natureza",
            "floresta"
          ]
        }
      ],
      "botPrompts": [
        "Um quati curioso usando lupa e colete anotando em um caderno enquanto examina uma orquídea roxa brilhante dentro de uma estufa de vidro cheia de plantas, ilustração em aquarela",
        "Ilustração botânica em aquarela e nanquim de um quati cientista estudando flores roxas num jardim botânico coberto de vidro",
        "Quati pesquisador com caderno na mão observando uma bela orquídea violeta entre folhagens verdes"
      ]
    }
  },
  {
    "id": "mico-leao-violinista",
    "title": "Mico-Leão-Dourado Violinista na Mata Atlântica",
    "category": "Brasilidades & Música",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/mico-leao-violinista.webp",
    "fullPrompt": "Um mico-leão-dourado de pelagem alaranjada brilhante vestindo casaco de veludo verde-esmeralda tocando um pequeno violino de madeira sobre um galho coberto de musgo cercado por vaga-lumes luminosos e bromélias na floresta, estilo pintura mágica de livro ilustrado",
    "subjectLayer": "Um mico-leão-dourado vestindo casaco verde-esmeralda tocando um pequeno violino de madeira",
    "styleLayer": "estilo pintura mágica de livro ilustrado com luzes douradas de vaga-lumes e cores tropicais vibrantes",
    "environmentLayer": "sobre um galho de árvore com musgo e flores de bromélia na floresta iluminada por vaga-lumes",
    "hint1": "Dica de Estilo (60s): Pintura mágica de livro ilustrado com brilho dourado de vaga-lumes na floresta!",
    "hint2": "Dica Principal (30s): Um mico-leão-dourado de casaco verde tocando violino num galho cheio de flores!",
    "keywords": {
      "subject": [
        {
          "concept": "Mico-leão-dourado de casaco verde-esmeralda",
          "weight": 0.55,
          "synonyms": [
            "mico-leao-dourado",
            "mico-leao",
            "mico",
            "macaquinho",
            "dourado",
            "laranja",
            "casaco verde",
            "paleto"
          ]
        },
        {
          "concept": "Tocando um pequeno violino de madeira",
          "weight": 0.45,
          "synonyms": [
            "violino",
            "violinista",
            "instrumento",
            "tocando",
            "arco",
            "musica"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura mágica de livro ilustrado",
          "weight": 0.65,
          "synonyms": [
            "livro ilustrado",
            "pintura digital",
            "ilustracao",
            "conto de fadas",
            "magico",
            "aquarela"
          ]
        },
        {
          "concept": "Paleta dourado vibrante e verde-floresta",
          "weight": 0.35,
          "synonyms": [
            "dourado",
            "laranja",
            "verde",
            "esmeralda",
            "brilhante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Galho de árvore com musgo e bromélias na floresta",
          "weight": 0.55,
          "synonyms": [
            "galho",
            "arvore",
            "floresta",
            "mata",
            "bromelias",
            "flores",
            "musgo"
          ]
        },
        {
          "concept": "Vaga-lumes luminosos flutuando ao redor",
          "weight": 0.45,
          "synonyms": [
            "vaga-lumes",
            "luzes",
            "pontos de luz",
            "brilhos"
          ]
        }
      ],
      "botPrompts": [
        "Um mico-leão-dourado vestindo casaco verde tocando violino sobre um galho de árvore com flores e vaga-lumes brilhantes na floresta, pintura de livro ilustrado",
        "Ilustração mágica e vibrante de um mico-leão-dourado violinista fazendo música entre bromélias e luzes douradas",
        "Macaquinho dourado elegante de paletó esmeralda tocando violino na mata iluminada por vaga-lumes"
      ]
    }
  },
  {
    "id": "jabuti-relojoeiro-solar",
    "title": "Jabuti Sábio e o Relógio de Sol",
    "category": "Ciência & Ilustração Solar",
    "difficulty": "Médio",
    "imageUrl": "/challenges/jabuti-relojoeiro-solar.webp",
    "fullPrompt": "Um jabuti sábio usando óculos de armação de latão ajustando um relógio de sol dourado esculpido com símbolos geométricos sobre um pedestal de pedra em um pátio ensolarado com vasos de terracota e fontes de água, estilo ilustração mediterrânea quente",
    "subjectLayer": "Um jabuti sábio usando óculos de latão ajustando um relógio de sol dourado sobre um pedestal",
    "styleLayer": "estilo ilustração digital mediterrânea com iluminação solar dourada e tons de terracota e pedra",
    "environmentLayer": "em um pátio de jardim ensolarado cercado por vasos de plantas em terracota, arcos e uma fonte",
    "hint1": "Dica de Estilo (60s): Ilustração ensolarada em tons mediterrâneos de ouro, pedra clara e terracota!",
    "hint2": "Dica Principal (30s): Um jabuti de óculos ajustando um relógio de sol dourado num pátio de jardim!",
    "keywords": {
      "subject": [
        {
          "concept": "Jabuti / tartaruga sábia usando óculos",
          "weight": 0.55,
          "synonyms": [
            "jabuti",
            "tartaruga",
            "cagado",
            "casco",
            "oculos",
            "sabio",
            "astronomo"
          ]
        },
        {
          "concept": "Ajustando um relógio de sol dourado",
          "weight": 0.45,
          "synonyms": [
            "relogio de sol",
            "relogio solar",
            "disco dourado",
            "relogio",
            "tempo",
            "sol",
            "ajustando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração digital mediterrânea e luminosa",
          "weight": 0.6,
          "synonyms": [
            "ilustracao",
            "pintura digital",
            "ensolarado",
            "mediterraneo",
            "livro ilustrado"
          ]
        },
        {
          "concept": "Tons quentes de dourado e terracota",
          "weight": 0.4,
          "synonyms": [
            "dourado",
            "terracota",
            "laranja",
            "luz do sol",
            "quente"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Pátio de jardim com pedestal de pedra e arcos",
          "weight": 0.55,
          "synonyms": [
            "patio",
            "jardim",
            "pedestal",
            "colunas",
            "arcos",
            "praceta"
          ]
        },
        {
          "concept": "Vasos de terracota e fonte de água",
          "weight": 0.45,
          "synonyms": [
            "vasos",
            "plantas",
            "fonte",
            "agua",
            "flores"
          ]
        }
      ],
      "botPrompts": [
        "Um jabuti sábio de óculos ajustando um relógio de sol dourado em um pátio ensolarado com vasos de terracota e fontes, ilustração colorida",
        "Arte digital em tons quentes mostrando uma tartaruga de óculos estudando um relógio solar de ouro num jardim mediterrâneo",
        "Jabuti antigo usando óculos de latão diante de um disco solar dourado cercado por plantas e arcos de pedra"
      ]
    }
  },
  {
    "id": "ariranha-canoista-cristal",
    "title": "Ariranha Canoísta no Rio das Lanternas",
    "category": "Brasilidades & Aventura 3D",
    "difficulty": "Médio",
    "imageUrl": "/challenges/ariranha-canoista-cristal.webp",
    "fullPrompt": "Uma ariranha alegre usando faixa colorida na cabeça remando uma canoa de madeira entalhada carregada de lanternas brilhantes ao longo de um rio cristalino na floresta com cachoeiras ao fundo, estilo animação 3D de cinema vibrante",
    "subjectLayer": "Uma ariranha alegre usando faixa colorida remando uma canoa de madeira cheia de lanternas brilhantes",
    "styleLayer": "estilo animação 3D de cinema vibrante com água cristalina turquesa e reflexos dourados das lanternas",
    "environmentLayer": "navegando por um rio transparente na floresta tropical com cachoeiras e vegetação verde ao fundo",
    "hint1": "Dica de Estilo (60s): Animação 3D de cinema com água turquesa cristalina e brilho quente de lanternas!",
    "hint2": "Dica Principal (30s): Uma ariranha/lontra remando uma canoa cheia de lanternas num rio com cachoeira!",
    "keywords": {
      "subject": [
        {
          "concept": "Ariranha / lontra alegre com faixa na cabeça",
          "weight": 0.55,
          "synonyms": [
            "ariranha",
            "lontra",
            "animal",
            "faixa na cabeca",
            "bandana",
            "canoista",
            "navegadora"
          ]
        },
        {
          "concept": "Remando canoa de madeira com lanternas brilhantes",
          "weight": 0.45,
          "synonyms": [
            "canoa",
            "barco",
            "remando",
            "remo",
            "lanternas",
            "luminarias",
            "luzes"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação 3D de cinema estilo Pixar/Disney",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "animacao 3d",
            "pixar",
            "disney",
            "render 3d",
            "vibrante"
          ]
        },
        {
          "concept": "Contraste água turquesa e luz dourada",
          "weight": 0.35,
          "synonyms": [
            "turquesa",
            "cristalino",
            "dourado",
            "brilhante",
            "colorido"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Rio cristalino na floresta tropical",
          "weight": 0.55,
          "synonyms": [
            "rio",
            "agua cristalina",
            "floresta",
            "selva",
            "amazonia",
            "plantas"
          ]
        },
        {
          "concept": "Cachoeiras e pedras ao fundo",
          "weight": 0.45,
          "synonyms": [
            "cachoeira",
            "cascata",
            "quedas dagua",
            "pedras"
          ]
        }
      ],
      "botPrompts": [
        "Uma ariranha alegre com faixa na cabeça remando uma canoa de madeira cheia de lanternas iluminadas em um rio cristalino na floresta com cachoeiras, animação 3D",
        "Render 3D vibrante de uma lontra canoísta navegando num barquinho com luzes douradas por águas turquesas cercadas pela mata",
        "Ariranha sorridente usando remo de madeira numa canoa iluminada diante de uma bela cachoeira tropical"
      ]
    }
  },
  {
    "id": "seriema-carteira-sertao",
    "title": "Seriema Mensageira em Xilogravura de Cordel",
    "category": "Cultura Nordestina & Cordel",
    "difficulty": "Médio",
    "imageUrl": "/challenges/seriema-carteira-sertao.webp",
    "fullPrompt": "Uma ave seriema de pernas longas usando chapéu de couro e bolsa de carteiro correndo por uma estrada de terra ensolarada entre cactos mandacaru floridos e um catavento sob o céu azul, estilo xilogravura de literatura de cordel brasileira colorida em ocre, preto e ciano",
    "subjectLayer": "Uma ave seriema usando chapéu de couro e bolsa de carteiro correndo pela estrada do sertão",
    "styleLayer": "estilo xilogravura de cordel nordestino com traços entalhados marcantes em ocre, preto e azul-ciano",
    "environmentLayer": "entre cactos mandacaru verdes, um moinho catavento e um grande sol brilhante no horizonte",
    "hint1": "Dica de Estilo (60s): Estética de Xilogravura de Cordel nordestino com traços entalhados em ocre, preto e azul!",
    "hint2": "Dica Principal (30s): Uma ave seriema de chapéu e bolsa de carteiro correndo entre cactos e um catavento!",
    "keywords": {
      "subject": [
        {
          "concept": "Ave seriema de pernas longas com chapéu",
          "weight": 0.55,
          "synonyms": [
            "seriema",
            "ave",
            "passaro",
            "ema",
            "chapeu de couro",
            "chapeu",
            "correndo"
          ]
        },
        {
          "concept": "Carregando bolsa de carteiro / mensageira",
          "weight": 0.45,
          "synonyms": [
            "carteira",
            "carteiro",
            "mensageira",
            "bolsa",
            "capanga",
            "correio"
          ]
        }
      ],
      "style": [
        {
          "concept": "Xilogravura de literatura de cordel",
          "weight": 0.65,
          "synonyms": [
            "xilogravura",
            "cordel",
            "gravura",
            "entalhe",
            "nordestino",
            "ilustracao"
          ]
        },
        {
          "concept": "Paleta ocre, preto e azul-ciano",
          "weight": 0.35,
          "synonyms": [
            "ocre",
            "amarelo",
            "azul",
            "preto",
            "cores vibrantes"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Estrada do sertão com cactos mandacaru",
          "weight": 0.55,
          "synonyms": [
            "sertao",
            "cactos",
            "mandacaru",
            "caatinga",
            "estrada",
            "nordeste"
          ]
        },
        {
          "concept": "Catavento e sol radiante no céu",
          "weight": 0.45,
          "synonyms": [
            "catavento",
            "moinho",
            "sol",
            "ceu"
          ]
        }
      ],
      "botPrompts": [
        "Uma ave seriema de chapéu e bolsa de carteiro correndo por uma trilha entre cactos e um catavento sob o sol, estilo xilogravura de cordel colorida",
        "Ilustração em estilo xilogravura nordestina mostrando um pássaro mensageiro de pernas longas no sertão com mandacarus",
        "Seriema carteira atravessando a paisagem ensolarada de cactos em arte de gravura em madeira"
      ]
    }
  },
  {
    "id": "jaguatirica-pianista-jazz",
    "title": "Jaguatirica Pianista no Clube de Jazz",
    "category": "Música & Pintura a Guache",
    "difficulty": "Médio",
    "imageUrl": "/challenges/jaguatirica-pianista-jazz.webp",
    "fullPrompt": "Uma jaguatirica elegante de pelagem pintada usando gravata-borboleta azul-turquesa tocando um piano vertical de madeira decorado com candelabros de latão acesos dentro de um salão de jazz aconchegante com cortinas âmbar, estilo pintura expressiva em guache e óleo",
    "subjectLayer": "Uma jaguatirica pintada elegante de gravata-borboleta turquesa tocando um piano de madeira",
    "styleLayer": "estilo pintura artística em guache e óleo com iluminação âmbar aconchegante e sombras suaves",
    "environmentLayer": "dentro de um salão de música clássico com candelabros de velas acesos sobre o piano e cortinas",
    "hint1": "Dica de Estilo (60s): Pintura artística em guache e óleo com luz âmbar de velas e candelabros!",
    "hint2": "Dica Principal (30s): Uma jaguatirica pintada de gravata-borboleta azul tocando piano num salão de jazz!",
    "keywords": {
      "subject": [
        {
          "concept": "Jaguatirica pintada de gravata-borboleta turquesa",
          "weight": 0.55,
          "synonyms": [
            "jaguatirica",
            "onca",
            "leopardo",
            "gato selvagem",
            "felino",
            "pintada",
            "gravata-borboleta",
            "gravata azul"
          ]
        },
        {
          "concept": "Tocando piano de madeira",
          "weight": 0.45,
          "synonyms": [
            "piano",
            "pianista",
            "teclas",
            "tocando piano",
            "musica",
            "jazz",
            "instrumento"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura artística em guache e óleo",
          "weight": 0.6,
          "synonyms": [
            "guache",
            "pintura a oleo",
            "pintura",
            "ilustracao",
            "artistico",
            "classico"
          ]
        },
        {
          "concept": "Iluminação âmbar quente e toque turquesa",
          "weight": 0.4,
          "synonyms": [
            "ambar",
            "dourado",
            "luz quente",
            "turquesa",
            "aconchegante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Salão de jazz vintage com cortinas",
          "weight": 0.5,
          "synonyms": [
            "salao",
            "clube de jazz",
            "palco",
            "cortinas",
            "sala de musica"
          ]
        },
        {
          "concept": "Candelabros de latão com velas acesas",
          "weight": 0.5,
          "synonyms": [
            "candelabro",
            "velas",
            "castical",
            "luz de velas"
          ]
        }
      ],
      "botPrompts": [
        "Uma jaguatirica elegante usando gravata-borboleta turquesa tocando piano de madeira com candelabros de velas acesas num salão de jazz aconchegante, pintura em guache e óleo",
        "Pintura artística quente de um felino pintado pianista tocando teclas de piano sob a luz de velas e cortinas douradas",
        "Jaguatirica música de gravata azul apresentando concerto de jazz ao piano iluminado por castiçais"
      ]
    }
  },
  {
    "id": "tucunare-dj-submarino",
    "title": "Tucunaré DJ na Festa do Navio Naufragado",
    "category": "Música & Fundo do Mar",
    "difficulty": "Médio",
    "imageUrl": "/challenges/tucunare-dj-submarino.webp",
    "fullPrompt": "Um peixe tucunaré colorido amarelo e verde usando fones de ouvido neon mixando música em uma mesa de DJ em formato de conchas sobre o convés de um navio de madeira naufragado cercado por águas-vivas bioluminescentes, estilo ilustração cartoon 3D vibrante",
    "subjectLayer": "Um peixe tucunaré colorido usando fones de ouvido neon tocando em uma mesa de DJ de conchas",
    "styleLayer": "estilo ilustração cartoon 3D vibrante com luzes neon subaquáticas e brilho bioluminescente",
    "environmentLayer": "sobre o convés de um navio de madeira no fundo do mar cercado por águas-vivas iluminadas",
    "hint1": "Dica de Estilo (60s): Ilustração Cartoon 3D subaquática vibrante com luzes neon e águas-vivas brilhantes!",
    "hint2": "Dica Principal (30s): Um peixe colorido de fones de ouvido tocando como DJ num navio no fundo do mar!",
    "keywords": {
      "subject": [
        {
          "concept": "Peixe tucunaré colorido com fones de ouvido neon",
          "weight": 0.55,
          "synonyms": [
            "peixe",
            "tucunare",
            "peixe colorido",
            "fones de ouvido",
            "headphone",
            "dj"
          ]
        },
        {
          "concept": "Mixando música em mesa de DJ de conchas",
          "weight": 0.45,
          "synonyms": [
            "mesa de dj",
            "conchas",
            "toca-discos",
            "musica",
            "festa",
            "mixando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração Cartoon 3D vibrante",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "cartoon 3d",
            "animacao 3d",
            "pixar",
            "colorido",
            "vibrante"
          ]
        },
        {
          "concept": "Brilho neon e bioluminescência subaquática",
          "weight": 0.35,
          "synonyms": [
            "neon",
            "bioluminescente",
            "brilhante",
            "luminoso",
            "roxo e ciano"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Convés de navio de madeira naufragado no fundo do mar",
          "weight": 0.55,
          "synonyms": [
            "navio",
            "barco",
            "naufragado",
            "conves",
            "fundo do mar",
            "oceano",
            "submarino"
          ]
        },
        {
          "concept": "Águas-vivas luminosas flutuando ao redor",
          "weight": 0.45,
          "synonyms": [
            "aguas-vivas",
            "agua-viva",
            "medusas",
            "corais",
            "bolhas"
          ]
        }
      ],
      "botPrompts": [
        "Um peixe colorido usando fones de ouvido neon tocando numa mesa de DJ de conchas sobre um navio naufragado cercado por águas-vivas brilhantes, animação cartoon 3D",
        "Render 3D divertido de um peixe tucunaré DJ animando uma festa no fundo do mar com medusas bioluminescentes",
        "Peixe tropical de headphone mixando som no convés de um barco antigo submerso cheio de luzes neon"
      ]
    }
  },
  {
    "id": "garca-caligrafa-lagoa",
    "title": "Garça Calígrafa no Pavilhão do Lago",
    "category": "Arte Oriental & Aquarela",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/garca-caligrafa-lagoa.webp",
    "fullPrompt": "Uma garça branca graciosa segurando um pincel de bambu com a asa pintando símbolos de caligrafia dourada sobre um longo pergaminho de papel dentro de um pavilhão de madeira sobre uma lagoa tranquila de flores de lótus, estilo pintura tradicional oriental em nanquim e aguada de aquarela",
    "subjectLayer": "Uma garça branca graciosa segurando um pincel de bambu e pintando caligrafia dourada num pergaminho",
    "styleLayer": "estilo pintura tradicional oriental em nanquim e aquarela suave com detalhes em ouro",
    "environmentLayer": "dentro de um pavilhão de madeira aberto sobre uma lagoa serena repleta de flores de lótus",
    "hint1": "Dica de Estilo (60s): Pintura tradicional oriental em nanquim e aquarela suave com detalhes dourados!",
    "hint2": "Dica Principal (30s): Uma garça branca com pincel de bambu pintando um pergaminho num pavilhão sobre o lago!",
    "keywords": {
      "subject": [
        {
          "concept": "Garça branca graciosa artista",
          "weight": 0.55,
          "synonyms": [
            "garca",
            "garca branca",
            "ave",
            "passaro branco",
            "caligrafa",
            "pintora",
            "artista"
          ]
        },
        {
          "concept": "Segurando pincel de bambu e pintando pergaminho",
          "weight": 0.45,
          "synonyms": [
            "pincel",
            "bambu",
            "caligrafia",
            "pergaminho",
            "papel",
            "escrevendo",
            "pintando",
            "dourado"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura oriental em nanquim e aquarela (sumi-e)",
          "weight": 0.65,
          "synonyms": [
            "aquarela",
            "nanquim",
            "pintura oriental",
            "japonesa",
            "chinesa",
            "ilustracao",
            "suave"
          ]
        },
        {
          "concept": "Detalhes em tinta dourada e tons serenos",
          "weight": 0.35,
          "synonyms": [
            "dourado",
            "sereno",
            "delicado",
            "poetico",
            "elegante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Pavilhão de madeira sobre a água",
          "weight": 0.5,
          "synonyms": [
            "pavilhao",
            "quiosque",
            "deque",
            "madeira",
            "templo"
          ]
        },
        {
          "concept": "Lagoa tranquila com flores de lótus",
          "weight": 0.5,
          "synonyms": [
            "lagoa",
            "lago",
            "flores de lotus",
            "lotus",
            "agua"
          ]
        }
      ],
      "botPrompts": [
        "Uma garça branca elegante segurando um pincel de bambu e pintando caligrafia dourada em um pergaminho num pavilhão sobre uma lagoa de lótus, pintura oriental em aquarela e nanquim",
        "Ilustração poética em aquarela mostrando uma garça calígrafa escrevendo em um rolo de papel à beira de um lago florido",
        "Ave garça branca fazendo arte com pincel e tinta dourada num deque de madeira cercado por flores de lótus"
      ]
    }
  },
  {
    "id": "cutia-padeiro-forno",
    "title": "Cutia Padeira e os Pães Dourados no Forno a Lenha",
    "category": "Gastronomia & Livro Ilustrado",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/cutia-padeiro-forno.webp",
    "fullPrompt": "Uma cutia marrom fofa vestindo chapéu branco de padeiro e avental segurando uma cesta de vime com pães dourados quentinhos diante de um forno de pedra a lenha aceso dentro de uma padaria rústica aconchegante, estilo ilustração de livro infantil",
    "subjectLayer": "Uma cutia marrom fofa de chapéu de padeiro e avental segurando uma cesta de pães dourados",
    "styleLayer": "estilo ilustração de livro de histórias infantil com cores quentes, acolhedoras e luz de forno a lenha",
    "environmentLayer": "dentro de uma padaria rústica de madeira e pedra ao lado de um forno a lenha aceso e janela iluminada",
    "hint1": "Dica de Estilo (60s): Ilustração aconchegante de livro infantil em tons quentes de pão dourado e forno a lenha!",
    "hint2": "Dica Principal (30s): Uma cutia/roedor de chapéu de padeiro e avental segurando pães diante de um forno de pedra!",
    "keywords": {
      "subject": [
        {
          "concept": "Cutia / roedor fofo de chapéu de padeiro e avental branco",
          "weight": 0.55,
          "synonyms": [
            "cutia",
            "capivara",
            "prea",
            "roedor",
            "hamster",
            "padeiro",
            "chef",
            "chapeu de chef",
            "avental branco"
          ]
        },
        {
          "concept": "Segurando cesta com pães dourados frescos",
          "weight": 0.45,
          "synonyms": [
            "pao",
            "paes",
            "cesta",
            "pao caseiro",
            "assando",
            "padaria",
            "dourados"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração aconchegante de livro infantil",
          "weight": 0.65,
          "synonyms": [
            "livro infantil",
            "livro ilustrado",
            "ilustracao",
            "pintura digital",
            "cartoon",
            "aconchegante"
          ]
        },
        {
          "concept": "Iluminação quente dourada e acolhedora",
          "weight": 0.35,
          "synonyms": [
            "quente",
            "dourado",
            "ambar",
            "fogo",
            "acolhedor"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Forno de pedra a lenha aceso",
          "weight": 0.55,
          "synonyms": [
            "forno",
            "forno a lenha",
            "forno de pedra",
            "fogo",
            "lareira"
          ]
        },
        {
          "concept": "Cozinha de padaria rústica com janela",
          "weight": 0.45,
          "synonyms": [
            "padaria",
            "cozinha",
            "madeira",
            "janela",
            "prateleira"
          ]
        }
      ],
      "botPrompts": [
        "Uma cutia fofa usando chapéu branco de padeiro e avental segurando uma cesta de pães dourados diante de um forno de pedra a lenha aceso, ilustração de livro infantil",
        "Ilustração aconchegante de um pequeno roedor padeiro sorridente com pães quentinhos recém-saídos do forno rústico",
        "Cutia padeira vestida de chef na cozinha de madeira ao lado do forno aceso cheio de pães"
      ]
    }
  },
  {
    "id": "prea-jardineiro-bonsai",
    "title": "Preá Jardineiro e o Bonsai de Cerejeira",
    "category": "Jardinagem & Stop-Motion",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/prea-jardineiro-bonsai.webp",
    "fullPrompt": "Um pequeno preá fofo usando chapéu de palha e avental verde podando cuidadosamente uma árvore bonsai de cerejeira com flores cor-de-rosa usando uma pequena tesoura sobre uma varanda de madeira, estilo animação stop-motion de massinha",
    "subjectLayer": "Um pequeno preá fofo de chapéu de palha e avental verde cuidando de um bonsai de cerejeira rosa",
    "styleLayer": "estilo animação stop-motion de massinha (claymation) com textura tátil suave e cores primaveris",
    "environmentLayer": "sobre uma bancada em uma varanda de madeira iluminada cercada por pétalas cor-de-rosa",
    "hint1": "Dica de Estilo (60s): Animação estilo Stop-Motion de massinha (claymation) em tons de verde e rosa florido!",
    "hint2": "Dica Principal (30s): Um pequeno preá/porquinho-da-índia de chapéu de palha podando um bonsai de flores rosas!",
    "keywords": {
      "subject": [
        {
          "concept": "Pequeno preá / porquinho-da-índia de chapéu de palha e avental verde",
          "weight": 0.55,
          "synonyms": [
            "prea",
            "porquinho-da-india",
            "hamster",
            "roedor",
            "jardineiro",
            "chapeu de palha",
            "avental verde"
          ]
        },
        {
          "concept": "Podando árvore bonsai de cerejeira rosa com tesoura",
          "weight": 0.45,
          "synonyms": [
            "bonsai",
            "cerejeira",
            "arvore rosa",
            "flores rosas",
            "podando",
            "tesoura",
            "cuidando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação stop-motion de massinha (claymation)",
          "weight": 0.65,
          "synonyms": [
            "massinha",
            "stop-motion",
            "claymation",
            "3d",
            "animacao 3d",
            "boneco",
            "fofo"
          ]
        },
        {
          "concept": "Paleta primaveril rosa e verde suave",
          "weight": 0.35,
          "synonyms": [
            "rosa",
            "verde",
            "primavera",
            "suave",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Varanda e bancada de madeira",
          "weight": 0.6,
          "synonyms": [
            "varanda",
            "mesa de madeira",
            "bancada",
            "jardim"
          ]
        },
        {
          "concept": "Vaso cerâmico e pétalas de flores",
          "weight": 0.4,
          "synonyms": [
            "flores cor-de-rosa",
            "flores",
            "vaso",
            "petalas",
            "natureza"
          ]
        }
      ],
      "botPrompts": [
        "Um pequeno preá fofo de chapéu de palha e avental verde podando um bonsai de cerejeira rosa com uma tesourinha numa varanda de madeira, estilo stop-motion de massinha",
        "Visual claymation 3D de um porquinho-da-índia jardineiro cuidando de uma pequena árvore florida cor-de-rosa",
        "Roedor simpático vestindo avental de jardinagem aparando um bonsai florido sob a luz suave do dia"
      ]
    }
  },
  {
    "id": "veado-campeiro-faroleiro",
    "title": "Veado-Campeiro Guardião da Torre Solar",
    "category": "Ecologia & Solarpunk",
    "difficulty": "Médio",
    "imageUrl": "/challenges/veado-campeiro-faroleiro.webp",
    "fullPrompt": "Um veado-campeiro gentil vestindo um poncho tecido colorido cuidando de uma torre de farol solar com cristal luminoso no topo de uma colina verde diante de campos dourados e rios sinuosos ao amanhecer, estilo pintura digital solarpunk",
    "subjectLayer": "Um veado-campeiro gentil vestindo poncho tecido ao lado de uma torre de farol solar com cristal",
    "styleLayer": "estilo pintura digital solarpunk luminosa com luz dourada de amanhecer e cores naturais vibrantes",
    "environmentLayer": "no alto de uma colina verde com vista para campos dourados, flores e um rio sinuoso no vale",
    "hint1": "Dica de Estilo (60s): Pintura digital em estética ecológica Solarpunk sob a luz dourada do amanhecer!",
    "hint2": "Dica Principal (30s): Um veado-campeiro de poncho colorido junto a uma torre solar no alto de uma colina!",
    "keywords": {
      "subject": [
        {
          "concept": "Veado-campeiro / cervo vestindo poncho tecido",
          "weight": 0.55,
          "synonyms": [
            "veado",
            "veado-campeiro",
            "cervo",
            "galhada",
            "poncho",
            "manto",
            "guardiao"
          ]
        },
        {
          "concept": "Cuidando de uma torre de farol solar com cristal",
          "weight": 0.45,
          "synonyms": [
            "torre",
            "farol",
            "torre solar",
            "cristal",
            "luz",
            "energia solar"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura digital Solarpunk luminosa",
          "weight": 0.65,
          "synonyms": [
            "solarpunk",
            "pintura digital",
            "ilustracao digital",
            "ecologico",
            "futurista",
            "vibrante"
          ]
        },
        {
          "concept": "Luz dourada de amanhecer",
          "weight": 0.35,
          "synonyms": [
            "amanhecer",
            "nascer do sol",
            "dourado",
            "ensolarado",
            "verde"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Colina verde com vista para campos dourados",
          "weight": 0.55,
          "synonyms": [
            "colina",
            "monte",
            "campos",
            "cerrado",
            "pampa",
            "grama",
            "montanha"
          ]
        },
        {
          "concept": "Rio sinuoso brilhando no vale",
          "weight": 0.45,
          "synonyms": [
            "rio",
            "vale",
            "paisagem",
            "horizonte"
          ]
        }
      ],
      "botPrompts": [
        "Um veado-campeiro vestindo poncho colorido ao lado de uma torre de cristal solar no topo de uma colina verde com rio e campos dourados ao amanhecer, pintura solarpunk",
        "Ilustração digital solarpunk mostrando um cervo guardião junto a um farol ecológico diante de um vale iluminado pelo sol",
        "Cervo simpático de poncho tradicional cuidando da torre luminosa sobre os campos verdes ao nascer do sol"
      ]
    }
  },
  {
    "id": "anta-maquinista-vapor",
    "title": "Anta Maquinista na Locomotiva do Vale",
    "category": "Transporte & Livro Ilustrado",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/anta-maquinista-vapor.webp",
    "fullPrompt": "Uma anta brasileira simpática usando boné listrado azul de maquinista e lenço vermelho no pescoço conduzindo uma locomotiva a vapor colorida sobre uma ponte de viaduto de pedra acima de um vale verde com neblina suave, estilo ilustração clássica de livro infantil",
    "subjectLayer": "Uma anta simpática de boné de maquinista e lenço vermelho conduzindo uma locomotiva a vapor colorida",
    "styleLayer": "estilo ilustração clássica de livro infantil com cores ricas e atmosfera nostálgica de viagem",
    "environmentLayer": "atravessando uma ponte de arcos de pedra acima de um vale verde arborizado e montanhas",
    "hint1": "Dica de Estilo (60s): Ilustração clássica de livro infantil com cores alegres de aventura ferroviária!",
    "hint2": "Dica Principal (30s): Uma anta de boné de maquinista e lenço vermelho pilotando um trem sobre uma ponte de pedra!",
    "keywords": {
      "subject": [
        {
          "concept": "Anta simpática de boné de maquinista e lenço vermelho",
          "weight": 0.55,
          "synonyms": [
            "anta",
            "animal",
            "maquinista",
            "condutor",
            "bone",
            "chapeu de maquinista",
            "lenco vermelho"
          ]
        },
        {
          "concept": "Conduzindo uma locomotiva / trem a vapor colorido",
          "weight": 0.45,
          "synonyms": [
            "trem",
            "locomotiva",
            "maria-fumaca",
            "vapor",
            "conduzindo",
            "pilotando",
            "ferrovia"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração clássica de livro infantil",
          "weight": 0.65,
          "synonyms": [
            "livro infantil",
            "livro ilustrado",
            "ilustracao",
            "pintura",
            "desenho",
            "colorido"
          ]
        },
        {
          "concept": "Cores vibrantes e atmosfera de viagem",
          "weight": 0.35,
          "synonyms": [
            "vibrante",
            "alegre",
            "nostalgico",
            "verde e vermelho"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Ponte / viaduto de arcos de pedra",
          "weight": 0.55,
          "synonyms": [
            "ponte",
            "viaduto",
            "ponte de pedra",
            "arcos",
            "trilhos"
          ]
        },
        {
          "concept": "Vale verde com árvores e neblina suave",
          "weight": 0.45,
          "synonyms": [
            "vale",
            "floresta",
            "montanhas",
            "arvores",
            "natureza"
          ]
        }
      ],
      "botPrompts": [
        "Uma anta simpática usando boné de maquinista e lenço vermelho conduzindo um trem a vapor colorido sobre uma ponte de pedra acima de um vale verde, ilustração de livro infantil",
        "Pintura estilo livro ilustrado mostrando uma anta maquinista sorridente na cabine de uma locomotiva atravessando um viaduto",
        "Anta condutora de trem viajando pelos trilhos sobre a ponte de pedra cercada por árvores e montanhas"
      ]
    }
  },
  {
    "id": "quero-quero-arbitro-futebol",
    "title": "Quero-Quero Árbitro na Arena Holográfica",
    "category": "Esporte & Games 3D",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/quero-quero-arbitro-futebol.webp",
    "fullPrompt": "Uma ave quero-quero determinada vestindo camisa listrada preta e branca de árbitro de futebol com apito levantando um cartão amarelo com a asa no centro de um campo de futebol holográfico futurista em um estádio iluminado, estilo ilustração 3D dinâmica de jogo esportivo",
    "subjectLayer": "Uma ave quero-quero vestindo camisa listrada de árbitro e apito levantando um cartão amarelo",
    "styleLayer": "estilo ilustração 3D dinâmica de videogame esportivo com luzes de estádio e linhas holográficas",
    "environmentLayer": "no gramado de um campo de futebol futurista dentro de uma grande arena iluminada por refletores",
    "hint1": "Dica de Estilo (60s): Ilustração 3D vibrante de jogo de esporte com linhas luminosas e refletores de estádio!",
    "hint2": "Dica Principal (30s): Um pássaro quero-quero vestido de juiz de futebol mostrando cartão amarelo no campo!",
    "keywords": {
      "subject": [
        {
          "concept": "Ave quero-quero vestindo camisa listrada de árbitro",
          "weight": 0.55,
          "synonyms": [
            "quero-quero",
            "ave",
            "passaro",
            "arbitro",
            "juiz",
            "camisa listrada",
            "apito"
          ]
        },
        {
          "concept": "Levantando cartão amarelo no jogo de futebol",
          "weight": 0.45,
          "synonyms": [
            "cartao amarelo",
            "cartao",
            "futebol",
            "jogo",
            "apitando",
            "esporte"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração 3D dinâmica de game esportivo",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "animacao 3d",
            "game",
            "videogame",
            "pixar",
            "cartoon 3d",
            "dinamico"
          ]
        },
        {
          "concept": "Luzes brilhantes e detalhes holográficos",
          "weight": 0.35,
          "synonyms": [
            "holografico",
            "neon",
            "brilhante",
            "vibrante",
            "iluminado"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Campo de futebol com gramado e linhas luminosas",
          "weight": 0.55,
          "synonyms": [
            "campo",
            "campo de futebol",
            "gramado",
            "linhas",
            "bola"
          ]
        },
        {
          "concept": "Estádio / arena iluminada por refletores",
          "weight": 0.45,
          "synonyms": [
            "estadio",
            "arena",
            "arquibancada",
            "refletores",
            "holofotes"
          ]
        }
      ],
      "botPrompts": [
        "Um pássaro quero-quero vestindo camisa listrada de juiz de futebol e apito mostrando um cartão amarelo num campo de futebol futurista iluminado, animação 3D",
        "Render 3D divertido de uma ave árbitro apitando uma partida de futebol dentro de um estádio cheio de luzes holográficas",
        "Quero-quero juiz com uniforme preto e branco levantando cartão amarelo no meio do gramado da arena"
      ]
    }
  },
  {
    "id": "bem-te-vi-cantor-radio",
    "title": "Bem-Te-Vi Locutor na Rádio Retrô Anos 50",
    "category": "Música & Retrô",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/bem-te-vi-cantor-radio.webp",
    "fullPrompt": "Um pássaro bem-te-vi de peito amarelo vibrante usando fones de ouvido retrô cantando diante de um microfone cromado clássico dentro de um estúdio de rádio dos anos 50 com placa luminosa ON AIR e discos de vinil na parede, estilo ilustração retrô mid-century",
    "subjectLayer": "Um pássaro bem-te-vi amarelo usando fones de ouvido cantando diante de um microfone cromado retrô",
    "styleLayer": "estilo ilustração retrô mid-century dos anos 50 com cores quentes, amarelo-ouro e brilho vintage",
    "environmentLayer": "dentro de um estúdio de rádio clássico com letreiro luminoso e discos de vinil nas paredes",
    "hint1": "Dica de Estilo (60s): Ilustração retrô estilo anos 50 com microfone cromado, vinis e cores quentes!",
    "hint2": "Dica Principal (30s): Um pássaro bem-te-vi amarelo de fones cantando num microfone de estúdio de rádio!",
    "keywords": {
      "subject": [
        {
          "concept": "Pássaro bem-te-vi amarelo usando fones de ouvido",
          "weight": 0.55,
          "synonyms": [
            "bem-te-vi",
            "passaro",
            "passarinho",
            "ave amarela",
            "amarelo",
            "fones de ouvido",
            "cantor",
            "locutor"
          ]
        },
        {
          "concept": "Cantando diante de um microfone cromado clássico",
          "weight": 0.45,
          "synonyms": [
            "microfone",
            "cantando",
            "locucao",
            "radio",
            "musica",
            "voz"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração retrô anos 50 (mid-century)",
          "weight": 0.6,
          "synonyms": [
            "retro",
            "vintage",
            "anos 50",
            "ilustracao",
            "pintura digital",
            "classico"
          ]
        },
        {
          "concept": "Paleta amarelo vibrante e luz quente de estúdio",
          "weight": 0.4,
          "synonyms": [
            "amarelo",
            "quente",
            "dourado",
            "colorido",
            "vibrante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Estúdio de rádio com placa luminosa no ar",
          "weight": 0.55,
          "synonyms": [
            "estudio",
            "estudio de radio",
            "radio",
            "mesa",
            "letreiro",
            "placa luminosa"
          ]
        },
        {
          "concept": "Discos de vinil decorando a parede",
          "weight": 0.45,
          "synonyms": [
            "discos",
            "vinil",
            "discos de vinil",
            "parede",
            "musica"
          ]
        }
      ],
      "botPrompts": [
        "Um pássaro bem-te-vi amarelo usando fones de ouvido cantando em um microfone cromado antigo dentro de um estúdio de rádio anos 50 com discos de vinil, ilustração retrô",
        "Arte retrô colorida mostrando um passarinho locutor de peito amarelo diante do microfone numa cabine de rádio iluminada",
        "Bem-te-vi músico com headphone cantando no estúdio vintage cercado por vinis e luzes quentes"
      ]
    }
  },
  {
    "id": "beija-flor-relojoeiro-flores",
    "title": "Beija-Flor Relojoeiro e a Flor Mecânica",
    "category": "Natureza & Steampunk Macro",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/beija-flor-relojoeiro-flores.webp",
    "fullPrompt": "Um beija-flor verde-esmeralda cintilante usando uma pequena lupa de relojoeiro pairando no ar para ajustar minúsculas engrenagens douradas no centro de uma flor mecânica de latão e pétalas brilhantes em um jardim ensolarado, estilo arte macro fantasia steampunk",
    "subjectLayer": "Um beija-flor verde-esmeralda usando lupa de relojoeiro ajustando engrenagens dentro de uma flor mecânica",
    "styleLayer": "estilo arte macro fantasia steampunk detalhada com reflexos metálicos em verde-esmeralda e ouro",
    "environmentLayer": "pairando no ar em um jardim iluminado pelo sol com folhas verdes e brilhos dourados",
    "hint1": "Dica de Estilo (60s): Arte Macro Fantasia Steampunk detalhada em tons de verde-esmeralda e latão dourado!",
    "hint2": "Dica Principal (30s): Um beija-flor de lupa ajustando engrenagens douradas dentro de uma flor mecânica!",
    "keywords": {
      "subject": [
        {
          "concept": "Beija-flor verde-esmeralda usando lupa de relojoeiro",
          "weight": 0.55,
          "synonyms": [
            "beija-flor",
            "colibri",
            "passarinho",
            "ave",
            "esmeralda",
            "verde",
            "lupa",
            "monoculo",
            "relojoeiro"
          ]
        },
        {
          "concept": "Ajustando engrenagens douradas em uma flor mecânica",
          "weight": 0.45,
          "synonyms": [
            "engrenagens",
            "flor mecanica",
            "flor",
            "mecanismo",
            "relogio",
            "douradas",
            "latao",
            "ajustando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Macro fantasia Steampunk detalhada",
          "weight": 0.65,
          "synonyms": [
            "steampunk",
            "macro",
            "fantasia",
            "ilustracao digital",
            "3d realista",
            "detalhado"
          ]
        },
        {
          "concept": "Brilho metálico esmeralda e dourado",
          "weight": 0.35,
          "synonyms": [
            "esmeralda",
            "dourado",
            "ouro",
            "cobre",
            "brilhante",
            "cintilante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Jardim ensolarado com plantas e flores",
          "weight": 0.6,
          "synonyms": [
            "jardim",
            "natureza",
            "folhas",
            "flores",
            "ar livre"
          ]
        },
        {
          "concept": "Raios de sol e partículas de luz",
          "weight": 0.4,
          "synonyms": [
            "sol",
            "luz solar",
            "particulas",
            "brilho"
          ]
        }
      ],
      "botPrompts": [
        "Um beija-flor verde-esmeralda usando uma lupa de relojoeiro pairando no ar para ajustar engrenagens douradas dentro de uma flor mecânica num jardim, arte macro steampunk",
        "Ilustração macro fantasia steampunk de um colibri brilhante consertando o mecanismo de ouro de uma flor em meio à natureza",
        "Beija-flor inventor com monóculo dourado trabalhando nas engrenagens de uma flor de latão iluminada pelo sol"
      ]
    }
  },
  {
    "id": "sabia-maestro-coral",
    "title": "Sabiá Maestro e o Coral na Partitura do Amanhecer",
    "category": "Música & Papel Recortado",
    "difficulty": "Médio",
    "imageUrl": "/challenges/sabia-maestro-coral.webp",
    "fullPrompt": "Um pássaro sabiá-laranjeira vestindo fraque elegante de maestro regendo com uma batuta um coral de pequenos passarinhos coloridos pousados em fios que formam uma partitura musical sob o sol dourado do amanhecer, estilo ilustração em papel recortado em camadas",
    "subjectLayer": "Um sabiá-laranjeira de fraque regendo um coral de passarinhos coloridos pousados nos fios",
    "styleLayer": "estilo ilustração em papel recortado em camadas (papercut) com tons dourados e laranjas do amanhecer",
    "environmentLayer": "sobre fios suspensos que formam notas de uma partitura musical diante do sol nascente",
    "hint1": "Dica de Estilo (60s): Arte em papel recortado em camadas (papercut) com cores quentes do amanhecer!",
    "hint2": "Dica Principal (30s): Um pássaro maestro de fraque regendo um coral de passarinhos pousados nos fios!",
    "keywords": {
      "subject": [
        {
          "concept": "Sabiá-laranjeira vestindo fraque de maestro com batuta",
          "weight": 0.55,
          "synonyms": [
            "sabia",
            "passaro",
            "ave",
            "maestro",
            "regente",
            "fraque",
            "terno",
            "batuta"
          ]
        },
        {
          "concept": "Regendo coral de pequenos passarinhos coloridos",
          "weight": 0.45,
          "synonyms": [
            "coral",
            "passarinhos",
            "aves",
            "cantando",
            "regendo",
            "musica",
            "orquestra"
          ]
        }
      ],
      "style": [
        {
          "concept": "Arte de papel recortado em camadas",
          "weight": 0.65,
          "synonyms": [
            "papel recortado",
            "camadas",
            "papercut",
            "colagem de papel",
            "diorama",
            "ilustracao"
          ]
        },
        {
          "concept": "Paleta dourada e laranja do amanhecer",
          "weight": 0.35,
          "synonyms": [
            "dourado",
            "laranja",
            "amanhecer",
            "nascer do sol",
            "colorido"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Fios formando linhas e notas de partitura musical",
          "weight": 0.55,
          "synonyms": [
            "fios",
            "partitura",
            "notas musicais",
            "linhas",
            "poste"
          ]
        },
        {
          "concept": "Céu iluminado pelo sol nascente",
          "weight": 0.45,
          "synonyms": [
            "sol",
            "ceu",
            "horizonte",
            "manha"
          ]
        }
      ],
      "botPrompts": [
        "Um pássaro sabiá de fraque regendo com batuta um coral de passarinhos coloridos pousados em fios como uma partitura ao amanhecer, estilo papel recortado em camadas",
        "Ilustração em camadas de papel recortado mostrando uma ave maestra conduzindo pequenos pássaros cantores sob o sol dourado",
        "Passarinho maestro elegante regendo notas musicais e aves nos fios contra o céu alaranjado da manhã"
      ]
    }
  },
  {
    "id": "ema-maratonista-dunas",
    "title": "Ema Maratonista nas Dunas e Lagoas",
    "category": "Esporte & Brasilidades",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/ema-maratonista-dunas.webp",
    "fullPrompt": "Uma ema atlética usando faixa esportiva neon na cabeça e tênis de corrida correndo em alta velocidade pelas dunas de areia branca ao lado de lagoas azul-turquesa sob um céu ensolarado, estilo ilustração de história em quadrinhos em cel shading vibrante",
    "subjectLayer": "Uma ema atlética usando faixa esportiva e tênis de corrida correndo em alta velocidade",
    "styleLayer": "estilo ilustração de história em quadrinhos (HQ) em cel shading vibrante com linhas de velocidade",
    "environmentLayer": "sobre dunas de areia branca ao lado de lagoas azul-turquesa cristalinas sob o céu azul",
    "hint1": "Dica de Estilo (60s): Ilustração estilo Quadrinhos / Cel Shading vibrante em branco, turquesa e neon!",
    "hint2": "Dica Principal (30s): Uma ema de tênis e faixa esportiva correndo pelas dunas de areia e lagoas azuis!",
    "keywords": {
      "subject": [
        {
          "concept": "Ema atlética usando faixa esportiva e tênis",
          "weight": 0.55,
          "synonyms": [
            "ema",
            "avestruz",
            "ave",
            "passaro corredor",
            "tenis",
            "faixa",
            "atleta",
            "maratonista"
          ]
        },
        {
          "concept": "Correndo em alta velocidade",
          "weight": 0.45,
          "synonyms": [
            "correndo",
            "corrida",
            "velocidade",
            "esporte",
            "maratona"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração estilo Quadrinhos / Cel Shading",
          "weight": 0.65,
          "synonyms": [
            "quadrinhos",
            "hq",
            "cel shading",
            "cartoon",
            "desenho",
            "comic",
            "vibrante"
          ]
        },
        {
          "concept": "Contraste areia branca, azul-turquesa e neon",
          "weight": 0.35,
          "synonyms": [
            "turquesa",
            "azul",
            "branco",
            "neon",
            "ensolarado"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Dunas de areia branca dos Lençóis",
          "weight": 0.55,
          "synonyms": [
            "dunas",
            "areia",
            "areia branca",
            "lencois maranhenses",
            "deserto"
          ]
        },
        {
          "concept": "Lagoas azul-turquesa sob céu aberto",
          "weight": 0.45,
          "synonyms": [
            "lagoa",
            "lagoas",
            "agua azul",
            "ceu azul",
            "sol"
          ]
        }
      ],
      "botPrompts": [
        "Uma ema atlética usando faixa esportiva e tênis de corrida correndo pelas dunas de areia branca ao lado de lagoas azul-turquesa, ilustração estilo quadrinhos cel shading",
        "Desenho estilo HQ vibrante de uma ave ema corredora em alta velocidade entre dunas brancas e lagoas cristalinas",
        "Ema maratonista de tênis colorido disputando corrida nas dunas ensolaradas sob o céu azul"
      ]
    }
  },
  {
    "id": "curio-vidreiro-colorido",
    "title": "Curió Mestre Vidreiro e o Vaso Arco-Íris",
    "category": "Artesanato & Pintura Digital",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/curio-vidreiro-colorido.webp",
    "fullPrompt": "Um pequeno pássaro artesão usando óculos de proteção soprando um vaso de vidro incandescente com listras coloridas de arco-íris na ponta de uma cana de sopro metálica dentro de uma oficina tradicional de vidro soprado aquecida pelo forno, estilo pintura digital rica",
    "subjectLayer": "Um pássaro artesão de óculos de proteção soprando um vaso de vidro colorido incandescente",
    "styleLayer": "estilo pintura digital rica e luminosa com reflexos translúcidos de vidro e brilho quente de fornalha",
    "environmentLayer": "dentro de uma oficina tradicional de mestre vidreiro cercada por vasos coloridos e forno aceso",
    "hint1": "Dica de Estilo (60s): Pintura digital luminosa com reflexos de vidro colorido e luz quente de forno!",
    "hint2": "Dica Principal (30s): Um pássaro de óculos soprando um vaso de vidro colorido num tubo dentro de uma oficina!",
    "keywords": {
      "subject": [
        {
          "concept": "Pássaro artesão usando óculos de proteção",
          "weight": 0.55,
          "synonyms": [
            "passaro",
            "curio",
            "passarinho",
            "ave",
            "artesao",
            "vidreiro",
            "oculos",
            "oculos de protecao"
          ]
        },
        {
          "concept": "Soprando vaso de vidro colorido de arco-íris",
          "weight": 0.45,
          "synonyms": [
            "vidro",
            "vaso de vidro",
            "soprando",
            "vidro soprado",
            "tubo",
            "colorido",
            "arco-iris"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura digital rica com brilho incandescente",
          "weight": 0.65,
          "synonyms": [
            "pintura digital",
            "ilustracao digital",
            "realista",
            "luminoso",
            "translucido"
          ]
        },
        {
          "concept": "Cores de arco-íris e luz laranja quente",
          "weight": 0.35,
          "synonyms": [
            "laranja",
            "dourado",
            "colorido",
            "brilhante",
            "quente"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Oficina de vidro soprado com forno aceso",
          "weight": 0.6,
          "synonyms": [
            "oficina",
            "forno",
            "fornalha",
            "atelie",
            "bancada"
          ]
        },
        {
          "concept": "Peças e garrafas de vidro colorido nas prateleiras",
          "weight": 0.4,
          "synonyms": [
            "vidro soprado",
            "vaso de vidro",
            "prateleiras",
            "garrafas",
            "vasos",
            "vidraria"
          ]
        }
      ],
      "botPrompts": [
        "Um pássaro artesão usando óculos de proteção soprando um vaso de vidro colorido brilhante na ponta de um tubo dentro de uma oficina com forno aceso, pintura digital",
        "Ilustração digital luminosa de um passarinho vidreiro moldando um vaso arco-íris translúcido no ateliê aquecido",
        "Ave artesã com óculos de segurança criando peças de vidro soprado colorido diante da fornalha dourada"
      ]
    }
  },
  {
    "id": "pirarucu-submarino-amazonia",
    "title": "Pirarucu Mecânico na Floresta Inundada",
    "category": "Amazônia & Solarpunk",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/pirarucu-submarino-amazonia.webp",
    "fullPrompt": "Um peixe pirarucu gigante com nadadeiras mecânicas de latão e janelas redondas iluminadas como um submarino nadando entre os troncos submersos de uma floresta amazônica inundada atravessada por feixes de luz solar, estilo arte digital solarpunk e steampunk",
    "subjectLayer": "Um peixe pirarucu gigante com nadadeiras de latão e janelas iluminadas como um submarino",
    "styleLayer": "estilo arte digital solarpunk e steampunk com feixes de luz solar atravessando a água verde-esmeralda",
    "environmentLayer": "nadando entre troncos de árvores submersas e plantas aquáticas de uma floresta inundada",
    "hint1": "Dica de Estilo (60s): Arte digital Solarpunk / Steampunk com feixes de luz solar na água verde-esmeralda!",
    "hint2": "Dica Principal (30s): Um peixe pirarucu gigante em forma de submarino com janelas nadando numa floresta submersa!",
    "keywords": {
      "subject": [
        {
          "concept": "Peixe pirarucu gigante biomecânico",
          "weight": 0.55,
          "synonyms": [
            "pirarucu",
            "peixe",
            "peixe gigante",
            "amazonia",
            "mecanico",
            "robo"
          ]
        },
        {
          "concept": "Janelas redondas iluminadas e detalhes de submarino em latão",
          "weight": 0.45,
          "synonyms": [
            "submarino",
            "janelas",
            "escotilhas",
            "latao",
            "dourado",
            "nadadeiras",
            "iluminado"
          ]
        }
      ],
      "style": [
        {
          "concept": "Arte digital Solarpunk e Steampunk",
          "weight": 0.6,
          "synonyms": [
            "solarpunk",
            "steampunk",
            "arte digital",
            "pintura digital",
            "ilustracao",
            "fantasia"
          ]
        },
        {
          "concept": "Feixes de luz solar na água verde-esmeralda",
          "weight": 0.4,
          "synonyms": [
            "raios de sol",
            "feixes de luz",
            "verde",
            "esmeralda",
            "subaquatico"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Floresta amazônica inundada com troncos submersos",
          "weight": 0.6,
          "synonyms": [
            "floresta inundada",
            "igapo",
            "rio",
            "troncos",
            "arvores",
            "fundo do rio"
          ]
        },
        {
          "concept": "Peixinhos e plantas aquáticas ao redor",
          "weight": 0.4,
          "synonyms": [
            "submersos",
            "amazonica",
            "plantas aquaticas",
            "peixinhos",
            "agua",
            "natureza"
          ]
        }
      ],
      "botPrompts": [
        "Um peixe pirarucu gigante com detalhes de latão e janelas iluminadas de submarino nadando entre troncos de uma floresta inundada com raios de sol, arte digital steampunk solarpunk",
        "Pintura digital subaquática mostrando um peixe-submarino amazônico brilhante navegando pelas águas verdes cheias de árvores",
        "Pirarucu mecânico dourado com escotilhas acesas deslizando sob os feixes de luz de um rio na floresta"
      ]
    }
  },
  {
    "id": "sucuri-pintora-mural",
    "title": "Sucuri Artista e o Mural Geométrico da Floresta",
    "category": "Arte Urbana & Brasilidades",
    "difficulty": "Médio",
    "imageUrl": "/challenges/sucuri-pintora-mural.webp",
    "fullPrompt": "Uma cobra sucuri verde simpática usando boina roxa de artista segurando pincéis coloridos para pintar um mural geométrico vibrante da floresta tropical sobre um muro de pedra antigo cercado por folhagens, estilo ilustração de arte urbana colorida",
    "subjectLayer": "Uma sucuri verde simpática usando boina roxa segurando pincéis e pintando um mural colorido",
    "styleLayer": "estilo ilustração vibrante de street art e muralismo brasileiro com formas geométricas e cores tropicais",
    "environmentLayer": "diante de uma parede de pedra decorada com desenhos da floresta e plantas tropicais ao redor",
    "hint1": "Dica de Estilo (60s): Ilustração vibrante inspirada em Muralismo e Arte Urbana com cores tropicais!",
    "hint2": "Dica Principal (30s): Uma cobra verde de boina roxa pintando com pincel um mural colorido na parede!",
    "keywords": {
      "subject": [
        {
          "concept": "Cobra sucuri verde simpática usando boina roxa",
          "weight": 0.55,
          "synonyms": [
            "sucuri",
            "cobra",
            "serpente",
            "jiboia",
            "verde",
            "boina",
            "boina roxa",
            "artista",
            "pintora"
          ]
        },
        {
          "concept": "Segurando pincéis e pintando um mural colorido",
          "weight": 0.45,
          "synonyms": [
            "pintando",
            "pincel",
            "pinceis",
            "tinta",
            "mural",
            "quadro",
            "arte"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração vibrante de muralismo e arte urbana",
          "weight": 0.65,
          "synonyms": [
            "muralismo",
            "arte de rua",
            "street art",
            "geometrico",
            "ilustracao",
            "colorido",
            "vibrante"
          ]
        },
        {
          "concept": "Paleta tropical verde, roxo, amarelo e laranja",
          "weight": 0.35,
          "synonyms": [
            "tropical",
            "roxo",
            "verde",
            "amarelo",
            "alegre"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Muro de pedra com pintura da floresta",
          "weight": 0.55,
          "synonyms": [
            "muro",
            "parede",
            "pedra",
            "painel",
            "desenho"
          ]
        },
        {
          "concept": "Folhagens da selva e potes de tinta ao redor",
          "weight": 0.45,
          "synonyms": [
            "floresta",
            "folhas",
            "plantas",
            "latas de tinta"
          ]
        }
      ],
      "botPrompts": [
        "Uma cobra sucuri verde simpática usando boina roxa segurando pincel para pintar um mural geométrico colorido da floresta em uma parede de pedra, ilustração vibrante",
        "Arte colorida mostrando uma serpente pintora de boina decorando um muro com desenhos tropicais e potes de tinta",
        "Sucuri artista sorridente fazendo pintura mural cheia de cores vivas no meio da vegetação"
      ]
    }
  },
  {
    "id": "iguana-marinha-mergulhadora",
    "title": "Iguana Mergulhadora no Recife Vulcânico",
    "category": "Oceano & Animação 3D",
    "difficulty": "Médio",
    "imageUrl": "/challenges/iguana-marinha-mergulhadora.webp",
    "fullPrompt": "Uma iguana-marinha simpática usando um capacete de mergulho antigo de cobre com visor de vidro explorando um recife submarino repleto de estrelas-do-mar luminosas, anêmonas coloridas e bolhas no fundo do oceano, estilo animação 3D Pixar",
    "subjectLayer": "Uma iguana-marinha simpática usando capacete de mergulho antigo de cobre com visor redondo",
    "styleLayer": "estilo animação 3D Pixar vibrante com iluminação subaquática azul-turquesa e reflexos no vidro",
    "environmentLayer": "no fundo do mar cercada por estrelas-do-mar brilhantes, corais, anêmonas e bolhas de ar",
    "hint1": "Dica de Estilo (60s): Animação 3D estilo Pixar no fundo do mar com brilho turquesa e reflexos de cobre!",
    "hint2": "Dica Principal (30s): Uma iguana usando capacete redondo de escafandro de cobre entre estrelas-do-mar!",
    "keywords": {
      "subject": [
        {
          "concept": "Iguana-marinha simpática exploradora",
          "weight": 0.5,
          "synonyms": [
            "iguana",
            "lagarto",
            "reptil",
            "mergulhadora",
            "exploradora"
          ]
        },
        {
          "concept": "Usando capacete de mergulho antigo de cobre (escafandro)",
          "weight": 0.5,
          "synonyms": [
            "capacete de mergulho",
            "escafandro",
            "capacete de cobre",
            "mergulho",
            "visor de vidro",
            "bolha"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação 3D estilo Pixar",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "pixar",
            "animacao",
            "disney",
            "render 3d",
            "cartoon 3d"
          ]
        },
        {
          "concept": "Iluminação subaquática azul e corais vibrantes",
          "weight": 0.35,
          "synonyms": [
            "azul",
            "turquesa",
            "colorido",
            "subaquatico",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Recife submarino no fundo do oceano",
          "weight": 0.5,
          "synonyms": [
            "recife",
            "fundo do mar",
            "oceano",
            "rochas",
            "submarino"
          ]
        },
        {
          "concept": "Estrelas-do-mar, anêmonas coloridas e bolhas",
          "weight": 0.5,
          "synonyms": [
            "estrela-do-mar",
            "estrelas do mar",
            "anemonas",
            "corais",
            "bolhas"
          ]
        }
      ],
      "botPrompts": [
        "Uma iguana simpática usando um capacete de mergulho antigo de cobre explorando o fundo do mar cercada por estrelas-do-mar e corais coloridos, animação 3D Pixar",
        "Render 3D vibrante de um lagarto mergulhador com escafandro redondo entre anêmonas brilhantes e bolhas no oceano",
        "Iguana-marinha aventureira equipada com capacete de vidro e cobre passeando pelo recife subaquático"
      ]
    }
  },
  {
    "id": "condor-cartografo-cordilheira",
    "title": "Condor Cartógrafo no Observatório dos Andes",
    "category": "América Latina & Arte Conceitual",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/condor-cartografo-cordilheira.webp",
    "fullPrompt": "Um nobre condor-dos-andes usando colete de couro de aviador e óculos de proteção na testa desenhando um mapa das montanhas sobre uma prancheta dentro de um observatório de madeira no alto de um pico nevado da cordilheira, estilo arte conceitual épica",
    "subjectLayer": "Um condor-dos-andes usando colete de aviador e óculos desenhando um mapa em uma prancheta",
    "styleLayer": "estilo arte conceitual épica e pintura digital detalhada com luz dramática de alta montanha",
    "environmentLayer": "dentro de um observatório de madeira com vista panorâmica para os picos nevados da cordilheira",
    "hint1": "Dica de Estilo (60s): Arte conceitual e pintura digital detalhada com vista épica de montanhas nevadas!",
    "hint2": "Dica Principal (30s): Um condor de colete e óculos de aviador desenhando um mapa no alto da cordilheira!",
    "keywords": {
      "subject": [
        {
          "concept": "Condor-dos-andes usando colete e óculos de aviador",
          "weight": 0.55,
          "synonyms": [
            "condor",
            "aguia",
            "falcao",
            "ave de rapina",
            "ave",
            "colete de couro",
            "oculos de aviador",
            "cartografo"
          ]
        },
        {
          "concept": "Desenhando mapa das montanhas na prancheta",
          "weight": 0.45,
          "synonyms": [
            "mapa",
            "desenhando",
            "prancheta",
            "mesa",
            "bussola",
            "cartografia",
            "explorador"
          ]
        }
      ],
      "style": [
        {
          "concept": "Arte conceitual épica / Pintura digital detalhada",
          "weight": 0.65,
          "synonyms": [
            "arte conceitual",
            "pintura digital",
            "ilustracao",
            "epico",
            "cinematografico",
            "detalhado"
          ]
        },
        {
          "concept": "Luz clara de altitude e tons de couro e neve",
          "weight": 0.35,
          "synonyms": [
            "montanha",
            "luz solar",
            "marrom e azul",
            "realista"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Observatório de madeira no topo da montanha",
          "weight": 0.5,
          "synonyms": [
            "observatorio",
            "cabana",
            "varanda",
            "madeira",
            "janela"
          ]
        },
        {
          "concept": "Picos nevados da Cordilheira dos Andes",
          "weight": 0.5,
          "synonyms": [
            "cordilheira",
            "andes",
            "montanhas nevadas",
            "neve",
            "picos",
            "nuvens"
          ]
        }
      ],
      "botPrompts": [
        "Um condor usando colete de couro e óculos de aviador desenhando um mapa sobre uma mesa em um observatório de madeira diante de montanhas nevadas, arte conceitual",
        "Pintura digital detalhada de uma grande ave condor cartógrafa traçando rotas com vista para os picos brancos dos Andes",
        "Condor explorador com traje de aviador estudando mapas antigos no alto da cordilheira ensolarada"
      ]
    }
  },
  {
    "id": "chinchila-tecela-tapete",
    "title": "Chinchila Tecelã e o Tapete Andino",
    "category": "América Latina & Stop-Motion",
    "difficulty": "Médio",
    "imageUrl": "/challenges/chinchila-tecela-tapete.webp",
    "fullPrompt": "Uma chinchila cinza fofa e felpuda usando gorro andino colorido tecendo um tapete com padrões geométricos vibrantes em um tear de madeira dentro de uma oficina aconchegante cercada por novelos e meadas de lã tingida, estilo animação stop-motion de massinha",
    "subjectLayer": "Uma chinchila cinza fofa usando gorro andino colorido tecendo um tapete geométrico em um tear de madeira",
    "styleLayer": "estilo animação stop-motion de massinha (claymation) com texturas de lã colorida e luz aconchegante",
    "environmentLayer": "dentro de um ateliê de pedra e madeira repleto de cestos com novelos de lã vermelha, azul e amarela",
    "hint1": "Dica de Estilo (60s): Animação Stop-Motion de massinha (claymation) com texturas de lã e cores vibrantes!",
    "hint2": "Dica Principal (30s): Uma chinchila de gorro colorido tecendo um tapete num tear de madeira!",
    "keywords": {
      "subject": [
        {
          "concept": "Chinchila cinza fofa usando gorro andino colorido",
          "weight": 0.55,
          "synonyms": [
            "chinchila",
            "roedor",
            "coelhinho",
            "cinza",
            "gorro",
            "chapeu colorido",
            "andino",
            "tecela",
            "artesa"
          ]
        },
        {
          "concept": "Tecendo tapete colorido em um tear de madeira",
          "weight": 0.45,
          "synonyms": [
            "tear",
            "tapete",
            "tecendo",
            "tecelagem",
            "fios",
            "geometrico"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação stop-motion de massinha (claymation)",
          "weight": 0.65,
          "synonyms": [
            "massinha",
            "stop-motion",
            "claymation",
            "3d",
            "animacao 3d",
            "boneco",
            "fofo"
          ]
        },
        {
          "concept": "Cores vibrantes de lã tingida",
          "weight": 0.35,
          "synonyms": [
            "colorido",
            "vibrante",
            "vermelho",
            "amarelo",
            "azul",
            "aconchegante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Oficina de tecelagem rústica",
          "weight": 0.5,
          "synonyms": [
            "oficina",
            "atelie",
            "cabana",
            "madeira",
            "pedra"
          ]
        },
        {
          "concept": "Novelos e meadas de lã espalhados em cestos",
          "weight": 0.5,
          "synonyms": [
            "la",
            "novelos",
            "cestos",
            "linhas",
            "fios coloridos"
          ]
        }
      ],
      "botPrompts": [
        "Uma chinchila cinza fofa usando gorro andino colorido tecendo um tapete geométrico em um tear de madeira cercada por novelos de lã, estilo stop-motion de massinha",
        "Visual claymation 3D aconchegante de uma chinchila artesã trabalhando num tear cheio de fios coloridos em sua oficina",
        "Pequena chinchila de chapéu colorido criando uma tapeçaria vibrante entre cestos de lã tingida"
      ]
    }
  },
  {
    "id": "alpaca-dj-festival-montanha",
    "title": "Alpaca DJ no Festival das Montanhas",
    "category": "Música & América Latina",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/alpaca-dj-festival-montanha.webp",
    "fullPrompt": "Uma alpaca branca felpuda usando óculos em formato de estrela e poncho neon colorido mixando música em uma mesa de DJ iluminada em um festival nas montanhas decorado com lanternas de papel coloridas ao entardecer, estilo animação 3D de cinema",
    "subjectLayer": "Uma alpaca branca felpuda de óculos de estrela e poncho colorido tocando em uma mesa de DJ",
    "styleLayer": "estilo animação 3D de cinema vibrante com luzes neon festivas e lanternas coloridas",
    "environmentLayer": "em um palco ao ar livre nas montanhas decorado com varais de lanternas de papel ao pôr do sol",
    "hint1": "Dica de Estilo (60s): Animação 3D vibrante estilo cinema com luzes neon e lanternas de festa!",
    "hint2": "Dica Principal (30s): Uma alpaca branca de óculos de estrela e poncho tocando como DJ nas montanhas!",
    "keywords": {
      "subject": [
        {
          "concept": "Alpaca branca felpuda de óculos de estrela e poncho",
          "weight": 0.55,
          "synonyms": [
            "alpaca",
            "lhama",
            "animal",
            "branca",
            "oculos de estrela",
            "oculos",
            "poncho",
            "dj"
          ]
        },
        {
          "concept": "Mixando música em uma mesa de DJ iluminada",
          "weight": 0.45,
          "synonyms": [
            "mesa de dj",
            "toca-discos",
            "controladora",
            "musica",
            "mixando",
            "festa"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação 3D de cinema vibrante",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "animacao 3d",
            "pixar",
            "disney",
            "render 3d",
            "cartoon 3d"
          ]
        },
        {
          "concept": "Luzes neon e cores festivas",
          "weight": 0.35,
          "synonyms": [
            "neon",
            "colorido",
            "vibrante",
            "brilhante",
            "holografico"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Festival ao ar livre com montanhas ao fundo",
          "weight": 0.55,
          "synonyms": [
            "montanhas",
            "festival",
            "palco",
            "andes",
            "ar livre"
          ]
        },
        {
          "concept": "Varais de lanternas de papel coloridas",
          "weight": 0.45,
          "synonyms": [
            "lanternas",
            "lanternas de papel",
            "luminarias",
            "luzes penduradas"
          ]
        }
      ],
      "botPrompts": [
        "Uma alpaca branca fofa usando óculos de estrela e poncho colorido tocando numa mesa de DJ iluminada em um festival nas montanhas com lanternas de papel, animação 3D",
        "Render 3D divertido de uma alpaca DJ animando a festa ao ar livre nos Andes sob lanternas brilhantes",
        "Alpaca estilosa com poncho neon e óculos divertidos comandando o som na mesa de DJ diante das montanhas"
      ]
    }
  },
  {
    "id": "vicunha-astronoma-deserto",
    "title": "Vicunha Astrônoma e o Radiotelescópio do Atacama",
    "category": "Astronomia & Ciência",
    "difficulty": "Médio",
    "imageUrl": "/challenges/vicunha-astronoma-deserto.webp",
    "fullPrompt": "Uma vicunha dourada elegante usando cachecol estampado operando uma grande antena parabólica branca de radiotelescópio no deserto de altitude sob um céu noturno límpido repleto de estrelas da Via Láctea, estilo ilustração digital nítida",
    "subjectLayer": "Uma vicunha dourada usando cachecol colorido ao lado de uma grande antena de radiotelescópio",
    "styleLayer": "estilo ilustração digital científica e poética com céu estrelado brilhante da Via Láctea",
    "environmentLayer": "em um planalto de deserto nas alturas com antenas astronômicas brancas sob o cosmos estrelado",
    "hint1": "Dica de Estilo (60s): Ilustração digital luminosa sob o céu estrelado da Via Láctea em azul e dourado!",
    "hint2": "Dica Principal (30s): Uma vicunha/lhama de cachecol junto a uma antena parabólica de telescópio no deserto!",
    "keywords": {
      "subject": [
        {
          "concept": "Vicunha dourada usando cachecol estampado",
          "weight": 0.55,
          "synonyms": [
            "vicunha",
            "lhama",
            "alpaca",
            "animal",
            "cachecol",
            "astronoma",
            "cientista"
          ]
        },
        {
          "concept": "Operando antena parabólica branca de radiotelescópio",
          "weight": 0.45,
          "synonyms": [
            "radiotelescopio",
            "antena",
            "antena parabolica",
            "telescopio",
            "observatorio",
            "astronomia"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração digital nítida e luminosa",
          "weight": 0.6,
          "synonyms": [
            "ilustracao digital",
            "pintura digital",
            "arte digital",
            "nitido",
            "moderno"
          ]
        },
        {
          "concept": "Contraste deserto dourado e céu azul-estelar",
          "weight": 0.4,
          "synonyms": [
            "estrelado",
            "azul",
            "dourado",
            "brilhante",
            "noturno"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Deserto de altitude e montanhas",
          "weight": 0.5,
          "synonyms": [
            "deserto",
            "atacama",
            "planalto",
            "montanhas",
            "areia"
          ]
        },
        {
          "concept": "Céu noturno com a Via Láctea estrelada",
          "weight": 0.5,
          "synonyms": [
            "via lactea",
            "estrelas",
            "ceu estrelado",
            "galaxia",
            "noite",
            "cosmos"
          ]
        }
      ],
      "botPrompts": [
        "Uma vicunha dourada usando cachecol colorido ao lado de uma grande antena branca de radiotelescópio no deserto sob o céu estrelado da Via Láctea, ilustração digital",
        "Arte digital mostrando uma vicunha astrônoma observando o espaço junto às antenas parabólicas na montanha à noite",
        "Lhama vicunha de cachecol estampado diante de um radiotelescópio branco sob milhões de estrelas"
      ]
    }
  },
  {
    "id": "caracal-relojoeiro-areia",
    "title": "Caracal Artesão de Ampulhetas Douradas",
    "category": "Fantasia & Relojoaria",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/caracal-relojoeiro-areia.webp",
    "fullPrompt": "Um felino caracal de orelhas pontudas com tufos vestindo colete bordado montando ampulhetas ornamentadas de latão e vidro turquesa cheias de areia dourada brilhante sobre a bancada de uma oficina em um bazar do deserto, estilo pintura digital de fantasia",
    "subjectLayer": "Um felino caracal de orelhas pontudas e colete bordado montando ampulhetas de vidro com areia dourada",
    "styleLayer": "estilo pintura digital de fantasia oriental com iluminação quente de lanternas em turquesa e ouro",
    "environmentLayer": "sobre a bancada de uma oficina repleta de ampulhetas luminosas, tapetes e lanternas de vitral",
    "hint1": "Dica de Estilo (60s): Pintura digital de fantasia em tons de ouro reluzente, bronze e vidro azul-turquesa!",
    "hint2": "Dica Principal (30s): Um gato caracal de colete bordado fazendo ampulhetas de areia dourada numa oficina!",
    "keywords": {
      "subject": [
        {
          "concept": "Felino caracal de orelhas pontudas vestindo colete bordado",
          "weight": 0.55,
          "synonyms": [
            "caracal",
            "lince",
            "gato",
            "felino",
            "orelhas pontudas",
            "colete",
            "artesao",
            "relojoeiro"
          ]
        },
        {
          "concept": "Montando ampulhetas de latão e vidro com areia dourada",
          "weight": 0.45,
          "synonyms": [
            "ampulheta",
            "ampulhetas",
            "relogio de areia",
            "areia dourada",
            "vidro",
            "tempo"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura digital de fantasia mágica",
          "weight": 0.65,
          "synonyms": [
            "pintura digital",
            "fantasia",
            "ilustracao digital",
            "magico",
            "detalhado"
          ]
        },
        {
          "concept": "Paleta dourado luminoso e azul-turquesa",
          "weight": 0.35,
          "synonyms": [
            "dourado",
            "turquesa",
            "ambar",
            "brilhante",
            "luz quente"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Oficina de bazar com bancada e prateleiras",
          "weight": 0.55,
          "synonyms": [
            "oficina",
            "bazar",
            "loja",
            "bancada",
            "prateleiras",
            "deserto"
          ]
        },
        {
          "concept": "Lanternas penduradas e frascos de vidro",
          "weight": 0.45,
          "synonyms": [
            "lanternas",
            "luminarias",
            "frascos",
            "vidros"
          ]
        }
      ],
      "botPrompts": [
        "Um gato caracal de orelhas compridas e colete bordado montando ampulhetas de vidro turquesa com areia dourada brilhante numa oficina iluminada, pintura digital de fantasia",
        "Ilustração mágica mostrando um lince artesão cuidando de relógios de areia luminosos na bancada de um bazar",
        "Felino caracal relojoeiro cercado por ampulhetas douradas e lanternas quentes em seu ateliê"
      ]
    }
  },
  {
    "id": "feneco-mensageiro-vento",
    "title": "Raposa-do-Deserto no Veleiro das Dunas",
    "category": "Aventura & Anime",
    "difficulty": "Médio",
    "imageUrl": "/challenges/feneco-mensageiro-vento.webp",
    "fullPrompt": "Uma pequena raposa-do-deserto feneco de orelhas grandes usando óculos de aviador pilotando um barco-veleiro de madeira com rodas e vela de tecido colorido deslizando pelas dunas douradas do deserto ao pôr do sol, estilo ilustração de aventura anime vibrante",
    "subjectLayer": "Uma raposa feneco de orelhas grandes e óculos de aviador pilotando um veleiro com rodas sobre a areia",
    "styleLayer": "estilo ilustração de anime de aventura vibrante com céu alaranjado de pôr do sol e vento dinâmico",
    "environmentLayer": "deslizando pelas dunas douradas de um grande deserto ao entardecer com vento nas velas",
    "hint1": "Dica de Estilo (60s): Ilustração vibrante estilo Anime de aventura sob o pôr do sol dourado!",
    "hint2": "Dica Principal (30s): Uma raposinha de orelhas grandes e óculos pilotando um barco a vela nas dunas do deserto!",
    "keywords": {
      "subject": [
        {
          "concept": "Raposa feneco de orelhas grandes com óculos de aviador",
          "weight": 0.55,
          "synonyms": [
            "feneco",
            "raposa",
            "raposinha",
            "raposa do deserto",
            "orelhas grandes",
            "oculos de aviador",
            "piloto"
          ]
        },
        {
          "concept": "Pilotando barco-veleiro de madeira sobre a areia",
          "weight": 0.45,
          "synonyms": [
            "veleiro",
            "barco a vela",
            "carro a vela",
            "vela",
            "barco",
            "pilotando",
            "navegando"
          ]
        }
      ],
      "style": [
        {
          "concept": "Ilustração estilo Anime de aventura vibrante",
          "weight": 0.65,
          "synonyms": [
            "anime",
            "ilustracao",
            "animacao japonesa",
            "aventura",
            "vibrante",
            "pintura digital"
          ]
        },
        {
          "concept": "Luz dourada e alaranjada de pôr do sol",
          "weight": 0.35,
          "synonyms": [
            "por do sol",
            "dourado",
            "laranja",
            "ensolarado",
            "quente"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Dunas de areia dourada do deserto",
          "weight": 0.6,
          "synonyms": [
            "deserto",
            "dunas",
            "areia",
            "vento"
          ]
        },
        {
          "concept": "Céu amplo de fim de tarde",
          "weight": 0.4,
          "synonyms": [
            "por do sol",
            "ceu",
            "horizonte",
            "nuvens",
            "entardecer"
          ]
        }
      ],
      "botPrompts": [
        "Uma raposinha feneco de orelhas grandes usando óculos de aviador pilotando um barco a vela pelas dunas de areia do deserto ao pôr do sol, estilo ilustração anime",
        "Arte anime de aventura mostrando uma raposa-do-deserto navegando num veleiro de madeira sobre as dunas douradas",
        "Feneco aventureiro no leme de um carro a vela colorido atravessando o deserto ensolarado"
      ]
    }
  },
  {
    "id": "okapi-bibliotecario-floresta",
    "title": "Ocapi Bibliotecário na Grande Árvore de Vitrais",
    "category": "Literatura & Fantasia",
    "difficulty": "Difícil",
    "imageUrl": "/challenges/okapi-bibliotecario-floresta.webp",
    "fullPrompt": "Um gentil ocapi de patas listradas usando óculos redondos carimbando livros em um balcão de madeira entalhada dentro de uma biblioteca circular construída no interior de uma árvore gigante com janelas de vitral colorido, estilo pintura em guache de livro ilustrado",
    "subjectLayer": "Um gentil ocapi de patas listradas usando óculos cuidando de livros em um balcão de madeira",
    "styleLayer": "estilo pintura em guache de livro ilustrado com luz colorida de vitrais e tons amadeirados aconchegantes",
    "environmentLayer": "dentro de uma biblioteca circular no tronco de uma árvore gigante com estantes curvas e vitrais",
    "hint1": "Dica de Estilo (60s): Pintura de livro ilustrado em guache com luzes coloridas de vitrais e madeira quente!",
    "hint2": "Dica Principal (30s): Um ocapi listrado de óculos no balcão de uma biblioteca dentro de uma árvore gigante!",
    "keywords": {
      "subject": [
        {
          "concept": "Ocapi de patas listradas usando óculos",
          "weight": 0.55,
          "synonyms": [
            "ocapi",
            "okapi",
            "girafa da floresta",
            "cervo",
            "zebra",
            "listrado",
            "oculos",
            "bibliotecario"
          ]
        },
        {
          "concept": "Organizando e carimbando livros no balcão",
          "weight": 0.45,
          "synonyms": [
            "livros",
            "carimbando",
            "lendo",
            "balcao",
            "mesa",
            "biblioteca"
          ]
        }
      ],
      "style": [
        {
          "concept": "Pintura em guache de livro ilustrado",
          "weight": 0.65,
          "synonyms": [
            "guache",
            "livro ilustrado",
            "ilustracao",
            "pintura",
            "aquarela",
            "fantasia aconchegante"
          ]
        },
        {
          "concept": "Luz aconchegante filtrada por vitrais",
          "weight": 0.35,
          "synonyms": [
            "vitral",
            "vitrais",
            "madeira",
            "quente",
            "colorido"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Biblioteca circular dentro de árvore gigante",
          "weight": 0.6,
          "synonyms": [
            "biblioteca",
            "arvore gigante",
            "tronco",
            "estantes",
            "prateleiras de livros"
          ]
        },
        {
          "concept": "Janelas de vitral colorido no alto",
          "weight": 0.4,
          "synonyms": [
            "janelas",
            "vitral colorido",
            "luz"
          ]
        }
      ],
      "botPrompts": [
        "Um ocapi gentil de patas listradas e óculos no balcão de uma biblioteca circular construída dentro de uma árvore gigante com janelas de vitral colorido, pintura em guache",
        "Ilustração aconchegante de livro infantil mostrando um ocapi bibliotecário cuidando dos livros entre estantes de madeira e vitrais",
        "Animal ocapi usando óculos organizando livros na recepção de uma biblioteca mágica dentro de um grande tronco"
      ]
    }
  },
  {
    "id": "pangolim-ferreiro-armadura",
    "title": "Pangolim Artesão e o Escudo Reluzente",
    "category": "Games & Arte Voxel",
    "difficulty": "Médio",
    "imageUrl": "/challenges/pangolim-ferreiro-armadura.webp",
    "fullPrompt": "Um pangolim dourado de escamas amigável vestindo avental de ferreiro polindo um escudo ornamentado de cobre e prata sobre um suporte de madeira dentro de uma oficina iluminada por lanternas quentes, estilo arte voxel 3D de blocos",
    "subjectLayer": "Um pangolim dourado de escamas vestindo avental de ferreiro polindo um escudo de cobre e prata",
    "styleLayer": "estilo arte voxel 3D de blocos cúbicos com iluminação quente de lanternas e reflexos metálicos",
    "environmentLayer": "dentro de uma oficina de ferreiro construída em blocos com bancada, bigorna e lanternas acesas",
    "hint1": "Dica de Estilo (60s): Arte Voxel 3D (blocos cúbicos estilizados) com luz quente de oficina e brilho metálico!",
    "hint2": "Dica Principal (30s): Um pangolim de escamas e avental cuidando de um escudo brilhante numa oficina!",
    "keywords": {
      "subject": [
        {
          "concept": "Pangolim dourado de escamas com avental de ferreiro",
          "weight": 0.55,
          "synonyms": [
            "pangolim",
            "tatu",
            "escamas",
            "dourado",
            "ferreiro",
            "artesao",
            "avental"
          ]
        },
        {
          "concept": "Polindo escudo ornamentado de cobre e prata",
          "weight": 0.45,
          "synonyms": [
            "escudo",
            "armadura",
            "cobre",
            "prata",
            "polindo",
            "forjando",
            "metal"
          ]
        }
      ],
      "style": [
        {
          "concept": "Arte Voxel 3D de blocos estilizados",
          "weight": 0.65,
          "synonyms": [
            "voxel",
            "arte voxel",
            "blocos",
            "cubos",
            "3d",
            "minecraft",
            "game"
          ]
        },
        {
          "concept": "Iluminação quente âmbar e brilho metálico",
          "weight": 0.35,
          "synonyms": [
            "dourado",
            "ambar",
            "quente",
            "brilhante",
            "iluminado"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Oficina de ferreiro com bancada e suporte",
          "weight": 0.55,
          "synonyms": [
            "oficina",
            "ferraria",
            "bancada",
            "madeira",
            "pedra"
          ]
        },
        {
          "concept": "Lanternas quentes iluminando o ambiente",
          "weight": 0.45,
          "synonyms": [
            "lanternas",
            "luzes",
            "forja",
            "lampiao"
          ]
        }
      ],
      "botPrompts": [
        "Um pangolim dourado vestindo avental de ferreiro cuidando de um escudo brilhante de cobre e prata em uma oficina iluminada por lanternas, estilo arte voxel 3D",
        "Ilustração 3D em blocos voxel mostrando um pangolim artesão ao lado de um escudo reluzente na bancada da ferraria",
        "Pangolim simpático de avental trabalhando em um escudo metálico numa oficina aconchegante feita de blocos"
      ]
    }
  },
  {
    "id": "axolote-alquimista-cristal",
    "title": "Axolote Mago no Laboratório da Caverna",
    "category": "Fantasia & Animação 3D",
    "difficulty": "Fácil",
    "imageUrl": "/challenges/axolote-alquimista-cristal.webp",
    "fullPrompt": "Um pequeno axolote cor-de-rosa sorridente usando chapéu pontudo de mago lilás preparando poções brilhantes nas cores azul-turquesa, roxo e verde dentro de frascos redondos de vidro sobre a bancada de uma caverna rochosa, estilo animação 3D Pixar",
    "subjectLayer": "Um pequeno axolote cor-de-rosa sorridente de chapéu de mago preparando poções brilhantes em frascos de vidro",
    "styleLayer": "estilo animação 3D Pixar fofa com brilho neon colorido dos líquidos azul, roxo e verde",
    "environmentLayer": "sobre uma bancada de laboratório alquímico dentro de uma caverna de paredes rochosas escuras",
    "hint1": "Dica de Estilo (60s): Animação 3D estilo Pixar iluminada por frascos de poções neon azul, roxo e verde!",
    "hint2": "Dica Principal (30s): Um axolote/salamandra rosa de chapéu de mago misturando poções brilhantes numa caverna!",
    "keywords": {
      "subject": [
        {
          "concept": "Axolote / salamandra rosa fofo com chapéu de mago",
          "weight": 0.55,
          "synonyms": [
            "axolote",
            "salamandra",
            "lagartinho rosa",
            "anfibio",
            "rosa",
            "mago",
            "bruxo",
            "alquimista",
            "chapeu de mago"
          ]
        },
        {
          "concept": "Misturando poções brilhantes em frascos de vidro",
          "weight": 0.45,
          "synonyms": [
            "pocoes",
            "pocao",
            "frascos",
            "vidros",
            "quimica",
            "alquimia",
            "liquidos brilhantes"
          ]
        }
      ],
      "style": [
        {
          "concept": "Animação 3D estilo Pixar fofa",
          "weight": 0.65,
          "synonyms": [
            "3d",
            "pixar",
            "animacao",
            "disney",
            "render 3d",
            "cartoon 3d",
            "fofo"
          ]
        },
        {
          "concept": "Brilho fluorescente turquesa, roxo e verde",
          "weight": 0.35,
          "synonyms": [
            "turquesa",
            "azul",
            "roxo",
            "verde",
            "neon",
            "brilhante",
            "luminoso"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Bancada de laboratório de alquimia",
          "weight": 0.5,
          "synonyms": [
            "bancada",
            "mesa",
            "laboratorio",
            "experimento"
          ]
        },
        {
          "concept": "Interior de caverna rochosa mística",
          "weight": 0.5,
          "synonyms": [
            "caverna",
            "gruta",
            "pedras",
            "rochas"
          ]
        }
      ],
      "botPrompts": [
        "Um axolote cor-de-rosa fofo usando chapéu de mago diante de frascos de vidro com poções brilhantes azuis, roxas e verdes dentro de uma caverna, animação 3D Pixar",
        "Render 3D divertido de uma pequena salamandra rosa alquimista preparando líquidos luminosos na bancada da gruta",
        "Axolote mago sorridente com chapéu pontudo lilás cercado por potes de poção mágica colorida"
      ]
    }
  },
  {
    "id": "narval-faroleiro-artico",
    "title": "Narval e o Farol sob a Aurora em Papel Recortado",
    "category": "Ártico & Papel Recortado",
    "difficulty": "Médio",
    "imageUrl": "/challenges/narval-faroleiro-artico.webp",
    "fullPrompt": "Um narval azul-claro simpático com chifre espiral dourado listrado nadando ao lado de um pequeno farol flutuante branco e vermelho nas ondas do oceano Ártico sob luzes de aurora boreal verde e rosa, estilo arte em papel recortado em camadas",
    "subjectLayer": "Um narval azul-claro simpático com chifre espiral dourado nadando ao lado de um farol flutuante",
    "styleLayer": "estilo arte em papel recortado em camadas (papercut diorama) com ondas azuis e aurora verde e magenta",
    "environmentLayer": "nas ondas em camadas do mar Ártico sob um céu noturno iluminado pela aurora boreal",
    "hint1": "Dica de Estilo (60s): Diorama de papel recortado em camadas com ondas azuis e aurora boreal verde e rosa!",
    "hint2": "Dica Principal (30s): Um narval com chifre dourado nadando ao lado de um farol flutuante sob a aurora boreal!",
    "keywords": {
      "subject": [
        {
          "concept": "Narval azul-claro com chifre espiral dourado",
          "weight": 0.6,
          "synonyms": [
            "narval",
            "baleia",
            "golfinho",
            "chifre",
            "chifre dourado",
            "unicornio do mar",
            "azul"
          ]
        },
        {
          "concept": "Nadando ao lado de um farol flutuante",
          "weight": 0.4,
          "synonyms": [
            "farol",
            "boia",
            "farol flutuante",
            "barco-farol",
            "nadando",
            "luz"
          ]
        }
      ],
      "style": [
        {
          "concept": "Arte em papel recortado em camadas (papercut)",
          "weight": 0.65,
          "synonyms": [
            "papel recortado",
            "camadas",
            "papercut",
            "diorama",
            "colagem de papel",
            "artesanal"
          ]
        },
        {
          "concept": "Contraste ondas azuis e aurora verde e rosa",
          "weight": 0.35,
          "synonyms": [
            "verde",
            "rosa",
            "roxo",
            "azul",
            "luminoso",
            "vibrante"
          ]
        }
      ],
      "environment": [
        {
          "concept": "Ondas do oceano Ártico em camadas",
          "weight": 0.5,
          "synonyms": [
            "mar",
            "oceano",
            "ondas",
            "agua",
            "artico"
          ]
        },
        {
          "concept": "Céu com luzes da aurora boreal",
          "weight": 0.5,
          "synonyms": [
            "aurora boreal",
            "aurora",
            "ceu",
            "luzes no ceu",
            "noite"
          ]
        }
      ],
      "botPrompts": [
        "Um narval azul com chifre dourado nadando ao lado de um farol flutuante nas ondas do mar sob a aurora boreal verde e rosa, estilo papel recortado em camadas",
        "Ilustração em diorama de papel recortado mostrando uma baleia narval sorridente perto de um pequeno farol no oceano iluminado pela aurora",
        "Narval fofo de chifre listrado entre ondas de papel azuis e um farol sob o céu colorido polar"
      ]
    }
  },
];
