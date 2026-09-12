import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProfilDto {
    @IsString()
    @IsNotEmpty()
    titre!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    telephone!: string;

    @IsOptional()
    @IsUrl()
    github?: string;

    @IsOptional()
    @IsUrl()
    linkedin?: string;

    @IsString()
    @IsNotEmpty()
    pays!: string;

    @IsString()
    @IsNotEmpty()
    ville!: string;

    @IsOptional()
    @IsString()
    adresse?: string;

    @IsOptional()
    @IsBoolean()
    disponible?: boolean;
}