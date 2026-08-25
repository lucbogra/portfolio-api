import { Injectable } from '@nestjs/common';
import { Article } from 'src/modules/blog/domain/entities/article.entity.js';
import { ArticleRepository } from 'src/modules/blog/domain/repositories/article.repository.js';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import { ArticleMapper } from 'src/modules/blog/infrastructure/mappers/article.mapper.js';
import { ArticleId } from 'src/modules/blog/domain/value-objects/article-id.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';
import { handleUniqueConstraintError } from 'src/shared/infrastructure/prisma-error-handler.js';
import { handleForeignKeyConstraintViolation } from '../errors/articles-categorie-id-fkey-error-handler.js';

@Injectable()
export class PrismaArticleRepository implements ArticleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(article: Article): Promise<void> {
    const data = ArticleMapper.toPersistence(article);
    try {
      await this.prisma.article.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      });
    } catch (error)  {
      handleUniqueConstraintError(error, data.slug);
      handleForeignKeyConstraintViolation(error, data.categorieId);
      throw error;
    }
    
  }

  async findById(id: ArticleId): Promise<Article | null> {
    const raw = await this.prisma.article.findUnique({
      where: { id: id.toString() },
    });
    return raw ? ArticleMapper.toDomain(raw) : null;
  }

  async findBySlug(slug: Slug): Promise<Article | null> {
    const raw = await this.prisma.article.findUnique({
      where: { slug: slug.toString() },
    });
    return raw ? ArticleMapper.toDomain(raw) : null;
  }

  async findByCategorie(categoryId: CategorieId): Promise<Article[]> {
    const rows = await this.prisma.article.findMany({
      where: { categorieId: categoryId.toString() },
    });
    return rows.map(ArticleMapper.toDomain);
  }

  async findAll(): Promise<Article[]> {
    const rows = await this.prisma.article.findMany({
      orderBy: { datePublication: 'desc' },
    });
    return rows.map(ArticleMapper.toDomain);
  }

  async delete(id: ArticleId): Promise<void> {
    await this.prisma.article.delete({
      where: { id: id.toString() },
    });
  }
}
