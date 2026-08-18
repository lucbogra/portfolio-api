import { IsString, IsNotEmpty, IsEnum, IsDateString, IsOptional, IsUrl } from 'class-validator';
import { ContexteType } from 'src/modules/experience/domain/value-objects/contexte.value-object.js';

export class UpdateExperienceDto {
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

  @IsDateString()
  dateDebut!: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;

  @IsOptional()
  @IsUrl()
  lienDemo?: string;
}