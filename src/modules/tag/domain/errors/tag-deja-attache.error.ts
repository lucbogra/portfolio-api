export class TagDejaAttacheError extends Error {
    constructor(tagId: string, taggableId: string) {
      super(`Le tag "${tagId}" est déjà attaché à "${taggableId}"`);
      this.name = 'TagDejaAttacheError';
    }
  }