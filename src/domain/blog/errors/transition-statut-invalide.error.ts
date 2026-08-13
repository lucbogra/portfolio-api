import { StatutArticleType } from '../value-objects/statut-article.value-object.js';

export class TransitionStatutInvalideError extends Error {
  constructor(depuis: StatutArticleType, vers: StatutArticleType) {
    super(`Transition de statut invalide : "${depuis}" → "${vers}"`);
    this.name = 'TransitionStatutInvalideError';
  }
}