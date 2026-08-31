import { Tag } from "../../domain/entity/tag.entity.js";
import { TagTypeEnum } from "../../domain/value-object/tag-type.value-object.js";

export class TagResponseDto {
    id!: string;
    nom!: string;
    type!: TagTypeEnum;

    static fromDomain(tag: Tag): TagResponseDto {
        const dto = new TagResponseDto();
        dto.id = tag.id.toString();
        dto.nom = tag.nom;
        dto.type = tag.type.value;

        return dto;
    }
}