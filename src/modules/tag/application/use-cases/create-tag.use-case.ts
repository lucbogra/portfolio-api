import { Inject, Injectable } from "@nestjs/common";
import { TAG_REPOSITORY, type TagRepository } from "../../domain/repository/tag.repository.js";
import { TagType, TagTypeEnum } from "../../domain/value-object/tag-type.value-object.js";
import { Tag } from "../../domain/entity/tag.entity.js";
import { TagId } from "../../domain/value-object/tag-id.value-object.js";

export interface CreateTagInput {
    nom : string;
    type : TagTypeEnum;
}

@Injectable()
export class CreateTagUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: TagRepository
    ) {}

    async execute(input: CreateTagInput): Promise<Tag> {
        const tag = Tag.create({
            id: TagId.generate(),
            nom: input.nom,
            type: TagType.create(input.type)
        });

        await this.tagRepository.save(tag);

        return tag;
    }
}