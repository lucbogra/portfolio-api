import { ExperienceListItem } from "../../domain/repositories/experience-read.repository.js";

export class ExperienceAvecTagsResponseDto {
    id!: string;
    slug!: string;
    titre!: string;
    entreprise!: string;
    contexte!: string;
    description!: string;
    dateDebut!: Date;
    dateFin!: Date | null;
    lienDemo!: string | null;
    tags!: { id: string; nom: string; type: string }[];

    static fromReadModel(item: ExperienceListItem): ExperienceAvecTagsResponseDto {
        const dto = new ExperienceAvecTagsResponseDto();
        dto.id = item.id;
        dto.slug = item.slug;
        dto.titre = item.titre;
        dto.entreprise = item.entreprise;
        dto.contexte = item.contexte;
        dto.description = item.description;
        dto.dateDebut = item.dateDebut;
        dto.dateFin = item.dateFin;
        dto.lienDemo = item.lienDemo;
        dto.tags = item.tags;

        return dto;
    }
}
