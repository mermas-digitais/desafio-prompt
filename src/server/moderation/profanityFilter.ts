export interface NicknameValidationResult {
  valid: boolean;
  sanitized: string;
  reason?: string;
  suggestions?: string[];
}

const FUN_SUGGESTIONS = [
  'Mermã Cyber',
  'Ada Lovelace',
  'Estrela STEAM',
  'Dev Imperatriz',
  'Robô Bumba',
  'Pixel Mermã',
  'Cientista IA',
  'Astro Menina',
];

const BLOCKED_TERMS_PT_EN = [
  // PT-BR
  'porra',
  'caralho',
  'krl',
  'cacete',
  'merda',
  'bosta',
  'puta',
  'puto',
  'putaria',
  'piranha',
  'vagabunda',
  'vagabundo',
  'vadia',
  'arrombado',
  'arrombada',
  'buceta',
  'boceta',
  'bct',
  'xoxota',
  'xota',
  'piroca',
  'pica',
  'rola',
  'pinto',
  'caceta',
  'cuzao',
  'cuzinho',
  'foda',
  'foder',
  'fodase',
  'fuder',
  'fudido',
  'fudida',
  'fdp',
  'filhodaputa',
  'filhadaputa',
  'vsf',
  'vtnc',
  'pnc',
  'corno',
  'corna',
  'viado',
  'viadinho',
  'bicha',
  'boiola',
  'sapatao',
  'traveco',
  'retardado',
  'retardada',
  'mongoloide',
  'imbecil',
  'idiota',
  'otario',
  'otaria',
  'babaca',
  'escroto',
  'escrota',
  'punheta',
  'siririca',
  'boquete',
  'chuparola',
  'gozar',
  'gozada',
  'estupro',
  'estuprador',
  'pedofilo',
  'pedofilia',
  'nazista',
  'hitler',
  'macaco',
  'crioulo',
  'racista',
  // EN
  'fuck',
  'fucker',
  'fucking',
  'motherfucker',
  'shit',
  'bullshit',
  'bitch',
  'slut',
  'whore',
  'cunt',
  'dick',
  'cock',
  'pussy',
  'asshole',
  'bastard',
  'faggot',
  'fag',
  'nigger',
  'nigga',
  'retard',
  'rape',
  'rapist',
  'nazi',
  'penis',
  'vagina',
  'boobs',
  'tits',
  'porn',
  'sex',
];

function normalizeForModeration(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/(.)\1+/g, '$1'); // reduz letras repetidas: fuuuuck -> fuk / porrrra -> pora
}

function normalizeKeepDoubleLetters(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/(.)\1{2,}/g, '$1$1');
}

function pickSuggestions(count = 4): string[] {
  const shuffled = [...FUN_SUGGESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function validateNickname(rawNickname: string): NicknameValidationResult {
  const sanitized = (rawNickname || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (sanitized.length < 2) {
    return {
      valid: false,
      sanitized,
      reason: 'Escolha um apelido com pelo menos 2 caracteres!',
      suggestions: pickSuggestions(),
    };
  }

  if (sanitized.length > 26) {
    return {
      valid: false,
      sanitized: sanitized.slice(0, 26),
      reason: 'O apelido pode ter no máximo 26 caracteres.',
      suggestions: pickSuggestions(),
    };
  }

  const collapsedSingle = normalizeForModeration(sanitized).replace(/\s+/g, '');
  const collapsedDouble = normalizeKeepDoubleLetters(sanitized).replace(/\s+/g, '');
  const wordsSingle = normalizeForModeration(sanitized).split(/\s+/).filter(Boolean);

  for (const term of BLOCKED_TERMS_PT_EN) {
    const termSingle = term.replace(/(.)\1+/g, '$1');

    if (term.length <= 3) {
      // Siglas curtas como fdp, vsf, bct, krl só bloqueiam se forem palavra isolada
      if (wordsSingle.includes(termSingle) || wordsSingle.includes(term)) {
        return {
          valid: false,
          sanitized,
          reason: 'Esse apelido não é permitido no espaço MDX STEAM. Que tal um nome criativo?',
          suggestions: pickSuggestions(),
        };
      }
      continue;
    }

    if (
      collapsedSingle.includes(termSingle) ||
      collapsedDouble.includes(term) ||
      wordsSingle.includes(termSingle)
    ) {
      return {
        valid: false,
        sanitized,
        reason: 'Esse apelido contém termos bloqueados pelo filtro educativo do evento. Escolha outro!',
        suggestions: pickSuggestions(),
      };
    }
  }

  // Verifica também palavra isolada "cu"
  const rawWords = sanitized
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  if (rawWords.includes('cu') || rawWords.includes('anus')) {
    return {
      valid: false,
      sanitized,
      reason: 'Esse apelido não é permitido no espaço MDX STEAM. Escolha outro nome!',
      suggestions: pickSuggestions(),
    };
  }

  return {
    valid: true,
    sanitized,
  };
}
