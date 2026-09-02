export class TagEnUsageError extends Error {
    constructor(id: string) {
      super(`Impossible de supprimer le tag "${id}" : il est encore attaché à des éléments`);
      this.name = 'TagEnUsageError';
    }
  }
