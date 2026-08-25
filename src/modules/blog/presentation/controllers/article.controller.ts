import { BadRequestException, Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateArticleUseCase } from "../../application/use-cases/create-article.use-case.js";
import { UpdateArticleUseCase } from "../../application/use-cases/update-article.use-case.js";
import { ListArticleUseCase } from "../../application/use-cases/list-articles.use-case.js";
import { GetArticleBySlugUseCase } from "../../application/use-cases/get-article-by-slug.use-case.js";
import { DeleteArticleUseCase } from "../../application/use-cases/delete-article.use-case.js";
import { AuthGuard } from "src/modules/auth/auth.guard.js";
import { CreateArticleDto } from "../dtos/create-article.dto.js";
import { ArticleResponseDto } from "../dtos/article-response.dto.js";
import { SlugDejaUtiliseError } from "src/shared/domain/errors/slug-deja-utilise.error.js";
import { CategorieIntrouvableError } from "../../domain/errors/categorie-introuvable.error.js";
import { ArticleIntrouvableError } from "../../domain/errors/article-introuvable.error.js";
import { UpdateArticleDto } from "../dtos/update-article.dto.js";
import { SwitchArticleStatutUseCase } from "../../application/use-cases/switch-article-statut.use-case.js";
import { SwitchArticleStatutDto } from "../dtos/switch-article-statut.dto.js";
import { TransitionStatutInvalideError } from "../../domain/errors/transition-statut-invalide.error.js";
import { GetArticlesByCategorieUseCase } from "../../application/use-cases/get-articles-by-categorie.use-case.js";

@Controller('articles')
export class ArticleController {
    constructor(
        private readonly createArticleUseCase: CreateArticleUseCase,
        private readonly updateArticleUseCase: UpdateArticleUseCase,
        private readonly listArticleUseCase: ListArticleUseCase,
        private readonly getArticleBySlugUseCase: GetArticleBySlugUseCase,
        private readonly deleteArticleUseCase: DeleteArticleUseCase,
        private readonly switchArticleStatutUseCase: SwitchArticleStatutUseCase,
        private readonly getArticlesByCategorieUseCase: GetArticlesByCategorieUseCase
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body()dto: CreateArticleDto): Promise<ArticleResponseDto> {
        try {
            const article = await this.createArticleUseCase.execute({
                slug: dto.slug,
                categorieId: dto.categorieId,
                nom: dto.nom,
                contenu: dto.contenu,
                image: dto.image ?? null,
            });

            return ArticleResponseDto.fromDomain(article);
        } catch(error) {
            if(error instanceof SlugDejaUtiliseError) {
                throw new ConflictException(error.message);
            }
            if(error instanceof CategorieIntrouvableError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Get('/categorie/:categorieId')
    async getByCategorie(@Param('categorieId')categorieId: string): Promise<ArticleResponseDto[]> {
        const rows = await this.getArticlesByCategorieUseCase.execute(categorieId);

        return rows.map(ArticleResponseDto.fromDomain);
    }

    @Get('/:slug') 
    async getBySlug(@Param('slug')slug: string): Promise<ArticleResponseDto> {
        try {
            const article = await this.getArticleBySlugUseCase.execute(slug);
            return ArticleResponseDto.fromDomain(article);
        } catch (error) {
            if(error instanceof ArticleIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Get()
    async list(): Promise<ArticleResponseDto[]> {
        const rows = await this.listArticleUseCase.execute();
        return  rows.map(ArticleResponseDto.fromDomain);
    }

    @Put('/statut/:id')
    @UseGuards(AuthGuard)
    async switchStatut(@Param('id', ParseUUIDPipe)id: string, @Body()dto: SwitchArticleStatutDto): Promise<ArticleResponseDto> {
        try {
            const article = await this.switchArticleStatutUseCase.execute({
                id: id,
                statut: dto.statut
            });

            return ArticleResponseDto.fromDomain(article);
        } catch(error) {
            if(error instanceof ArticleIntrouvableError) {
                throw new NotFoundException(error.message);
            }

            if(error instanceof TransitionStatutInvalideError) {
                throw new BadRequestException(error.message);
            }

            throw error;
        }
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', ParseUUIDPipe)id: string, @Body()dto: UpdateArticleDto): Promise<ArticleResponseDto> {
        try {
            const article = await this.updateArticleUseCase.execute({
                id: id,
                categorieId: dto.categorieId,
                nom: dto.nom,
                contenu: dto.contenu,
                image: dto.image ?? null
            });

            return ArticleResponseDto.fromDomain(article);
        } catch(error) {
            if(error instanceof ArticleIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            if(error instanceof CategorieIntrouvableError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    async delete(@Param('id', ParseUUIDPipe)id: string): Promise<void> {
        try {
            await this.deleteArticleUseCase.execute(id);
        } catch(error) {
            if(error instanceof ArticleIntrouvableError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}