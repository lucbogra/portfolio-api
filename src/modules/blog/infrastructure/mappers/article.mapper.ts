import { Article } from 'src/modules/blog/domain/entities/article.entity.js';
import { ArticleId } from 'src/modules/blog/domain/value-objects/article-id.value-object.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';
import {
  StatutArticle,
  StatutArticleType,
} from 'src/modules/blog/domain/value-objects/statut-article.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { Article as PrismaArticle } from 'src/generated/prisma/client.js';
import { StatutArticle as PrismaStatutArticle } from 'src/generated/prisma/enums.js';

const DOMAIN_TO_PRISMA_STATUT_ARTICLE: Record<
  StatutArticleType,
  PrismaStatutArticle
> = {
  [StatutArticleType.BROUILLON]: PrismaStatutArticle.BROUILLON,
  [StatutArticleType.INACTIF]: PrismaStatutArticle.INACTIF,
  [StatutArticleType.PUBLIE]: PrismaStatutArticle.PUBLIE,
};

const PRISMA_TO_DOMAIN_STATUT_ARTICLE: Record<
  PrismaStatutArticle,
  StatutArticleType
> = {
  [PrismaStatutArticle.BROUILLON]: StatutArticleType.BROUILLON,
  [PrismaStatutArticle.INACTIF]: StatutArticleType.INACTIF,
  [PrismaStatutArticle.PUBLIE]: StatutArticleType.PUBLIE,
};

export class ArticleMapper {
  static toDomain(raw: PrismaArticle): Article {
    return Article.reconstitute({
      id: ArticleId.create(raw.id),
      slug: Slug.create(raw.slug),
      categorieId: CategorieId.create(raw.categorieId),
      nom: raw.nom,
      contenu: raw.contenu,
      image: raw.image,
      datePublication: raw.datePublication,
      statut: StatutArticle.create(PRISMA_TO_DOMAIN_STATUT_ARTICLE[raw.statut]),
    });
  }

  static toPersistence(article: Article): PrismaArticle {
    return {
      id: article.id.toString(),
      slug: article.slug.toString(),
      categorieId: article.categorieId.toString(),
      nom: article.nom,
      contenu: article.contenu,
      image: article.image ?? null,
      datePublication: article.datePublication ?? null,
      statut: DOMAIN_TO_PRISMA_STATUT_ARTICLE[article.statut.value],
    };
  }
}
