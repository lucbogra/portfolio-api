import { Injectable } from '@nestjs/common';
import { Categorie } from 'src/modules/blog/domain/entities/categorie.entity.js';
import { CategorieRepository } from 'src/modules/blog/domain/repositories/categorie.repository.js';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import { CategorieMapper } from 'src/modules/blog/infrastructure/mappers/categorie.mapper.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { handleUniqueConstraintError } from 'src/shared/infrastructure/prisma-error-handler.js';
import { handleCategorieEnUsageError } from '../errors/categorie-en-usage-error-handler.js';

@Injectable()
export class PrismaCategorieRepository implements CategorieRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(categorie: Categorie): Promise<void> {
    const data = CategorieMapper.toPersistence(categorie);
    try {
      await this.prisma.categorie.upsert({
        where: { id: data.id },
        create: data,
        update: data,
      });
    } catch (error) {
      handleUniqueConstraintError(error, data.slug);
      throw error;
    }
    
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
      orderBy: { nom: 'asc' },
    });
    return rows.map(CategorieMapper.toDomain);
  }

  async delete(id: CategorieId): Promise<void> {
    try {
      await this.prisma.categorie.delete({
        where: { id: id.toString() },
      });
    } catch (error) {
      handleCategorieEnUsageError(error, id.toString());
      throw error;
    }
  }
}
