import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/modules/auth/auth.guard.js';
import { CloudinaryService } from 'src/shared/infrastructure/cloudinary.service.js';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Controller('uploads')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_BYTES } }),
  )
  async uploadImage(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const url = await this.cloudinaryService.uploadImage(file.buffer);

    return { url };
  }
}
