import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class UpdateProjetDto{
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
    dateFin?: string;

    @IsString()
    @IsNotEmpty()
    details!: string;

    @IsOptional()
    @IsString()
    image!: string;

    @IsOptional()
    @IsUrl()
    github?: string;

    @IsOptional()
    @IsUrl()
    lienDemo?: string;
}