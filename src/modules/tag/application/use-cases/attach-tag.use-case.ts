import { Inject, Injectable } from '@nestjs/common';

import { TagIntrouvableError } from '../../domain/errors/tag-introuvable.error.js';
import { TaggableTypeEnum } from '../../domain/value-object/taggable-type.value-object.js';
import { TAG_REPOSITORY, type TagRepository } from '../../domain/repository/tag.repository.js';
import { TAGGING_REPOSITORY, type TaggingRepository } from '../../domain/repository/tagging.repository.js';
import { TagId } from '../../domain/value-object/tag-id.value-object.js';

export interface AttachTagInput {
  tagId: string;
  taggableType: TaggableTypeEnum;
  taggableId: string;
}

@Injectable()
export class AttachTagUseCase {
  constructor(
    @Inject(TAG_REPOSITORY) private readonly tagRepository: TagRepository,
    @Inject(TAGGING_REPOSITORY) private readonly taggingRepository: TaggingRepository,
  ) {}

  async execute(input: AttachTagInput): Promise<void> {
    const tagId = TagId.create(input.tagId);
    const tag = await this.tagRepository.findById(tagId);

    if (!tag) {
      throw new TagIntrouvableError(input.tagId);
    }

    await this.taggingRepository.attach(tagId, input.taggableType, input.taggableId);
  }
}