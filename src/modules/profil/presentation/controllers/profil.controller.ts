import { Body, Controller, Get, NotFoundException, Put, UseGuards } from "@nestjs/common";
import { GetProfilUseCase } from "../../application/use-cases/get-profil.use-case.js";
import { UpdateProfilUseCase } from "../../application/use-cases/update-profil.use-case.js";
import { UpdateProfilDto } from "../dtos/update-profil.dto.js";
import { ProfilResponseDto } from "../dtos/profil-response.dto.js";
import { AuthGuard } from "src/modules/auth/auth.guard.js";
import { ProfilIntrouvableError } from "../../domain/errors/profil-introuvable.error.js";

@Controller('profil')
export class ProfilController {
    constructor(
        private readonly getProfilUseCase: GetProfilUseCase,
        private readonly updateProfilUseCase: UpdateProfilUseCase,
    ) {}

    @Get()
    async get(): Promise<ProfilResponseDto> {
        try {
            const profil = await this.getProfilUseCase.execute();
            return ProfilResponseDto.fromDomain(profil);
        } catch (error) {
            if (error instanceof ProfilIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Put()
    @UseGuards(AuthGuard)
    async update(@Body() dto: UpdateProfilDto): Promise<ProfilResponseDto> {
        const profil = await this.updateProfilUseCase.execute({
            titre: dto.titre,
            description: dto.description,
            telephone: dto.telephone,
            github: dto.github ?? null,
            linkedin: dto.linkedin ?? null,
            pays: dto.pays,
            ville: dto.ville,
            adresse: dto.adresse ?? null,
        });

        return ProfilResponseDto.fromDomain(profil);
    }
}