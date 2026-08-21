import { ProjetId } from 'src/modules/experience/domain/value-objects/projet-id.value-object.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';
import { Periode } from 'src/shared/domain/value-objects/periode/periode.value-object.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';

export interface CreateProjetParams {
  id: ProjetId;
  experienceId: ExperienceId | null;
  slug: Slug;
  nom: string;
  image: string | null;
  periode: Periode;
  github: Lien | null;
  details: string;
  lienDemo: Lien | null;
}

export interface UpdateProjetParams {
  experienceId: ExperienceId | null;
  nom: string;
  image: string | null;
  periode: Periode;
  github: Lien | null;
  details: string;
  lienDemo: Lien | null;
}

export class Projet {
  private constructor(
    private readonly _id: ProjetId,
    private _experienceId: ExperienceId | null,
    private _slug: Slug,
    private _nom: string,
    private _image: string | null,
    private _periode: Periode,
    private _github: Lien | null,
    private _details: string,
    private _lienDemo: Lien | null,
  ) {}

  static create(params: CreateProjetParams): Projet {
    return new Projet(
      params.id,
      params.experienceId,
      params.slug,
      params.nom,
      params.image,
      params.periode,
      params.github,
      params.details,
      params.lienDemo,
    );
  }

  update(params: UpdateProjetParams): void {
    this._experienceId  = params.experienceId;
    this._nom           = params.nom;
    this._image         = params.image;
    this._periode       = params.periode;
    this._github        = params.github;
    this._details       = params.details;
    this._lienDemo      = params.lienDemo;
  }

  get id(): ProjetId {
    return this._id;
  }

  get experienceId(): ExperienceId | null {
    return this._experienceId;
  }

  get slug(): Slug {
    return this._slug;
  }

  get nom(): string {
    return this._nom;
  }

  get image(): string | null {
    return this._image;
  }

  get periode(): Periode {
    return this._periode;
  }

  get github(): Lien | null {
    return this._github;
  }

  get details(): string {
    return this._details;
  }

  get lienDemo(): Lien | null {
    return this._lienDemo;
  }
}
