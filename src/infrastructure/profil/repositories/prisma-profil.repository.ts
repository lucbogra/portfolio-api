import { Injectable } from "@nestjs/common";
import { Profil } from "src/domain/profil/entities/profil.entity.js";
import { ProfilRepository } from "src/domain/profil/repositories/profil.repository.js";
import { PrismaService } from "src/infrastructure/shared/prisma.service.js";
import { ProfilMapper } from "../mappers/profil.mapper.js";
import { ProfilId } from "src/domain/profil/value-object/profil-id.value-objects.js";

@Injectable()
export class PrismaProfilRepository implements ProfilRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(profil: Profil): Promise<void> {
        const data = ProfilMapper.toPersistence(profil);
        await this.prisma.profil.upsert({
            where: { id: ProfilId.UNIQUE.toString() },
            create: data,
            update: data
        });
    }

    async get(): Promise<Profil | null> {
        const raw = await this.prisma.profil.findUnique({
            where: { id: ProfilId.UNIQUE.toString() }
        });
        return raw ? ProfilMapper.toDomain(raw) : null;
    }
}