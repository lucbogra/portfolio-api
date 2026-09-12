import { ProjetListItem } from "../../domain/repositories/projet-read.repository.js";

export class ProjetAvecExperienceResponseDto {
    id!: string;
    slug!: string;
    nom!: string;
    image!: string | null;
    dateDebut!: Date;
    dateFin!: Date | null;
    github!: string | null;
    details!: string;
    resume!: string | null;
    lienDemo!: string | null;
    enAvant!: boolean;
    ordreAffichage!: number | null;
    experience!: { id: string; titre: string } | null;
    tags!: { id: string; nom: string; type: string }[];

    static fromReadModel(item: ProjetListItem): ProjetAvecExperienceResponseDto {
        const dto = new ProjetAvecExperienceResponseDto();
        dto.id = item.id;
        dto.slug = item.slug;
        dto.nom = item.nom;
        dto.image = item.image;
        dto.dateDebut = item.dateDebut;
        dto.dateFin = item.dateFin;
        dto.github = item.github;
        dto.details = item.details;
        dto.resume = item.resume;
        dto.lienDemo = item.lienDemo;
        dto.enAvant = item.enAvant;
        dto.ordreAffichage = item.ordreAffichage;
        dto.experience = item.experience;
        dto.tags = item.tags;

        return dto;
    }
}
