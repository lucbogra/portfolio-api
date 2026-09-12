import { Module } from '@nestjs/common';
import { ARTICLE_REPOSITORY } from 'src/modules/blog/domain/repositories/article.repository.js';
import { CATEGORIE_REPOSITORY } from 'src/modules/blog/domain/repositories/categorie.repository.js';
import { ARTICLE_READ_REPOSITORY } from 'src/modules/blog/domain/repositories/article-read.repository.js';
import { PrismaArticleRepository } from 'src/modules/blog/infrastructure/repositories/prisma-article.repository.js';
import { PrismaCategorieRepository } from 'src/modules/blog/infrastructure/repositories/prisma-categorie.repository.js';
import { PrismaArticleReadRepository } from 'src/modules/blog/infrastructure/repositories/prisma-article-read.repository.js';
import { CategorieController } from './presentation/controllers/categorie.controller.js';
import { ArticleController } from './presentation/controllers/article.controller.js';
import { CreateArticleUseCase } from './application/use-cases/create-article.use-case.js';
import { UpdateArticleUseCase } from './application/use-cases/update-article.use-case.js';
import { ListArticleUseCase } from './application/use-cases/list-articles.use-case.js';
import { ListArticlesPubliesUseCase } from './application/use-cases/list-articles-publies.use-case.js';
import { GetArticleBySlugUseCase } from './application/use-cases/get-article-by-slug.use-case.js';
import { GetArticlePublieBySlugUseCase } from './application/use-cases/get-article-publie-by-slug.use-case.js';
import { DeleteArticleUseCase } from './application/use-cases/delete-article.use-case.js';
import { SwitchArticleStatutUseCase } from './application/use-cases/switch-article-statut.use-case.js';
import { GetArticlesByCategorieUseCase } from './application/use-cases/get-articles-by-categorie.use-case.js';
import { CreateCategorieUseCase } from './application/use-cases/create-categorie.use-case.js';
import { UpdateCategorieUseCase } from './application/use-cases/update-categorie.use-case.js';
import { GetCategorieBySlugUseCase } from './application/use-cases/get-categorie-by-slug.use-case.js';
import { ListCategorieUseCase } from './application/use-cases/list-categories.use-case.js';
import { DeleteCategorieUseCase } from './application/use-cases/delete-categorie.use-case.js';
import { TagModule } from '../tag/tag.module.js';

@Module({
  imports: [TagModule],
  controllers: [CategorieController, ArticleController],
  providers: [
    { provide: ARTICLE_REPOSITORY, useClass: PrismaArticleRepository },
    { provide: CATEGORIE_REPOSITORY, useClass: PrismaCategorieRepository },
    { provide: ARTICLE_READ_REPOSITORY, useClass: PrismaArticleReadRepository },
    CreateArticleUseCase,
    UpdateArticleUseCase,
    ListArticleUseCase,
    ListArticlesPubliesUseCase,
    GetArticleBySlugUseCase,
    GetArticlePublieBySlugUseCase,
    DeleteArticleUseCase,
    SwitchArticleStatutUseCase,
    GetArticlesByCategorieUseCase,
    CreateCategorieUseCase,
    UpdateCategorieUseCase,
    GetCategorieBySlugUseCase,
    ListCategorieUseCase,
    DeleteCategorieUseCase
  ],
  exports: [ARTICLE_REPOSITORY, CATEGORIE_REPOSITORY],
})
export class BlogModule {}
