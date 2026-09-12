import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Length, MaxLength, ValidateIf } from "class-validator";

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

    // `resume` omis (undefined) est laissé passer même si enAvant est activé :
    // l'update use case reconstitue l'état final avec le resume déjà en base
    // avant de laisser l'entité vérifier l'invariante. Seule une valeur
    // explicitement fournie (y compris vide) est validée ici.
    @ValidateIf((o: UpdateProjetDto) => o.enAvant === true && o.resume !== undefined)
    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    resume?: string;

    @IsOptional()
    @IsString()
    image!: string;

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