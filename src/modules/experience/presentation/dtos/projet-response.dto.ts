import { Projet } from "../../domain/entities/projet.entity.js";

export class ProjetResponse {
    id!: string;
    experienceId!: string | null;
    slug!: string;
    nom!: string;
    image!: string | null;
    dateDebut!: Date;
    dateFin!: Date|null;
    github!: string | null;
    details: string;
    lienDemo: string | null;

    static fromDomain(projet: Projet): ProjetResponse {
        const dto = new ProjetResponse();
        dto.id = projet.id.toString();
        dto.experienceId = projet.experienceId?.toString() ?? null;
        dto.slug = projet.slug.toString();
        dto.nom = projet.nom;
        dto.image = projet.image;
        dto.dateDebut = projet.periode.dateDebut;
        dto.dateFin = projet.periode.dateFin ?? null;
        dto.details = projet.details;
        dto.github = projet.github?.toString() ?? null;
        dto.lienDemo = projet.lienDemo?.toString() ?? null;

        return dto;
    }
}