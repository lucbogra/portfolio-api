import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { ContexteType } from "../../domain/value-objects/contexte.value-object.js";

export class CreateExperienceDto {
    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsDateString()
    dateDebut!: string;

    @IsOptional()
    @IsDateString()
    dateFin?: string;

    @IsString()
    @IsNotEmpty()
    titre!: string;

    @IsString()
    @IsNotEmpty()
    entreprise!: string;

    @IsEnum(ContexteType)
    contexte!: ContexteType;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsOptional()
    @IsUrl()
    lienDemo?: string;
}