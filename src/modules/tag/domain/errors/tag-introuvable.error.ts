export class TagIntrouvableError extends Error {
    constructor(identifiant: string) {
        super('Tag non trouvé: '+identifiant);
        this.name = 'TagIntrouvableError';
    }
}