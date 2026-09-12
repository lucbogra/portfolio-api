import { Module } from '@nestjs/common';
import { UploadController } from './presentation/controllers/upload.controller.js';
import { CloudinaryService } from 'src/shared/infrastructure/cloudinary.service.js';

@Module({
  controllers: [UploadController],
  providers: [CloudinaryService],
})
export class MediaModule {}
