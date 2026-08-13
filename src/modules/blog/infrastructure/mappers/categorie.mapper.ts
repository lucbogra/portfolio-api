import { Categorie } from 'src/modules/blog/domain/entities/categorie.entity.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { Categorie as PrismaCategorie } from 'src/generated/prisma/client.js';

export class CategorieMapper {
  static toDomain(raw: PrismaCategorie): Categorie {
    return Categorie.create({
      id: CategorieId.create(raw.id),
      slug: Slug.create(raw.slug),
      nom: raw.nom,
    });
  }

  static toPersistence(categorie: Categorie): PrismaCategorie {
    return {
      id: categorie.id.toString(),
      slug: categorie.slug.toString(),
      nom: categorie.nom,
    };
  }
}
