import { PrismaError } from "src/shared/infrastructure/prisma-error-interface.js";
import { TagEnUsageError } from "../../domain/errors/tag-en-usage.error.js";

export function handleTagEnUsageError(error: unknown, id: string): void {
  const err = error as PrismaError;

  if (err.code !== 'P2003') {
    return;
  }

  const index = err.meta?.driverAdapterError?.cause?.constraint?.index ?? '';

  if (index === 'taggables_tag_id_fkey') {
    throw new TagEnUsageError(id);
  }
}
