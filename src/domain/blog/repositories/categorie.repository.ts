import { Categorie } from '../entities/categorie.entity';
import { CategorieId } from '../value-objects/categorie-id.value-object';
import { Slug } from '../../shared/value-objects/slug/slug.value-object';

export interface CategorieRepository {
  save(categorie: Categorie): Promise<void>;
  findById(id: CategorieId): Promise<Categorie | null>;
  findBySlug(slug: Slug): Promise<Categorie | null>;
  findAll(): Promise<Categorie[]>;
  delete(id: CategorieId): Promise<void>;
}

export const CATEGORIE_REPOSITORY = Symbol('CATEGORIE_REPOSITORY');