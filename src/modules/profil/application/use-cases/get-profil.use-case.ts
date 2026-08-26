import { Inject, Injectable } from "@nestjs/common";
import { PROFIL_REPOSITORY, type ProfilRepository } from "../../domain/repositories/profil.repository.js";
import { Profil } from "../../domain/entities/profil.entity.js";
import { ProfilIntrouvableError } from "../../domain/errors/profil-introuvable.error.js";

@Injectable()
export class GetProfilUseCase {
    constructor(
        @Inject(PROFIL_REPOSITORY)
        private readonly profilRepository: ProfilRepository
    ) {}

    async execute(): Promise<Profil> {
        const profil = await this.profilRepository.get();

        if (!profil) {
            throw new ProfilIntrouvableError();
        }

        return profil;
    }
}