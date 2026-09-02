import { Module } from '@nestjs/common';

import { PrismaTagRepository } from './infrastructure/repositories/prisma-tag.repository.js';
import { PrismaTaggingRepository } from './infrastructure/repositories/prisma-tagging.repository.js';
import { CreateTagUseCase } from './application/use-cases/create-tag.use-case.js';
import { UpdateTagUseCase } from './application/use-cases/update-tag.use-case.js';
import { ListTagsUseCase } from './application/use-cases/list-tags.use-case.js';
import { GetTagByIdUseCase } from './application/use-cases/get-tag-by-id.use-case.js';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.use-case.js';
import { AttachTagUseCase } from './application/use-cases/attach-tag.use-case.js';
import { DetachTagUseCase } from './application/use-cases/detach-tag.use-case.js';
import { ListTagsForEntityUseCase } from './application/use-cases/list-tags-for-entity.use-case.js';
import { TagController } from './presentation/controllers/tag.controller.js';
import { TAG_REPOSITORY } from './domain/repository/tag.repository.js';
import { TAGGING_REPOSITORY } from './domain/repository/tagging.repository.js';

@Module({
  controllers: [TagController],
  providers: [
    { provide: TAG_REPOSITORY, useClass: PrismaTagRepository },
    { provide: TAGGING_REPOSITORY, useClass: PrismaTaggingRepository },
    CreateTagUseCase,
    UpdateTagUseCase,
    ListTagsUseCase,
    GetTagByIdUseCase,
    DeleteTagUseCase,
    AttachTagUseCase,
    DetachTagUseCase,
    ListTagsForEntityUseCase,
  ],
  exports: [AttachTagUseCase, DetachTagUseCase, ListTagsForEntityUseCase],
})
export class TagModule {}