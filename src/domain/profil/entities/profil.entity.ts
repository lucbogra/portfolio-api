import { Lien } from "src/domain/shared/value-objects/lien/lien.value-object";
import { Telephone } from "src/domain/shared/value-objects/telephone/telephone.value-object";
import { ProfilId } from "../value-object/profil-id.value-objects";

export interface CreateProfilParams {
    titre: string;
    description: string;
    telephone: Telephone;
    github: Lien | null;
    linkedin: Lien | null;
    pays: string;
    ville: string;
    adresse: string | null
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
    
}