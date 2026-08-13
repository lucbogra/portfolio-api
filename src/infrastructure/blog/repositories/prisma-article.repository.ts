import { Injectable } from "@nestjs/common";
import { Article } from "src/domain/blog/entities/article.entity.js";
import { ArticleRepository } from "src/domain/blog/repositories/article.repository.js";
import { PrismaService } from "src/infrastructure/shared/prisma.service.js";
import { ArticleMapper } from "../mappers/article.mapper.js";
import { ArticleId } from "src/domain/blog/value-objects/article-id.value-object.js";
import { Slug } from "src/domain/shared/value-objects/slug/slug.value-object.js";
import { CategorieId } from "src/domain/blog/value-objects/categorie-id.value-object.js";

@Injectable()
export class PrismaArticleRepository implements ArticleRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(article: Article): Promise<void> {
        const data = ArticleMapper.toPersistence(article);
        await this.prisma.article.upsert({
            where: { id: data.id },
            create: data,
            update: data
        })
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
            where: { categorieId: categoryId.toString() }
        });
        return rows.map(ArticleMapper.toDomain);
    }

    async findAll(): Promise<Article[]> {
        const rows = await this.prisma.article.findMany({
            orderBy: { datePublication: 'desc' }
        });
        return rows.map(ArticleMapper.toDomain);
    }

    async delete(id: ArticleId): Promise<void> {
        await this.prisma.article.delete({
            where: {id: id.toString() }
        });
    }
}