export interface ExperienceListItem {
  id: string;
  slug: string;
  titre: string;
  entreprise: string;
  contexte: string;
  description: string;
  dateDebut: Date;
  dateFin: Date | null;
  lienDemo: string | null;
  tags: { id: string; nom: string; type: string }[];
}

export interface ExperienceReadRepository {
  listAllWithTags(): Promise<ExperienceListItem[]>;
}

export const EXPERIENCE_READ_REPOSITORY = Symbol('EXPERIENCE_READ_REPOSITORY');
