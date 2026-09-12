import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateExperienceInput, CreateExperienceUseCase } from "../../application/use-cases/create-experience.use-case.js";
import { GetExperienceBySlugUseCase } from "../../application/use-cases/get-experience-by-slug.use-case.js";
import { UpdateExperienceUseCase } from "../../application/use-cases/update-experience.use-case.js";
import { ListExperiencesAvecTagsUseCase } from "../../application/use-cases/list-experiences-avec-tags.use-case.js";
import { DeleteExperienceUseCase } from "../../application/use-cases/delete-experience.use-case.js";
import { CreateExperienceDto } from "../dtos/create-experience.dto.js";
import { ExperienceResponseDto } from "../dtos/experience-response.dto.js";
import { ExperienceAvecTagsResponseDto } from "../dtos/experience-avec-tags-response.dto.js";
import { SlugDejaUtiliseError } from "src/shared/domain/errors/slug-deja-utilise.error.js";
import { ExperienceIntrouvableError } from "../../domain/errors/experience-introuvable.error.js";
import { UpdateExperienceDto } from "../dtos/update-experience.dto.js";
import { AuthGuard } from "src/modules/auth/auth.guard.js";
import { AttachTagDto } from "../dtos/attach-tag.dto.js";
import { AttachTagUseCase } from "src/modules/tag/application/use-cases/attach-tag.use-case.js";
import { DetachTagUseCase } from "src/modules/tag/application/use-cases/detach-tag.use-case.js";
import { ListTagsForEntityUseCase } from "src/modules/tag/application/use-cases/list-tags-for-entity.use-case.js";
import { TaggableTypeEnum } from "src/modules/tag/domain/value-object/taggable-type.value-object.js";
import { TagIntrouvableError } from "src/modules/tag/domain/errors/tag-introuvable.error.js";
import { TagDejaAttacheError } from "src/modules/tag/domain/errors/tag-deja-attache.error.js";
import { AttachementIntrouvableError } from "src/modules/tag/domain/errors/attachement-introuvable.error.js";
import { TagResponseDto } from "src/modules/tag/presentation/dtos/tag-response.dto.js";

@Controller('experiences')
export class ExperienceController {
    constructor(
        private readonly createExperienceUseCase: CreateExperienceUseCase,
        private readonly listExperiencesAvecTagsUseCase: ListExperiencesAvecTagsUseCase,
        private readonly getExperienceBySlugUseCase: GetExperienceBySlugUseCase,
        private readonly updateExperienceUseCase: UpdateExperienceUseCase,
        private readonly deleteExperienceUseCase: DeleteExperienceUseCase,
        private readonly attachTagUseCase: AttachTagUseCase,
        private readonly detachTagUseCase: DetachTagUseCase,
        private readonly listTagsForEntityUseCase: ListTagsForEntityUseCase,
    ) { }

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
            if (error instanceof SlugDejaUtiliseError) {
                throw new ConflictException(error.message);
            }
            throw error;
        }

    }

    @Get()
    async list(): Promise<ExperienceAvecTagsResponseDto[]> {
        const experiences = await this.listExperiencesAvecTagsUseCase.execute();
        return experiences.map(ExperienceAvecTagsResponseDto.fromReadModel);
    }

    @Get('/:slug')
    async getBySlug(@Param('slug') slug: string): Promise<ExperienceResponseDto> {
        try {
            const raw = await this.getExperienceBySlugUseCase.execute(slug);
            return ExperienceResponseDto.fromDomain(raw);
        } catch (error) {
            if (error instanceof ExperienceIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateExperienceDto): Promise<ExperienceResponseDto> {
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
            if (error instanceof ExperienceIntrouvableError) {
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
            if (error instanceof ExperienceIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Post('/:id/tags')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async attachTag(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AttachTagDto): Promise<void> {
        try {
            await this.attachTagUseCase.execute({
                tagId: dto.tagId,
                taggableType: TaggableTypeEnum.EXPERIENCE,
                taggableId: id,
            });
        } catch (error) {
            if (error instanceof TagIntrouvableError) {
                throw new BadRequestException(error.message);
            }
            if (error instanceof TagDejaAttacheError) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Delete('/:id/tags/:tagId')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async detachTag(@Param('id', ParseUUIDPipe) id: string,@Param('tagId', ParseUUIDPipe) tagId: string): Promise<void> {
        try {
            await this.detachTagUseCase.execute({
                tagId,
                taggableType: TaggableTypeEnum.EXPERIENCE,
                taggableId: id,
            });
        } catch (error) {
            if (error instanceof AttachementIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Get('/:id/tags')
    async listTags(@Param('id', ParseUUIDPipe) id: string): Promise<TagResponseDto[]> {
        const tags = await this.listTagsForEntityUseCase.execute(
            TaggableTypeEnum.EXPERIENCE,
            id,
        );
        return tags.map(TagResponseDto.fromDomain);
    }

}