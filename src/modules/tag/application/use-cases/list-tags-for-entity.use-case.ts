import { Inject, Injectable } from '@nestjs/common';
import { TAGGING_REPOSITORY, type TaggingRepository } from '../../domain/repository/tagging.repository.js';
import { Tag } from '../../domain/entity/tag.entity.js';
import { TaggableTypeEnum } from '../../domain/value-object/taggable-type.value-object.js';


@Injectable()
export class ListTagsForEntityUseCase {
  constructor(
    @Inject(TAGGING_REPOSITORY) private readonly taggingRepository: TaggingRepository,
  ) {}

  async execute(taggableType: TaggableTypeEnum, taggableId: string): Promise<Tag[]> {
    return this.taggingRepository.findTagsFor(taggableType, taggableId);
  }
}