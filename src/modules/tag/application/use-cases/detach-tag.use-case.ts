import { Inject, Injectable } from '@nestjs/common';
import { TaggableTypeEnum } from '../../domain/value-object/taggable-type.value-object.js';
import { TAGGING_REPOSITORY, type TaggingRepository } from '../../domain/repository/tagging.repository.js';
import { TagId } from '../../domain/value-object/tag-id.value-object.js';


export interface DetachTagInput {
  tagId: string;
  taggableType: TaggableTypeEnum;
  taggableId: string;
}

@Injectable()
export class DetachTagUseCase {
  constructor(
    @Inject(TAGGING_REPOSITORY) private readonly taggingRepository: TaggingRepository,
  ) {}

  async execute(input: DetachTagInput): Promise<void> {
    await this.taggingRepository.detach(
      TagId.create(input.tagId),
      input.taggableType,
      input.taggableId,
    );
  }
}