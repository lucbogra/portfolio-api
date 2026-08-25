export class CategorieUtiliseeError extends Error {
    constructor(id: string) {
      super(`Impossible de supprimer la catégorie "${id}" : elle est encore utilisée par des articles`);
      this.name = 'CategorieUtiliseeError';
    }
  }