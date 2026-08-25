import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategorieDto {
    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsString()
    @IsNotEmpty()
    nom!: string;
}