import { Injectable } from '@nestjs/common';
import { TaggableType as PrismaTaggableType } from 'src/generated/prisma/enums.js';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import {
  ExperienceReadRepository,
  ExperienceListItem,
} from 'src/modules/experience/domain/repositories/experience-read.repository.js';
import { TagMapper } from 'src/modules/tag/infrastructure/mappers/tag.mappers.js';

type ExperienceTag = { id: string; nom: string; type: string };

@Injectable()
export class PrismaExperienceReadRepository implements ExperienceReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listAllWithTags(): Promise<ExperienceListItem[]> {
    const rows = await this.prisma.experience.findMany({
      orderBy: { dateDebut: 'desc' },
    });

    const experienceIds = rows.map((row) => row.id);

    const taggables = await this.prisma.taggable.findMany({
      where: {
        taggableType: PrismaTaggableType.EXPERIENCE,
        taggableId: { in: experienceIds },
      },
      include: { tag: true },
    });

    const tagsByExperienceId = new Map<string, ExperienceTag[]>();
    for (const taggable of taggables) {
      const tag = TagMapper.toDomain(taggable.tag);
      const tags = tagsByExperienceId.get(taggable.taggableId) ?? [];
      tags.push({ id: tag.id.toString(), nom: tag.nom, type: tag.type.value });
      tagsByExperienceId.set(taggable.taggableId, tags);
    }

    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      titre: row.titre,
      entreprise: row.entreprise,
      contexte: row.contexte.toLowerCase(),
      description: row.description,
      dateDebut: row.dateDebut,
      dateFin: row.dateFin,
      lienDemo: row.lienDemo,
      tags: tagsByExperienceId.get(row.id) ?? [],
    }));
  }
}
