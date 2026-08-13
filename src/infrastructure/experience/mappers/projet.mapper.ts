import { Projet } from "src/domain/experience/entities/projet.entity.js";
import { ExperienceId } from "src/domain/experience/value-objects/experience-id.value-object.js";
import { ProjetId } from "src/domain/experience/value-objects/projet-id.value-object.js";
import { Lien } from "src/domain/shared/value-objects/lien/lien.value-object.js";
import { Periode } from "src/domain/shared/value-objects/periode/periode.value-object.js";
import { Slug } from "src/domain/shared/value-objects/slug/slug.value-object.js";
import { Projet as PrismaProjet } from "src/generated/prisma/client.js";

export class ProjetMapper {
    static toDomain(raw: PrismaProjet) : Projet {
        return Projet.create({
            id: ProjetId.create(raw.id),
            slug: Slug.create(raw.slug),
            experienceId: raw.experienceId ? ExperienceId.create(raw.experienceId) : null,
            nom: raw.nom,
            image: raw.image,
            details: raw.details,
            periode: Periode.create(raw.dateDebut, raw.dateFin),
            github: raw.github ? Lien.create(raw.github) : null,
            lienDemo: raw.lienDemo ? Lien.create(raw.lienDemo) : null
        })
    }

    static toPersistence(projet: Projet) : PrismaProjet {
        return {
            id: projet.id.toString(),
            slug: projet.slug.toString(),
            experienceId: projet.experienceId?.toString() ?? null,
            nom: projet.nom,
            image: projet.image,
            details: projet.details,
            dateDebut: projet.periode.dateDebut,
            dateFin: projet.periode.dateFin,
            github: projet.github?.toString() ?? null,
            lienDemo: projet.lienDemo?.toString() ?? null
        };
    }
}