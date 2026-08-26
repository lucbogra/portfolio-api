export class ProfilIntrouvableError extends Error {
    constructor() {
      super('Le profil n\'a pas encore été configuré');
      this.name = 'ProfilIntrouvableError';
    }
  }