import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';

export interface CreateCategorieParams {
  id: CategorieId;
  slug: Slug;
  nom: string;
}

export class Categorie {
  private constructor(
    private readonly _id: CategorieId,
    private _slug: Slug,
    private _nom: string,
  ) {}

  static create(params: CreateCategorieParams): Categorie {
    return new Categorie(params.id, params.slug, params.nom);
  }

  get id(): CategorieId {
    return this._id;
  }

  get slug(): Slug {
    return this._slug;
  }

  get nom(): string {
    return this._nom;
  }
}
