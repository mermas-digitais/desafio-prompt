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
];
