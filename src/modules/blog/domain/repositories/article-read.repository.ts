export interface ArticlePublieListItem {
  id: string;
  slug: string;
  nom: string;
  image: string | null;
  contenu: string;
  datePublication: Date | null;
  categorie: { id: string; slug: string; nom: string };
  tags: { id: string; nom: string; type: string }[];
}

export interface ArticleReadRepository {
  listPubliesWithTags(): Promise<ArticlePublieListItem[]>;
  findPublieBySlug(slug: string): Promise<ArticlePublieListItem | null>;
}

export const ARTICLE_READ_REPOSITORY = Symbol('ARTICLE_READ_REPOSITORY');
