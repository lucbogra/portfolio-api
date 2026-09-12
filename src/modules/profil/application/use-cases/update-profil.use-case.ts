import { Inject, Injectable } from "@nestjs/common";
import { PROFIL_REPOSITORY, type ProfilRepository } from "../../domain/repositories/profil.repository.js";
import { Profil } from "../../domain/entities/profil.entity.js";
import { Telephone } from "src/shared/domain/value-objects/telephone/telephone.value-object.js";
import { Lien } from "src/shared/domain/value-objects/lien/lien.value-object.js";

export interface UpdateProfilInput {
    titre: string;
    description: string;
    telephone: string;
    github: string | null;
    linkedin: string | null;
    pays: string;
    ville: string;
    adresse: string | null;
    disponible: boolean;
}

@Injectable()
export class UpdateProfilUseCase {
    constructor(
        @Inject(PROFIL_REPOSITORY)
        private readonly profilRepository: ProfilRepository
    ) {}

    async execute(input: UpdateProfilInput): Promise<Profil> {
        let profil = await this.profilRepository.get();

        const params = {
            titre: input.titre,
            description: input.description,
            telephone: Telephone.create(input.telephone),
            github: input.github ? Lien.create(input.github) : null,
            linkedin: input.linkedin ? Lien.create(input.linkedin) : null,
            pays: input.pays,
            ville: input.ville,
            adresse: input.adresse,
            disponible: input.disponible,
        };

        if (!profil) {
            profil = Profil.create(params);
        } else {
            profil.update(params);
        }

        await this.profilRepository.save(profil);

        return profil;
    }
}