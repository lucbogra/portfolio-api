import { Profil } from "../../domain/entities/profil.entity.js";

export class ProfilResponseDto {
    titre!: string;
    description!: string;
    telephone!: string;
    github!: string | null;
    linkedin!: string | null;
    pays!: string;
    ville!: string;
    adresse!: string | null;

    static fromDomain(profil: Profil): ProfilResponseDto {
        const dto = new ProfilResponseDto();
        dto.titre = profil.titre;
        dto.description = profil.description;
        dto.telephone = profil.telephone.toString();
        dto.github = profil.github?.toString() ?? null;
        dto.linkedin = profil.linkedin?.toString() ?? null;
        dto.pays = profil.pays;
        dto.ville = profil.ville;
        dto.adresse = profil.adresse;

        return dto;
    }
}