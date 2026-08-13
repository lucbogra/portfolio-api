import { Module } from '@nestjs/common';
import { ARTICLE_REPOSITORY } from 'src/modules/blog/domain/repositories/article.repository.js';
import { CATEGORIE_REPOSITORY } from 'src/modules/blog/domain/repositories/categorie.repository.js';
import { PrismaArticleRepository } from 'src/modules/blog/infrastructure/repositories/prisma-article.repository.js';
import { PrismaCategorieRepository } from 'src/modules/blog/infrastructure/repositories/prisma-categorie.repository.js';

@Module({
  providers: [
    { provide: ARTICLE_REPOSITORY, useClass: PrismaArticleRepository },
    { provide: CATEGORIE_REPOSITORY, useClass: PrismaCategorieRepository },
  ],
  exports: [ARTICLE_REPOSITORY, CATEGORIE_REPOSITORY],
})
export class BlogModule {}
