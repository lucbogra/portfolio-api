import { Categorie } from 'src/modules/blog/domain/entities/categorie.entity.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';

export interface CategorieRepository {
  save(categorie: Categorie): Promise<void>;
  findById(id: CategorieId): Promise<Categorie | null>;
  findBySlug(slug: Slug): Promise<Categorie | null>;
  findAll(): Promise<Categorie[]>;
  delete(id: CategorieId): Promise<void>;
}

export const CATEGORIE_REPOSITORY = Symbol('CATEGORIE_REPOSITORY');
