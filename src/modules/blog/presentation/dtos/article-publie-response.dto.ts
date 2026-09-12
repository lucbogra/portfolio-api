import { ArticlePublieListItem } from "../../domain/repositories/article-read.repository.js";

export class ArticlePublieResponseDto {
    id!: string;
    slug!: string;
    nom!: string;
    image!: string | null;
    contenu!: string;
    datePublication!: Date | null;
    categorie!: { id: string; slug: string; nom: string };
    tags!: { id: string; nom: string; type: string }[];

    static fromReadModel(item: ArticlePublieListItem): ArticlePublieResponseDto {
        const dto = new ArticlePublieResponseDto();
        dto.id = item.id;
        dto.slug = item.slug;
        dto.nom = item.nom;
        dto.image = item.image;
        dto.contenu = item.contenu;
        dto.datePublication = item.datePublication;
        dto.categorie = item.categorie;
        dto.tags = item.tags;

        return dto;
    }
}
