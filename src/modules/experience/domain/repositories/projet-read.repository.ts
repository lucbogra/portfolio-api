export interface ProjetListItem {
  id: string;
  slug: string;
  nom: string;
  image: string | null;
  dateDebut: Date;
  dateFin: Date | null;
  github: string | null;
  details: string;
  resume: string | null;
  lienDemo: string | null;
  enAvant: boolean;
  ordreAffichage: number | null;
  experience: { id: string; titre: string } | null;
  tags: { id: string; nom: string; type: string }[];
}

export interface ProjetReadRepository {
  listAllWithExperienceAndTags(): Promise<ProjetListItem[]>;
  listSelectionWithExperienceAndTags(): Promise<ProjetListItem[]>;
}

export const PROJET_READ_REPOSITORY = Symbol('PROJET_READ_REPOSITORY');
