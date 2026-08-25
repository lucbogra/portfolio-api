export class ArticleIntrouvableError extends Error {
    constructor(identifiant: string) {
        super(`Article introuvable : "${identifiant}"`);
        this.name = "ArticleIntrouvableError";
    }
}