import { SlugDejaUtiliseError } from 'src/shared/domain/errors/slug-deja-utilise.error.js';
import { PrismaError } from './prisma-error-interface.js';

export function handleUniqueConstraintError(error: unknown, slug: string): void {
  const err = error as PrismaError;

  if (err.code !== 'P2002') {
    return;
  }

  const fields = err.meta?.driverAdapterError?.cause?.constraint?.fields ?? [];

  if (fields.includes('slug')) {
    throw new SlugDejaUtiliseError(slug);
  }
}