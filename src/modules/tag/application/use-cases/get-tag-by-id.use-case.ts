import { Inject, Injectable } from "@nestjs/common";
import { TAG_REPOSITORY, type TagRepository } from "../../domain/repository/tag.repository.js";
import { Tag } from "../../domain/entity/tag.entity.js";
import { TagId } from "../../domain/value-object/tag-id.value-object.js";
import { TagNonTrouve } from "../../domain/errors/tag-non-trouve.error.js";

@Injectable()
export class GetTagByIdUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: TagRepository
    ) {}

    async execute(id: string): Promise<Tag> {
        const tag = await this.tagRepository.findById(TagId.create(id));

        if(!tag) {
            throw new TagNonTrouve(id);
        }

        return tag;
    }
}