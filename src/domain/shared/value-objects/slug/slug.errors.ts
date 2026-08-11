export class InvalidSlugError extends Error {
    constructor(raw: string) {
      super(`Slug invalide : "${raw}"`);
      this.name = 'InvalidSlugError';
    }
  }