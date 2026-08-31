import { PrismaError } from 'src/shared/infrastructure/prisma-error-interface.js';
import { NomDejaUtilise } from '../../domain/errors/nom-deja-utilise.error.js';

export function handleUniqueConstraintError(error: unknown, nom: string): void {
  const err = error as PrismaError;

  if (err.code !== 'P2002') {
    return;
  }

  const fields = err.meta?.driverAdapterError?.cause?.constraint?.fields ?? [];

  if (fields.includes('nom')) {
    throw new NomDejaUtilise(nom);
  }
}