export class TagNonTrouve extends Error {
    constructor(identifiant: string) {
        super('Tag non trouvé: '+identifiant);
        this.name = 'TagNonTrouve';
    }
}