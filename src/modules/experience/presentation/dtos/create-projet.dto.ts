import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Length, MaxLength, ValidateIf } from "class-validator";

export class CreateProjetDto{
    @IsString()
    @IsNotEmpty()
    slug!: string;

    @IsOptional()
    @IsString()
    experienceId?: string;

    @IsString()
    @IsNotEmpty()
    @Length(5)
    nom!: string;

    @IsDateString()
    @IsNotEmpty()
    dateDebut!: string;

    @IsOptional()
    @IsDateString()
    dateFin!: string;

    @IsString()
    @IsNotEmpty()
    details!: string;

    @ValidateIf((o: CreateProjetDto) => o.enAvant === true)
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    resume?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsUrl()
    github?: string;

    @IsOptional()
    @IsUrl()
    lienDemo?: string;

    @IsOptional()
    @IsBoolean()
    enAvant?: boolean;

    @IsOptional()
    @IsInt()
    ordreAffichage?: number;
}