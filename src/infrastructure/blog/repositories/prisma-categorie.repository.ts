import { Injectable } from "@nestjs/common";
import { Categorie } from "src/domain/blog/entities/categorie.entity.js";
import { CategorieRepository } from "src/domain/blog/repositories/categorie.repository.js";
import { PrismaService } from "src/infrastructure/shared/prisma.service.js";
import { CategorieMapper } from "../mappers/categorie.mapper.js";
import { CategorieId } from "src/domain/blog/value-objects/categorie-id.value-object.js";
import { Slug } from "src/domain/shared/value-objects/slug/slug.value-object.js";

@Injectable()
export class PrismaCategorieRepository implements CategorieRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(categorie: Categorie): Promise<void> {
        const data = CategorieMapper.toPersistence(categorie);
        await this.prisma.categorie.upsert({
            where: { id: data.id },
            create: data,
            update: data
        })
    }

    async findById(id: CategorieId): Promise<Categorie | null> {
        const raw = await this.prisma.categorie.findUnique({
            where: { id: id.toString() },
        });
        return raw ? CategorieMapper.toDomain(raw) : null;
    }

    async findBySlug(slug: Slug): Promise<Categorie | null> {
        const raw = await this.prisma.categorie.findUnique({
            where: { slug: slug.toString() },
        });
        return raw ? CategorieMapper.toDomain(raw) : null;
    }

    async findAll(): Promise<Categorie[]> {
        const rows = await this.prisma.categorie.findMany({
            orderBy: { nom: 'asc' }
        });
        return rows.map(CategorieMapper.toDomain);
    }

    async delete(id: CategorieId): Promise<void> {
        await this.prisma.categorie.delete({
            where: {id: id.toString() }
        });
    }
}