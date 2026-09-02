import { Tag } from "../entity/tag.entity.js";
import { TagId } from "../value-object/tag-id.value-object.js";
import { TaggableTypeEnum } from "../value-object/taggable-type.value-object.js";

export interface TaggingRepository {
  attach(tagId: TagId, taggableType: TaggableTypeEnum, taggableId: string): Promise<void>;
  detach(tagId: TagId, taggableType: TaggableTypeEnum, taggableId: string): Promise<void>;
  findTagsFor(taggableType: TaggableTypeEnum, taggableId: string): Promise<Tag[]>;
}

export const TAGGING_REPOSITORY = Symbol('TAGGING_REPOSITORY');