import { Inject, Injectable } from "@nestjs/common";
import { TAG_REPOSITORY, type TagRepository } from "../../domain/repository/tag.repository.js";
import { Tag } from "../../domain/entity/tag.entity.js";

@Injectable()
export class ListTagsUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: TagRepository
    ) {}

    async execute(): Promise<Tag[]> {
        return await this.tagRepository.findAll();
    }
}