import { Experience } from "../../domain/entities/experience.entity.js";
import { ContexteType } from "../../domain/value-objects/contexte.value-object.js";

export class ExperienceResponseDto {
    id!: string;
    slug!: string;
    titre!: string;
    entreprise!: string;
    contexte!: ContexteType;
    description!: string;
    dateDebut!: Date;
    dateFin!: Date | null;
    lienDemo!: string | null;

    static fromDomain(experience: Experience): ExperienceResponseDto {
        const dto = new ExperienceResponseDto();
        dto.id = experience.id.toString();
        dto.slug = experience.slug.toString();
        dto.titre = experience.titre;
        dto.entreprise = experience.entreprise;
        dto.contexte = experience.contexte.value;
        dto.description = experience.description;
        dto.dateDebut = experience.periode.dateDebut;
        dto.dateFin = experience.periode.dateFin;
        dto.lienDemo = experience.lienDemo?.toString() ?? null;

        return dto;
    }
}