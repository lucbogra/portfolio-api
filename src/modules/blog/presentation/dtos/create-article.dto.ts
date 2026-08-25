import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
    @IsNotEmpty()
    @IsString()
    slug!: string;

    @IsNotEmpty()
    @IsString()
    categorieId!: string;

    @IsNotEmpty()
    @IsString()
    nom!: string;

    @IsNotEmpty()
    @IsString()
    contenu!: string;

    @IsOptional()
    @IsString()
    image?: string;
}