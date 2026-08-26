import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';
import { Telephone } from 'src/shared/domain/value-objects/telephone/telephone.value-object.js';
import { ProfilId } from 'src/modules/profil/domain/value-object/profil-id.value-objects.js';

export interface CreateProfilParams {
  titre: string;
  description: string;
  telephone: Telephone;
  github: Lien | null;
  linkedin: Lien | null;
  pays: string;
  ville: string;
  adresse: string | null;
}

export interface UpdateProfilParams {
  titre: string;
  description: string;
  telephone: Telephone;
  github: Lien | null;
  linkedin: Lien | null;
  pays: string;
  ville: string;
  adresse: string | null;
}

export class Profil {
  private constructor(
    private readonly _id: ProfilId,
    private _titre: string,
    private _description: string,
    private _telephone: Telephone,
    private _github: Lien | null,
    private _linkedin: Lien | null,
    private _pays: string,
    private _ville: string,
    private _adresse: string | null,
  ) {}

  static create(params: CreateProfilParams): Profil {
    return new Profil(
      ProfilId.UNIQUE,
      params.titre,
      params.description,
      params.telephone,
      params.github,
      params.linkedin,
      params.pays,
      params.ville,
      params.adresse,
    );
  }

  get id(): ProfilId {
    return this._id;
  }

  get titre(): string {
    return this._titre;
  }

  get description(): string {
    return this._description;
  }

  get telephone(): Telephone {
    return this._telephone;
  }

  get github(): Lien | null {
    return this._github;
  }

  get linkedin(): Lien | null {
    return this._linkedin;
  }

  get pays(): string {
    return this._pays;
  }

  get ville(): string {
    return this._ville;
  }

  get adresse(): string | null {
    return this._adresse;
  }

  update(params: UpdateProfilParams): void {
    this._titre = params.titre;
    this._description = params.description;
    this._telephone = params.telephone
    this._adresse = params.adresse;
    this._pays = params.pays;
    this._ville = params.ville;
    this._linkedin = params.linkedin;
   this._github = params.github;
  }
}
