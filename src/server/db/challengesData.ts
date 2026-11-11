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
    imageUrl: '/challenges/boto_cor_de_rosa_synthwave.svg',
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
    imageUrl: '/challenges/panda_quimico_bambu.svg',
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
    imageUrl: '/challenges/canguru_boxeador_arcade.svg',
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
    imageUrl: '/challenges/fenix_cristal_vulcao.svg',
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
    imageUrl: '/challenges/dragao_biblioteca_cha.svg',
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
];
