import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { ArticleId } from 'src/modules/blog/domain/value-objects/article-id.value-object.js';
import { CategorieId } from 'src/modules/blog/domain/value-objects/categorie-id.value-object.js';
import {
  StatutArticle,
  StatutArticleType,
} from 'src/modules/blog/domain/value-objects/statut-article.value-object.js';

export interface CreateArticleParams {
  id: ArticleId;
  slug: Slug;
  categorieId: CategorieId;
  nom: string;
  image: string | null;
  contenu: string;
  datePublication: Date | null;
  statut?: StatutArticle;
}

export class Article {
  private constructor(
    private readonly _id: ArticleId,
    private _slug: Slug,
    private _categorieId: CategorieId,
    private _nom: string,
    private _image: string | null,
    private _contenu: string,
    private _datePublication: Date | null,
    private _statut: StatutArticle,
  ) {}

  static create(params: CreateArticleParams): Article {
    return new Article(
      params.id,
      params.slug,
      params.categorieId,
      params.nom,
      params.image,
      params.contenu,
      params.datePublication,
      params.statut ?? StatutArticle.brouillon(),
    );
  }

  get id(): ArticleId {
    return this._id;
  }

  get slug(): Slug {
    return this._slug;
  }

  get categorieId(): CategorieId {
    return this._categorieId;
  }

  get nom(): string {
    return this._nom;
  }

  get image(): string | null {
    return this._image;
  }

  get contenu(): string {
    return this._contenu;
  }

  get datePublication(): Date | null {
    return this._datePublication;
  }

  get statut(): StatutArticle {
    return this._statut;
  }

  publier(): void {
    this._statut = this._statut.transitionnerVers(StatutArticleType.PUBLIE);
    this._datePublication = this._datePublication ?? new Date();
  }

  desactiver(): void {
    this._statut = this._statut.transitionnerVers(StatutArticleType.INACTIF);
  }
}
