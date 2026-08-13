import { Profil } from '../entities/profil.entity.js';

export interface ProfilRepository {
  save(profil: Profil): Promise<void>;
  get(): Promise<Profil | null>;
}

export const PROFIL_REPOSITORY = Symbol('PROFIL_REPOSITORY');