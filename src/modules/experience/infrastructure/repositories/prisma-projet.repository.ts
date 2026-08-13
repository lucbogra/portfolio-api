import { Injectable } from '@nestjs/common';
import { Projet } from 'src/modules/experience/domain/entities/projet.entity.js';
import { ProjetRepository } from 'src/modules/experience/domain/repositories/projet.repository.js';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import { ProjetMapper } from 'src/modules/experience/infrastructure/mappers/projet.mapper.js';
import { ProjetId } from 'src/modules/experience/domain/value-objects/projet-id.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';

@Injectable()
export class PrismaProjetRepository implements ProjetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(projet: Projet): Promise<void> {
    const data = ProjetMapper.toPersistence(projet);
    await this.prisma.projet.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async findById(id: ProjetId): Promise<Projet | null> {
    const raw = await this.prisma.projet.findUnique({
      where: { id: id.toString() },
    });
    return raw ? ProjetMapper.toDomain(raw) : null;
  }

  async findBySlug(slug: Slug): Promise<Projet | null> {
    const raw = await this.prisma.projet.findUnique({
      where: { slug: slug.toString() },
    });
    return raw ? ProjetMapper.toDomain(raw) : null;
  }

  async findByExperienceId(experienceId: ExperienceId): Promise<Projet[]> {
    const rows = await this.prisma.projet.findMany({
      where: { experienceId: experienceId.toString() },
    });
    return rows.map(ProjetMapper.toDomain);
  }

  async findAutonomes(): Promise<Projet[]> {
    const rows = await this.prisma.projet.findMany({
      where: { experienceId: null },
    });
    return rows.map(ProjetMapper.toDomain);
  }

  async findAll(): Promise<Projet[]> {
    const rows = await this.prisma.projet.findMany({
      orderBy: { dateDebut: 'desc' },
    });
    return rows.map(ProjetMapper.toDomain);
  }

  async delete(id: ProjetId): Promise<void> {
    await this.prisma.projet.delete({
      where: { id: id.toString() },
    });
  }
}
