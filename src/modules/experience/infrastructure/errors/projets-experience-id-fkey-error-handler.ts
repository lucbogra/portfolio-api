import { PrismaError } from "src/shared/infrastructure/prisma-error-interface.js";
import { ExperienceIntrouvableError } from "../../domain/errors/experience-introuvable.error.js";

export function handleForeignKeyConstraintViolation(error: unknown, id: string): void {
    const err = error as PrismaError;
    
    if (err.code !== 'P2003') {
        return;
    }
    
    const index = err.meta?.driverAdapterError?.cause?.constraint?.index ?? '';
    
    if (index === 'projets_experience_id_fkey') {
        throw new ExperienceIntrouvableError(id);
    }
      
}