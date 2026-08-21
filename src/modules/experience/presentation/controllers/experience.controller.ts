import { Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateExperienceInput, CreateExperienceUseCase } from "../../application/use-cases/create-experience.use-case.js";
import { GetExperienceBySlugUseCase } from "../../application/use-cases/get-experience-by-slug.use-case.js";
import { UpdateExperienceUseCase } from "../../application/use-cases/update-experience.use-case.js";
import { ListExperiencesUseCase } from "../../application/use-cases/list-experiences.use-case.js";
import { DeleteExperienceUseCase } from "../../application/use-cases/delete-experience.use-case.js";
import { CreateExperienceDto } from "../dtos/create-experience.dto.js";
import { ExperienceResponseDto } from "../dtos/experience-response.dto.js";
import { SlugDejaUtiliseError } from "src/shared/domain/errors/slug-deja-utilise.error.js";
import { ExperienceIntrouvableError } from "../../domain/errors/experience-introuvable.error.js";
import { UpdateExperienceDto } from "../dtos/update-experience.dto.js";
import { AuthGuard } from "src/modules/auth/auth.guard.js";

@Controller('experiences')
export class ExperienceController {
    constructor(
        private readonly createExperienceUseCase: CreateExperienceUseCase,
        private readonly listExperiencesUseCase: ListExperiencesUseCase,
        private readonly getExperienceBySlugUseCase: GetExperienceBySlugUseCase,
        private readonly updateExperienceUseCase: UpdateExperienceUseCase,
        private readonly deleteExperienceUseCase: DeleteExperienceUseCase,
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateExperienceDto): Promise<ExperienceResponseDto> {
        try {
            const data: CreateExperienceInput = {
                slug: dto.slug,
                dateDebut: new Date(dto.dateDebut),
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
                titre: dto.titre,
                entreprise: dto.entreprise,
                contexte: dto.contexte,
                description: dto.description,
                lienDemo: dto.lienDemo ?? null
            };
    
            const experience = await this.createExperienceUseCase.execute(data);
    
            return ExperienceResponseDto.fromDomain(experience);
        } catch (error) {
            if(error instanceof SlugDejaUtiliseError) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
        
    }

    @Get()
    async list(): Promise<ExperienceResponseDto[]> {
        const experiences = await this.listExperiencesUseCase.execute();
        return experiences.map(ExperienceResponseDto.fromDomain);
    }

    @Get('/:slug')
    async getBySlug(@Param('slug') slug: string): Promise<ExperienceResponseDto> {
        try {
            const raw = await this.getExperienceBySlugUseCase.execute(slug);
            return ExperienceResponseDto.fromDomain(raw);
        } catch (error) {
            if(error instanceof ExperienceIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', ParseUUIDPipe) id:string, @Body() dto: UpdateExperienceDto): Promise<ExperienceResponseDto> {
        try {
            const raw = await this.updateExperienceUseCase.execute({
                id: id,
                titre: dto.titre,
                entreprise: dto.entreprise,
                contexte: dto.contexte,
                description: dto.description,
                dateDebut: new Date(dto.dateDebut),
                dateFin: dto.dateFin ? new Date(dto.dateFin) : null,
                lienDemo: dto.lienDemo ?? null
            })

            return ExperienceResponseDto.fromDomain(raw);
        } catch (error) {
            if(error instanceof ExperienceIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        try {
            await this.deleteExperienceUseCase.execute(id);
        } catch (error) {
            if(error instanceof ExperienceIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}