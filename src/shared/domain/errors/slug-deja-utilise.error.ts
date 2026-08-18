export class SlugDejaUtiliseError extends Error {
    constructor(slug: string) {
      super(`Le slug "${slug}" est déjà utilisé`);
      this.name = 'SlugDejaUtiliseError';
    }
  }