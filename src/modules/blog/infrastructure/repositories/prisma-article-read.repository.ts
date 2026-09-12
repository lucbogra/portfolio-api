import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client.js';
import {
  StatutArticle as PrismaStatutArticle,
  TaggableType as PrismaTaggableType,
} from 'src/generated/prisma/enums.js';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import {
  ArticleReadRepository,
  ArticlePublieListItem,
} from 'src/modules/blog/domain/repositories/article-read.repository.js';
import { TagMapper } from 'src/modules/tag/infrastructure/mappers/tag.mappers.js';

const articleWithCategorieInclude = {
  categorie: { select: { id: true, slug: true, nom: true } },
} satisfies Prisma.ArticleInclude;

type ArticleWithCategorie = Prisma.ArticleGetPayload<{
  include: typeof articleWithCategorieInclude;
}>;

type ArticleTag = { id: string; nom: string; type: string };

@Injectable()
export class PrismaArticleReadRepository implements ArticleReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listPubliesWithTags(): Promise<ArticlePublieListItem[]> {
    const rows: ArticleWithCategorie[] = await this.prisma.article.findMany({
      where: { statut: PrismaStatutArticle.PUBLIE },
      orderBy: { datePublication: 'desc' },
      include: articleWithCategorieInclude,
    });

    const tagsByArticleId = await this.loadTags(rows.map((row) => row.id));

    return rows.map((row) => this.toListItem(row, tagsByArticleId));
  }

  async findPublieBySlug(slug: string): Promise<ArticlePublieListItem | null> {
    const row: ArticleWithCategorie | null = await this.prisma.article.findFirst({
      where: { slug, statut: PrismaStatutArticle.PUBLIE },
      include: articleWithCategorieInclude,
    });

    if (!row) {
      return null;
    }

    const tagsByArticleId = await this.loadTags([row.id]);

    return this.toListItem(row, tagsByArticleId);
  }

  private async loadTags(articleIds: string[]): Promise<Map<string, ArticleTag[]>> {
    const taggables = await this.prisma.taggable.findMany({
      where: {
        taggableType: PrismaTaggableType.ARTICLE,
        taggableId: { in: articleIds },
      },
      include: { tag: true },
    });

    const tagsByArticleId = new Map<string, ArticleTag[]>();
    for (const taggable of taggables) {
      const tag = TagMapper.toDomain(taggable.tag);
      const tags = tagsByArticleId.get(taggable.taggableId) ?? [];
      tags.push({ id: tag.id.toString(), nom: tag.nom, type: tag.type.value });
      tagsByArticleId.set(taggable.taggableId, tags);
    }

    return tagsByArticleId;
  }

  private toListItem(
    row: ArticleWithCategorie,
    tagsByArticleId: Map<string, ArticleTag[]>,
  ): ArticlePublieListItem {
    return {
      id: row.id,
      slug: row.slug,
      nom: row.nom,
      image: row.image,
      contenu: row.contenu,
      datePublication: row.datePublication,
      categorie: {
        id: row.categorie.id,
        slug: row.categorie.slug,
        nom: row.categorie.nom,
      },
      tags: tagsByArticleId.get(row.id) ?? [],
    };
  }
}
