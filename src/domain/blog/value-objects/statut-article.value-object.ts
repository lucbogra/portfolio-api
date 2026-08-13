import { TransitionStatutInvalideError } from "../errors/transition-statut-invalide.error.js";

export enum StatutArticleType {
    BROUILLON = 'brouillon',
    PUBLIE = 'publié',
    INACTIF = 'inactif',
}

// Matrice des transitions autorisées : depuis quel statut peut-on aller vers quel statut
const TRANSITIONS_AUTORISES: Record<StatutArticleType, StatutArticleType[]> = {
    [StatutArticleType.BROUILLON]: [StatutArticleType.PUBLIE, StatutArticleType.INACTIF],
    [StatutArticleType.PUBLIE]: [StatutArticleType.INACTIF],
    [StatutArticleType.INACTIF]: [StatutArticleType.PUBLIE]
};

export class StatutArticle {
    private constructor(private readonly type : StatutArticleType) {}

    static create(type: StatutArticleType): StatutArticle {
        if(!Object.values(StatutArticleType).includes(type)) {
            throw new Error(`Statut invalide : "${type}"`);
        }
        return new StatutArticle(type);
    }

    static brouillon(): StatutArticle {
        return new StatutArticle(StatutArticleType.BROUILLON);
    }

    get value(): StatutArticleType {
        return this.type;
    }

    peutTransitionnerVers(cible: StatutArticleType) : boolean {
        return TRANSITIONS_AUTORISES[this.type].includes(cible);
    }

    transitionnerVers(cible: StatutArticleType) : StatutArticle {
        if(!this.peutTransitionnerVers(cible)) {
            throw new TransitionStatutInvalideError(this.type, cible);
        }

        return new StatutArticle(cible);
    }

    equals(other: StatutArticle): boolean {
        return this.type === other.type;
    }
}