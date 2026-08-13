import { Injectable } from "@nestjs/common";
import { Experience } from "src/domain/experience/entities/experience.entity.js";
import { ExperienceRepository } from "src/domain/experience/repositories/experience.repository.js";
import { PrismaService } from "src/infrastructure/shared/prisma.service.js";
import { ExperienceMapper } from "../mappers/experience.mapper.js";
import { ExperienceId } from "src/domain/experience/value-objects/experience-id.value-object.js";
import { Slug } from "src/domain/shared/value-objects/slug/slug.value-object.js";

@Injectable()
export class PrismaExperienceRepository implements ExperienceRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(experience: Experience): Promise<void> {
        const data = ExperienceMapper.toPersistence(experience);
        await this.prisma.experience.upsert({
            where: {id: data.id},
            create: data,
            update: data
        });
    }

    async findById(id: ExperienceId): Promise<Experience | null> {
        const raw = await this.prisma.experience.findUnique({
            where: {id: id.toString()}
        });
        return raw ? ExperienceMapper.toDomain(raw): null;
    }

    async findBySlug(slug: Slug): Promise<Experience | null> {
        const raw = await this.prisma.experience.findUnique({
            where: { slug: slug.toString()}
        })
        return raw ? ExperienceMapper.toDomain(raw): null;
    }

    async findAll(): Promise<Experience[]> {
        const rows = await this.prisma.experience.findMany({
            orderBy: { dateDebut : 'desc' }
        });
        return rows.map(ExperienceMapper.toDomain);
    }

    async delete(id: ExperienceId): Promise<void> {
        await this.prisma.experience.delete({ where: { id: id.toString()}});
    }
}