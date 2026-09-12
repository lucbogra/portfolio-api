import { Profil } from 'src/modules/profil/domain/entities/profil.entity.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';
import { Telephone } from 'src/shared/domain/value-objects/telephone/telephone.value-object.js';
import { Profil as PrismaProfil } from 'src/generated/prisma/client.js';

export class ProfilMapper {
  static toDomain(raw: PrismaProfil): Profil {
    return Profil.create({
      titre: raw.titre,
      description: raw.description,
      telephone: Telephone.create(raw.telephone),
      github: raw.github ? Lien.create(raw.github) : null,
      linkedin: raw.linkedin ? Lien.create(raw.linkedin) : null,
      pays: raw.pays,
      ville: raw.ville,
      adresse: raw.adresse,
      disponible: raw.disponible,
    });
  }

  static toPersistence(profil: Profil): PrismaProfil {
    return {
      id: profil.id.toString(),
      titre: profil.titre,
      description: profil.description,
      telephone: profil.telephone.toString(),
      github: profil.github?.toString() ?? null,
      linkedin: profil.linkedin?.toString() ?? null,
      pays: profil.pays,
      ville: profil.ville,
      adresse: profil.adresse,
      disponible: profil.disponible,
    };
  }
}
