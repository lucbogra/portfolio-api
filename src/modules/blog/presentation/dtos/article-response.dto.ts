import { Article } from "../../domain/entities/article.entity.js";
import { StatutArticleType } from "../../domain/value-objects/statut-article.value-object.js";

export class ArticleResponseDto {
    id!: string;
    slug!: string;
    categorieId!: string;
    nom!: string;
    contenu!: string;
    image?: string | null;
    datePublication?: Date | null;
    statut!: StatutArticleType;

    static fromDomain(article: Article): ArticleResponseDto {
        const dto = new ArticleResponseDto();
        dto.id = article.id.toString();
        dto.slug = article.slug.toString();
        dto.categorieId = article.categorieId.toString();
        dto.nom = article.nom;
        dto.contenu = article.contenu;
        dto.image = article.image;
        dto.datePublication = article.datePublication;
        dto.statut = article.statut.value;

        return dto;
    }
}