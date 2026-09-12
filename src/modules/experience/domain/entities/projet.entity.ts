import { ProjetId } from 'src/modules/experience/domain/value-objects/projet-id.value-object.js';
import { ExperienceId } from 'src/modules/experience/domain/value-objects/experience-id.value-object.js';
import { Periode } from 'src/shared/domain/value-objects/periode/periode.value-object.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { ProjetResumeRequisError } from 'src/modules/experience/domain/errors/projet-resume-requis.error.js';

export interface CreateProjetParams {
  id: ProjetId;
  experienceId: ExperienceId | null;
  slug: Slug;
  nom: string;
  image: string | null;
  periode: Periode;
  github: Lien | null;
  details: string;
  resume: string | null;
  lienDemo: Lien | null;
  enAvant: boolean;
  ordreAffichage: number | null;
}

export interface UpdateProjetParams {
  experienceId: ExperienceId | null;
  nom: string;
  image: string | null;
  periode: Periode;
  github: Lien | null;
  details: string;
  resume: string | null;
  lienDemo: Lien | null;
  enAvant: boolean;
  ordreAffichage: number | null;
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
    private _resume: string | null,
    private _lienDemo: Lien | null,
    private _enAvant: boolean,
    private _ordreAffichage: number | null,
  ) {}

  static create(params: CreateProjetParams): Projet {
    Projet.verifierResumeRequis(params.enAvant, params.resume);

    return Projet.reconstitute(params);
  }

  // Hydratation depuis la persistance : ne revérifie pas l'invariante, pour ne
  // pas empêcher de relire un projet existant dont l'état serait antérieur à
  // l'introduction de la règle (le champ resume est apparu après coup).
  static reconstitute(params: CreateProjetParams): Projet {
    return new Projet(
      params.id,
      params.experienceId,
      params.slug,
      params.nom,
      params.image,
      params.periode,
      params.github,
      params.details,
      params.resume,
      params.lienDemo,
      params.enAvant,
      params.ordreAffichage,
    );
  }

  update(params: UpdateProjetParams): void {
    Projet.verifierResumeRequis(params.enAvant, params.resume);

    this._experienceId   = params.experienceId;
    this._nom            = params.nom;
    this._image          = params.image;
    this._periode        = params.periode;
    this._github         = params.github;
    this._details        = params.details;
    this._resume         = params.resume;
    this._lienDemo       = params.lienDemo;
    this._enAvant        = params.enAvant;
    this._ordreAffichage = params.ordreAffichage;
  }

  private static verifierResumeRequis(
    enAvant: boolean,
    resume: string | null,
  ): void {
    if (enAvant && (!resume || resume.trim().length === 0)) {
      throw new ProjetResumeRequisError();
    }
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

  get resume(): string | null {
    return this._resume;
  }

  get lienDemo(): Lien | null {
    return this._lienDemo;
  }

  get enAvant(): boolean {
    return this._enAvant;
  }

  get ordreAffichage(): number | null {
    return this._ordreAffichage;
  }
}
