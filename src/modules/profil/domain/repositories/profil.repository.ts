import { Profil } from 'src/modules/profil/domain/entities/profil.entity.js';

export interface ProfilRepository {
  save(profil: Profil): Promise<void>;
  get(): Promise<Profil | null>;
}

export const PROFIL_REPOSITORY = Symbol('PROFIL_REPOSITORY');
