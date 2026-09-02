export class NomDejaUtiliseError extends Error {
    constructor(nom: string) {
        super('Nom déjà utilisé: '+nom);
        this.name = 'NomDejaUtiliseError';
    }
}