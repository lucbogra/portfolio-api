import { PrismaError } from "src/shared/infrastructure/prisma-error-interface.js";
import { CategorieUtiliseeError } from "../../domain/errors/categorie-utilisee.error.js";

export function handleCategorieEnUsageError(error: unknown, id: string): void {
  const err = error as PrismaError;

  if (err.code !== 'P2003') {
    return;
  }

  const index = err.meta?.driverAdapterError?.cause?.constraint?.index ?? '';

  if (index === 'articles_categorie_id_fkey') {
    throw new CategorieUtiliseeError(id);
  }
}