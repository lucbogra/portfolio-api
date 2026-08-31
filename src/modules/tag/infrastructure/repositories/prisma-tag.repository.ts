import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/infrastructure/prisma.service.js";
import { TagRepository } from "../../domain/repository/tag.repository.js";
import { Tag } from "../../domain/entity/tag.entity.js";
import { TagMapper } from "../mappers/tag.mappers.js";
import { handleUniqueConstraintError } from "../errors/tag-nom-unique-error.handler.js";
import { TagId } from "../../domain/value-object/tag-id.value-object.js";

@Injectable()
export class PrismaTagRepository implements TagRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(tag: Tag): Promise<void> {
        const data = TagMapper.toPrisma(tag);

        try {
            await this.prisma.tag.upsert({
                where: {id: data.id},
                create : data,
                update : data
            });
        } catch(error) {
            handleUniqueConstraintError(error, data.nom);
            throw error;
        }

        
    }

    async findById(tagId: TagId): Promise<Tag | null> {
        const id = tagId.toString();

        const raw = await this.prisma.tag.findUnique({
            where: {id: id}
        });

        return raw ? TagMapper.toDomain(raw) : null;
    }

    async findAll(): Promise<Tag[]> {
        const rows = await this.prisma.tag.findMany({
            orderBy: {nom: 'asc'}
        });

        return rows.map(TagMapper.toDomain);
    }

    async delete(tagId: TagId): Promise<void> {
        await this.prisma.tag.delete({
            where: {id: tagId.toString()}
        });
    }
}