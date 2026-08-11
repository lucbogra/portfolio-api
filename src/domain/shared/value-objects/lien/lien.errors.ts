export class InvalidLienError extends Error {
    constructor(url: string) {
        super(`URL invalide : "${url}"`);
        this.name = 'InvalidLienError';
      }
}