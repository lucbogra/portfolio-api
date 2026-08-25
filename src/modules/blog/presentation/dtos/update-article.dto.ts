import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { StatutArticleType } from "../../domain/value-objects/statut-article.value-object.js";

export class UpdateArticleDto {
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