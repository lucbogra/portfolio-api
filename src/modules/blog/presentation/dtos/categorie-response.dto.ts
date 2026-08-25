import { Categorie } from "../../domain/entities/categorie.entity.js";

export class CategorieResourceDto {
    id!: string;
    slug!: string;
    nom!: string;

    static fromDomain(categorie: Categorie): CategorieResourceDto {
        const dto = new CategorieResourceDto();
        dto.id = categorie.id.toString();
        dto.slug = categorie.slug.toString();
        dto.nom = categorie.nom;

        return dto;
    }
}