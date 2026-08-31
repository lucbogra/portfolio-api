import { TagType as PrismaTagType } from "src/generated/prisma/enums.js";
import { TagType, TagTypeEnum } from "../../domain/value-object/tag-type.value-object.js";
import { Tag as PrismaTag } from "src/generated/prisma/client.js";
import { Tag } from "../../domain/entity/tag.entity.js";
import { TagId } from "../../domain/value-object/tag-id.value-object.js";

const DOMAIN_TO_PRISMA_TAG_TYPE: Record<TagTypeEnum, PrismaTagType> = {
    [TagTypeEnum.STACK]: PrismaTagType.STACK,
    [TagTypeEnum.SOFT_SKILL]: PrismaTagType.SOFT_SKILL,
    [TagTypeEnum.AUTRE]: PrismaTagType.AUTRE
};

const PRISMA_TO_DOMAIN_TAG_TYPE: Record<PrismaTagType, TagTypeEnum> = {
    [PrismaTagType.STACK]: TagTypeEnum.STACK,
    [PrismaTagType.SOFT_SKILL]: TagTypeEnum.SOFT_SKILL,
    [PrismaTagType.AUTRE]: TagTypeEnum.AUTRE
};

export class TagMapper {
    static toDomain(raw: PrismaTag): Tag {
        return Tag.create({
            id: TagId.create(raw.id),
            nom: raw.nom,
            type: TagType.create(PRISMA_TO_DOMAIN_TAG_TYPE[raw.type])
        });
    }

    static toPrisma(tag: Tag): PrismaTag {
        return {
            id: tag.id.toString(),
            nom: tag.nom,
            type: DOMAIN_TO_PRISMA_TAG_TYPE[tag.type.value]
        };
    }
}