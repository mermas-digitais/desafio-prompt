import crypto from 'node:crypto';
import { OFFICIAL_CHALLENGES, type ChallengeSeedData } from '../db/challengesData.js';

export class ChallengeDeck {
  private cards: ChallengeSeedData[] = [];
  private recent: string[] = [];
  next(activeIds: Set<string>): ChallengeSeedData {
    if (!this.cards.length) {
      this.cards = [...OFFICIAL_CHALLENGES];
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = crypto.randomInt(i + 1);
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
    let index = this.cards.findIndex((card) => !activeIds.has(card.id) && !this.recent.includes(card.id));
    if (index < 0) index = this.cards.findIndex((card) => !activeIds.has(card.id));
    if (index < 0) throw new Error('Aguarde o fim da outra rodada para sortear uma imagem.');
    const [card] = this.cards.splice(index, 1);
    this.recent = [...this.recent, card.id].slice(-10);
    return card;
  }
}
