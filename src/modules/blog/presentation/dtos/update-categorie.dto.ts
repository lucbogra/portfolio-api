import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCategorieDto {
    @IsString()
    @IsNotEmpty()
    nom!: string;
}