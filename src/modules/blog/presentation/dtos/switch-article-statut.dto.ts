import { IsEnum, IsNotEmpty } from "class-validator";
import { StatutArticleType } from "../../domain/value-objects/statut-article.value-object.js";

export class SwitchArticleStatutDto {
    @IsNotEmpty()
    @IsEnum(StatutArticleType)
    statut!: StatutArticleType;
}