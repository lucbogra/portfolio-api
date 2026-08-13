import { Experience } from 'src/modules/experience/domain/entities/experience.entity.js';
import {
  Contexte,
  ContexteType,
} from 'src/modules/experience/domain/value-objects/contexte.value-object.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';
import { Periode } from 'src/shared/domain/value-objects/periode/periode.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import {
  Experience as PrismaExperience,
  Contexte as PrismaContexte,
} from 'src/generated/prisma/client.js';

const PRISMA_TO_DOMAIN_CONTEXTE: Record<PrismaContexte, ContexteType> = {
  [PrismaContexte.FREELANCE]: ContexteType.FREELANCE,
  [PrismaContexte.CDI]: ContexteType.CDI,
  [PrismaContexte.CONSULTANT]: ContexteType.CONSULTANT,
  [PrismaContexte.CDD]: ContexteType.CDD,
};

const DOMAIN_TO_PRISMA_CONTEXTE: Record<ContexteType, PrismaContexte> = {
  [ContexteType.FREELANCE]: PrismaContexte.FREELANCE,
  [ContexteType.CDI]: PrismaContexte.CDI,
  [ContexteType.CONSULTANT]: PrismaContexte.CONSULTANT,
  [ContexteType.CDD]: PrismaContexte.CDD,
};

export class ExperienceMapper {
  static toDomain(raw: PrismaExperience): Experience {
    return Experience.create({
      id: ExperienceId.create(raw.id),
      slug: Slug.create(raw.slug),
      periode: Periode.create(raw.dateDebut, raw.dateFin),
      titre: raw.titre,
      entreprise: raw.entreprise,
      contexte: Contexte.create(PRISMA_TO_DOMAIN_CONTEXTE[raw.contexte]),
      description: raw.description,
      lienDemo: raw.lienDemo ? Lien.create(raw.lienDemo) : null,
    });
  }

  static toPersistence(experience: Experience): PrismaExperience {
    return {
      id: experience.id.toString(),
      slug: experience.slug.toString(),
      dateDebut: experience.periode.dateDebut,
      dateFin: experience.periode.dateFin,
      titre: experience.titre,
      entreprise: experience.entreprise,
      contexte: DOMAIN_TO_PRISMA_CONTEXTE[experience.contexte.value],
      description: experience.description,
      lienDemo: experience.lienDemo?.toString() ?? null,
    };
  }
}
