export class ProjetIntrouvableError extends Error {
    constructor(identifiant: string) {
        super(`Projet introuvable : "${identifiant}"`);
        this.name = 'ProjetIntrouvableError';
      }
}