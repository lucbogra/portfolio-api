import { SlugDejaUtiliseError } from 'src/shared/domain/errors/slug-deja-utilise.error.js';

interface PrismaP2002Error {
  code?: string;
  meta?: {
    driverAdapterError?: {
      cause?: {
        kind?: string;
        constraint?: {
          fields?: string[];
        };
      };
    };
  };
}

export function handleUniqueConstraintError(error: unknown, slug: string): void {
  const err = error as PrismaP2002Error;

  if (err.code !== 'P2002') {
    return;
  }

  const fields = err.meta?.driverAdapterError?.cause?.constraint?.fields ?? [];

  if (fields.includes('slug')) {
    throw new SlugDejaUtiliseError(slug);
  }
}