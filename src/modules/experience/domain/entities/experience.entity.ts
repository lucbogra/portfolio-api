import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';
import { Periode } from 'src/shared/domain/value-objects/periode/periode.value-object.js';
import { Contexte } from 'src/modules/experience/domain/value-objects/contexte.value-object.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';
import { Projet } from 'src/modules/experience/domain/entities/projet.entity.js';

export interface CreateExperienceParams {
  id: ExperienceId;
  slug: Slug;
  periode: Periode;
  titre: string;
  entreprise: string;
  contexte: Contexte;
  description: string;
  lienDemo: Lien | null;
  projets?: Projet[];
}

export class Experience {
  private constructor(
    private readonly _id: ExperienceId,
    private _slug: Slug,
    private _periode: Periode,
    private _titre: string,
    private _entreprise: string,
    private _contexte: Contexte,
    private _description: string,
    private _lienDemo: Lien | null,
    private readonly _projets: Projet[],
  ) {}

  static create(params: CreateExperienceParams): Experience {
    return new Experience(
      params.id,
      params.slug,
      params.periode,
      params.titre,
      params.entreprise,
      params.contexte,
      params.description,
      params.lienDemo,
      params.projets ?? [],
    );
  }

  get id(): ExperienceId {
    return this._id;
  }

  get slug(): Slug {
    return this._slug;
  }

  get periode(): Periode {
    return this._periode;
  }

  get titre(): string {
    return this._titre;
  }

  get entreprise(): string {
    return this._entreprise;
  }

  get contexte(): Contexte {
    return this._contexte;
  }

  get description(): string {
    return this._description;
  }

  get lienDemo(): Lien | null {
    return this._lienDemo;
  }
}
