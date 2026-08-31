import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TagTypeEnum } from "../../domain/value-object/tag-type.value-object.js";

export class UpdateTagDto {
    @IsNotEmpty()
    @IsString()
    nom!: string;

    @IsNotEmpty()
    @IsEnum(TagTypeEnum)
    type!: TagTypeEnum
}