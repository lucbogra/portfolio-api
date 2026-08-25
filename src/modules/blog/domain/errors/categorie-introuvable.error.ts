export class CategorieIntrouvableError extends Error {
    constructor(identifiant: string) {
      super(`Catégorie introuvable : "${identifiant}"`);
      this.name = 'CategorieIntrouvableError';
    }
  }