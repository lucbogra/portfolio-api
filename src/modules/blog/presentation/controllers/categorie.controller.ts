import { Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateCategorieUseCase } from "../../application/use-cases/create-categorie.use-case.js";
import { UpdateCategorieUseCase } from "../../application/use-cases/update-categorie.use-case.js";
import { GetCategorieBySlugUseCase } from "../../application/use-cases/get-categorie-by-slug.use-case.js";
import { ListCategorieUseCase } from "../../application/use-cases/list-categories.use-case.js";
import { DeleteCategorieUseCase } from "../../application/use-cases/delete-categorie.use-case.js";
import { AuthGuard } from "src/modules/auth/auth.guard.js";
import { CreateCategorieDto } from "../dtos/create-categorie.dto.js";
import { CategorieResourceDto } from "../dtos/categorie-response.dto.js";
import { SlugDejaUtiliseError } from "src/shared/domain/errors/slug-deja-utilise.error.js";
import { CategorieIntrouvableError } from "../../domain/errors/categorie-introuvable.error.js";
import { UpdateCategorieDto } from "../dtos/update-categorie.dto.js";
import { Categorie } from "../../domain/entities/categorie.entity.js";

@Controller('categories')
export class CategorieController {
    constructor(
        private readonly createCategorieUseCase: CreateCategorieUseCase,
        private readonly updateCategorieUseCase: UpdateCategorieUseCase,
        private readonly getCategorieBySlugUseCase: GetCategorieBySlugUseCase,
        private readonly listCategorieUsecase: ListCategorieUseCase,
        private readonly deleteCategorieUseCase: DeleteCategorieUseCase,
    ) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async create(@Body()dto: CreateCategorieDto): Promise<CategorieResourceDto> {
        try {
            const categorie = await this.createCategorieUseCase.execute({
                slug: dto.slug,
                nom: dto.nom
            });

            return CategorieResourceDto.fromDomain(categorie);
        } catch(error) {
            if(error instanceof SlugDejaUtiliseError) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get('/:slug')
    async getBySlug(@Param('slug')slug: string): Promise<CategorieResourceDto> {
        try {
            const raw = await this.getCategorieBySlugUseCase.execute(slug);
            return CategorieResourceDto.fromDomain(raw);
        } catch(error) {
            if(error instanceof CategorieIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Get()
    async list(): Promise<CategorieResourceDto[]> {
        const rows = await this.listCategorieUsecase.execute();
        return rows.map(CategorieResourceDto.fromDomain);
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', ParseUUIDPipe)id: string, @Body()dto: UpdateCategorieDto): Promise<CategorieResourceDto> {
        try {
            const categorie = await this.updateCategorieUseCase.execute({
                id: id,
                nom: dto.nom
            });

            return CategorieResourceDto.fromDomain(categorie);
        } catch(error) {
            if(error instanceof CategorieIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseUUIDPipe)id: string): Promise<void> {
        try {
            await this.deleteCategorieUseCase.execute(id);
        } catch(error) {
            if(error instanceof CategorieIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

   
}