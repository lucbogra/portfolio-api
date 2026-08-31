import { Inject, Injectable } from "@nestjs/common";
import { TAG_REPOSITORY, type TagRepository } from "../../domain/repository/tag.repository.js";
import { TagType, TagTypeEnum } from "../../domain/value-object/tag-type.value-object.js";
import { Tag } from "../../domain/entity/tag.entity.js";
import { TagId } from "../../domain/value-object/tag-id.value-object.js";
import { TagNonTrouve } from "../../domain/errors/tag-non-trouve.error.js";

export interface UpdateTagInput {
    id: string,
    nom : string;
    type : TagTypeEnum;
}

@Injectable()
export class UpdateTagUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: TagRepository
    ) {}

    async execute(input: UpdateTagInput): Promise<Tag> {
        const tagId = TagId.create(input.id);
        const tag = await this.tagRepository.findById(tagId);

        if(!tag) {
            throw new TagNonTrouve(input.id);
        }

        tag.update({
            nom: input.nom,
            type: TagType.create(input.type)
        });

        await this.tagRepository.save(tag);

        return tag;
    }
}