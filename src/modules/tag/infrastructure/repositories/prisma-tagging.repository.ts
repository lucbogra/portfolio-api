import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import { TaggableType as PrismaTaggableType } from 'src/generated/prisma/enums.js';
import { TagDejaAttacheError } from '../../domain/errors/tag-deja-attache.error.js';
import { AttachementIntrouvableError } from '../../domain/errors/attachement-introuvable.error.js';
import { PrismaError } from 'src/shared/infrastructure/prisma-error-interface.js';
import { TaggableTypeEnum } from '../../domain/value-object/taggable-type.value-object.js';
import { TaggingRepository } from '../../domain/repository/tagging.repository.js';
import { TagId } from '../../domain/value-object/tag-id.value-object.js';
import { TagIntrouvableError } from '../../domain/errors/tag-introuvable.error.js';
import { TagMapper } from '../mappers/tag.mappers.js';
import { Tag } from '../../domain/entity/tag.entity.js';

const DOMAIN_TO_PRISMA_TAGGABLE_TYPE: Record<TaggableTypeEnum, PrismaTaggableType> = {
  [TaggableTypeEnum.EXPERIENCE]: PrismaTaggableType.EXPERIENCE,
  [TaggableTypeEnum.PROJET]: PrismaTaggableType.PROJET,
  [TaggableTypeEnum.ARTICLE]: PrismaTaggableType.ARTICLE,
};

@Injectable()
export class PrismaTaggingRepository implements TaggingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async attach(tagId: TagId, taggableType: TaggableTypeEnum, taggableId: string): Promise<void> {
    try {
      await this.prisma.taggable.create({
        data: {
          id: randomUUID(),
          tagId: tagId.toString(),
          taggableType: DOMAIN_TO_PRISMA_TAGGABLE_TYPE[taggableType],
          taggableId,
        },
      });
    } catch (error) {
      const err = error as PrismaError;

      if (err.code === 'P2002') {
        throw new TagDejaAttacheError(tagId.toString(), taggableId);
      }
      if (err.code === 'P2003') {
        throw new TagIntrouvableError(tagId.toString());
      }
      throw error;
    }
  }

  async detach(tagId: TagId, taggableType: TaggableTypeEnum, taggableId: string): Promise<void> {
    const existing = await this.prisma.taggable.findUnique({
      where: {
        tagId_taggableType_taggableId: {
          tagId: tagId.toString(),
          taggableType: DOMAIN_TO_PRISMA_TAGGABLE_TYPE[taggableType],
          taggableId,
        },
      },
    });

    if (!existing) {
      throw new AttachementIntrouvableError(tagId.toString(), taggableId);
    }

    await this.prisma.taggable.delete({ where: { id: existing.id } });
  }

  async findTagsFor(taggableType: TaggableTypeEnum, taggableId: string): Promise<Tag[]> {
    const rows = await this.prisma.taggable.findMany({
      where: {
        taggableType: DOMAIN_TO_PRISMA_TAGGABLE_TYPE[taggableType],
        taggableId,
      },
      include: { tag: true },
    });

    return rows.map((row) => TagMapper.toDomain(row.tag));
  }
}