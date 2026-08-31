import { Tag } from "../entity/tag.entity.js";
import { TagId } from "../value-object/tag-id.value-object.js";

export interface TagRepository {
    save(tag: Tag): Promise<void>;
    findById(tagId: TagId): Promise<Tag | null>;
    findAll(): Promise<Tag[]>;
    delete(tagId: TagId): Promise<void>;
}

export const TAG_REPOSITORY = Symbol('TAG_REPOSITORY');