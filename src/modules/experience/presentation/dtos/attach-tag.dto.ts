import { IsNotEmpty, IsString } from 'class-validator';

export class AttachTagDto {
  @IsString()
  @IsNotEmpty()
  tagId!: string;
}