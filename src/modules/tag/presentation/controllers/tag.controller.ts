import { Body, ConflictException, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CreateTagUseCase } from "../../application/use-cases/create-tag.use-case.js";
import { UpdateTagUseCase } from "../../application/use-cases/update-tag.use-case.js";
import { ListTagsUseCase } from "../../application/use-cases/list-tags.use-case.js";
import { DeleteTagUseCase } from "../../application/use-cases/delete-tag.use-case.js";
import { GetTagByIdUseCase } from "../../application/use-cases/get-tag-by-id.use-case.js";
import { AuthGuard } from "src/modules/auth/auth.guard.js";
import { CreateTagDto } from "../dtos/create-tag.dto.js";
import { TagResponseDto } from "../dtos/tag-response.dto.js";
import { NomDejaUtilise } from "../../domain/errors/nom-deja-utilise.error.js";
import { TagNonTrouve } from "../../domain/errors/tag-non-trouve.error.js";
import { UpdateTagDto } from "../dtos/update-tag.dto.js";

@Controller('tags')
export class TagController {
    constructor(
        private readonly createTagUseCase: CreateTagUseCase,
        private readonly updateTagUseCase: UpdateTagUseCase,
        private readonly listTagUseCase: ListTagsUseCase,
        private readonly getTagByIduseCase: GetTagByIdUseCase,
        private readonly deleteTaguseCase: DeleteTagUseCase
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async create(@Body()dto: CreateTagDto): Promise<TagResponseDto> {
        try {
            const tag = await this.createTagUseCase.execute({
                nom: dto.nom,
                type: dto.type
            });

            return TagResponseDto.fromDomain(tag);
        } catch(error) {
            if(error instanceof NomDejaUtilise) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Get()
    async list(): Promise<TagResponseDto[]> {
        const rows = await this.listTagUseCase.execute();

        return rows.map(TagResponseDto.fromDomain);
    }

    @Get('/:id')
    async getById(@Param('id', ParseUUIDPipe)id: string): Promise<TagResponseDto> {
        try {
            const tag = await this.getTagByIduseCase.execute(id);
            return TagResponseDto.fromDomain(tag);
        } catch(error) {
            if(error instanceof TagNonTrouve) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @Put('/:id')
    @UseGuards(AuthGuard)
    async update(@Param('id', ParseUUIDPipe)id: string, @Body()dto: UpdateTagDto): Promise<TagResponseDto> {
        try {
            const tag = await this.updateTagUseCase.execute({
                id: id,
                nom: dto.nom,
                type: dto.type
            });

            return TagResponseDto.fromDomain(tag);
        } catch(error) {
            if(error instanceof TagNonTrouve) {
                throw new NotFoundException(error.message);
            }
            if(error instanceof NomDejaUtilise) {
                throw new ConflictException(error.message);
            }
            throw error;
        }
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseUUIDPipe)id: string): Promise<void> {
        try {
            await this.deleteTaguseCase.execute(id);
        } catch(error) {
            if(error instanceof TagNonTrouve) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}