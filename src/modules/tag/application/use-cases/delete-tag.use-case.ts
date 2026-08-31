import { Inject, Injectable } from "@nestjs/common";
import { TAG_REPOSITORY, type TagRepository } from "../../domain/repository/tag.repository.js";
import { TagId } from "../../domain/value-object/tag-id.value-object.js";
import { TagNonTrouve } from "../../domain/errors/tag-non-trouve.error.js";

@Injectable()
export class DeleteTagUseCase {
    constructor(
        @Inject(TAG_REPOSITORY)
        private readonly tagRepository: TagRepository
    ) {}

    async execute(id: string): Promise<void> {
        const tagId = TagId.create(id);
        const tag = await this.tagRepository.findById(tagId);

        if(!tag) {
            throw new TagNonTrouve(id);
        }

        await this.tagRepository.delete(tagId);
    }
}