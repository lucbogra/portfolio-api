export class AttachementIntrouvableError extends Error {
    constructor(tagId: string, taggableId: string) {
      super(`Aucun lien entre le tag "${tagId}" et l'entité "${taggableId}"`);
      this.name = 'AttachementIntrouvableError';
    }
  }