export class NomDejaUtilise extends Error {
    constructor(nom: string) {
        super('Nom déjà utilisé: '+nom);
        this.name = 'NomDejaUtilise';
    }
}