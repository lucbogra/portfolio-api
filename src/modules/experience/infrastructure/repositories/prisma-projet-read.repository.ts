import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client.js';
import { TaggableType as PrismaTaggableType } from 'src/generated/prisma/enums.js';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import {
  ProjetReadRepository,
  ProjetListItem,
} from 'src/modules/experience/domain/repositories/projet-read.repository.js';
import { TagMapper } from 'src/modules/tag/infrastructure/mappers/tag.mappers.js';

const projetWithExperienceInclude = {
  experience: { select: { id: true, titre: true } },
} satisfies Prisma.ProjetInclude;

type ProjetWithExperience = Prisma.ProjetGetPayload<{
  include: typeof projetWithExperienceInclude;
}>;

type ProjetTag = { id: string; nom: string; type: string };

@Injectable()
export class PrismaProjetReadRepository implements ProjetReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAllWithExperienceAndTags(): Promise<ProjetListItem[]> {
    const rows: ProjetWithExperience[] = await this.prisma.projet.findMany({
      orderBy: { dateDebut: 'desc' },
      include: projetWithExperienceInclude,
    });

    return this.withTags(rows);
  }

  async listSelectionWithExperienceAndTags(): Promise<ProjetListItem[]> {
    const rows: ProjetWithExperience[] = await this.prisma.projet.findMany({
      where: { enAvant: true },
      orderBy: [
        { ordreAffichage: { sort: 'asc', nulls: 'last' } },
        { dateDebut: 'desc' },
      ],
      include: projetWithExperienceInclude,
    });

    return this.withTags(rows);
  }

  async listAutonomesAvecTags(): Promise<ProjetListItem[]> {
    const rows: ProjetWithExperience[] = await this.prisma.projet.findMany({
      where: { experienceId: null },
      orderBy: { dateDebut: 'desc' },
      include: projetWithExperienceInclude,
    });

    return this.withTags(rows);
  }

  private async withTags(rows: ProjetWithExperience[]): Promise<ProjetListItem[]> {
    const projetIds = rows.map((row) => row.id);

    const taggables = await this.prisma.taggable.findMany({
      where: {
        taggableType: PrismaTaggableType.PROJET,
        taggableId: { in: projetIds },
      },
      include: { tag: true },
    });

    const tagsByProjetId = new Map<string, ProjetTag[]>();
    for (const taggable of taggables) {
      const tag = TagMapper.toDomain(taggable.tag);
      const tags = tagsByProjetId.get(taggable.taggableId) ?? [];
      tags.push({ id: tag.id.toString(), nom: tag.nom, type: tag.type.value });
      tagsByProjetId.set(taggable.taggableId, tags);
    }

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      nom: row.nom,
      image: row.image,
      dateDebut: row.dateDebut,
      dateFin: row.dateFin,
      github: row.github,
      details: row.details,
      resume: row.resume,
      lienDemo: row.lienDemo,
      enAvant: row.enAvant,
      ordreAffichage: row.ordreAffichage,
      experience: row.experience
        ? { id: row.experience.id, titre: row.experience.titre }
        : null,
      tags: tagsByProjetId.get(row.id) ?? [],
    }));
  }
}
