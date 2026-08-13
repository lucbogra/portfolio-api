import { Injectable } from '@nestjs/common';
import { Profil } from 'src/modules/profil/domain/entities/profil.entity.js';
import { ProfilRepository } from 'src/modules/profil/domain/repositories/profil.repository.js';
import { PrismaService } from 'src/shared/infrastructure/prisma.service.js';
import { ProfilMapper } from 'src/modules/profil/infrastructure/mappers/profil.mapper.js';
import { ProfilId } from 'src/modules/profil/domain/value-object/profil-id.value-objects.js';

@Injectable()
export class PrismaProfilRepository implements ProfilRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(profil: Profil): Promise<void> {
    const data = ProfilMapper.toPersistence(profil);
    await this.prisma.profil.upsert({
      where: { id: ProfilId.UNIQUE.toString() },
      create: data,
      update: data,
    });
  }

  async get(): Promise<Profil | null> {
    const raw = await this.prisma.profil.findUnique({
      where: { id: ProfilId.UNIQUE.toString() },
    });
    return raw ? ProfilMapper.toDomain(raw) : null;
  }
}
