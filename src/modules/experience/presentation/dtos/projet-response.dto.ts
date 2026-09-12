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
    resume: string | null;
    lienDemo: string | null;
    enAvant!: boolean;
    ordreAffichage!: number | null;

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
        dto.resume = projet.resume;
        dto.github = projet.github?.toString() ?? null;
        dto.lienDemo = projet.lienDemo?.toString() ?? null;
        dto.enAvant = projet.enAvant;
        dto.ordreAffichage = projet.ordreAffichage;

        return dto;
    }
}