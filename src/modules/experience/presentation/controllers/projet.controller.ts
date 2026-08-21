import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateProjetUseCase } from "../../application/use-cases/create-projet.use-case.js";
import { GetProjetBySlugUseCase } from "../../application/use-cases/get-projet-by-slug.use-case.js";
import { UpdateProjetUseCase } from "../../application/use-cases/update-projet.use-case.js";
import { DeleteProjetUseCase } from "../../application/use-cases/delete-projet.use-case.js";
import { ListProjetsUseCase } from "../../application/use-cases/list-projets.use-case.js";
import { ProjetResponse } from "../dtos/projet-response.dto.js";
import { CreateProjetDto } from "../dtos/create-projet.dto.js";
import { SlugDejaUtiliseError } from "src/shared/domain/errors/slug-deja-utilise.error.js";
import { ProjetIntrouvableError } from "../../domain/errors/projet-introuvable.error.js";
import { UpdateProjetDto } from "../dtos/update-projet.dto.js";
import { ExperienceIntrouvableError } from "../../domain/errors/experience-introuvable.error.js";
import { AuthGuard } from "src/modules/auth/auth.guard.js";
import { ListProjetsAutonomesUseCase } from "../../application/use-cases/list-projets-autonomes.use-case.js";
import { ListProjetsByExperienceUseCase } from "../../application/use-cases/list-projets-by-experience.use-case.js";

@Controller('projets')
export class ProjetController {
    constructor(
        private readonly createProjetUseCase: CreateProjetUseCase,
        private readonly getProjetBySlugUseCase: GetProjetBySlugUseCase,
        private readonly listProjetsUseCase: ListProjetsUseCase,
        private readonly updateProjetUseCase: UpdateProjetUseCase,
        private readonly deleteProjetUseCase: DeleteProjetUseCase,
        private readonly listProjetsAutonomesUseCase: ListProjetsAutonomesUseCase,
        private readonly listProjetsByExperienceuseCase: ListProjetsByExperienceUseCase
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateProjetDto): Promise<ProjetResponse> {
        try {
            const projet = await this.createProjetUseCase.execute({
                slug : dto.slug,
                experienceId: dto.experienceId ?? null,
                nom: dto.nom,
                dateDebut: new Date(dto.dateDebut),
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
                details: dto.details,
                image: dto.image ?? null,
                github: dto.github ?? null,
                lienDemo: dto.lienDemo ?? null,
            });

            return ProjetResponse.fromDomain(projet);
        } catch(error) {
            if(error instanceof SlugDejaUtiliseError) {
                throw new ConflictException(error.message);
            }
            if(error instanceof ExperienceIntrouvableError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Get()
    async list(): Promise<ProjetResponse[]> {
        const projets = await this.listProjetsUseCase.execute();
        return projets.map(ProjetResponse.fromDomain);
    }

    @Get('/autonomes')
    async getAutonomes(): Promise<ProjetResponse[]> {
        const projets = await this.listProjetsAutonomesUseCase.execute();

        return projets.map(ProjetResponse.fromDomain);
    }

    @Get('/experience/:experienceId')
    async getByExperience(@Param('experienceId', ParseUUIDPipe)experienceId: string): Promise<ProjetResponse[]> {
        const projets = await this.listProjetsByExperienceuseCase.execute(experienceId);

        return projets.map(ProjetResponse.fromDomain);
    }

    @Get('/:slug')
    async getBySlug(@Param('slug') slug: string): Promise<ProjetResponse> {
        try {
            const projet = await this.getProjetBySlugUseCase.execute(slug);
            return ProjetResponse.fromDomain(projet);
        } catch (error) {
            if(error instanceof ProjetIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
        
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', ParseUUIDPipe)id: string, @Body()dto: UpdateProjetDto): Promise<ProjetResponse> {
        try {
            const projet = await this.updateProjetUseCase.execute({
                id: id,
                experienceId: dto.experienceId ?? null,
                nom: dto.nom,
                dateDebut: new Date(dto.dateDebut),
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
                details: dto.details,
                github: dto.github ?? null,
                image: dto.image,
                lienDemo: dto.lienDemo ?? null
            });

            return ProjetResponse.fromDomain(projet);
        } catch (error) {
            if(error instanceof ProjetIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            if(error instanceof ExperienceIntrouvableError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseUUIDPipe)id: string): Promise<void> {
        try {
            await this.deleteProjetUseCase.execute(id);
        } catch (error) {
            if(error instanceof ProjetIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}