export class ExperienceIntrouvableError extends Error {
    constructor(identifiant: string) {
      super(`Expérience introuvable : "${identifiant}"`);
      this.name = 'ExperienceIntrouvableError';
    }
  }