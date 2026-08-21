import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/shared/infrastructure/prisma.module.js';
import { ExperienceModule } from 'src/modules/experience/experience.module.js';
import { BlogModule } from 'src/modules/blog/blog.module.js';
import { ProfilModule } from 'src/modules/profil/profil.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env', }),
    PrismaModule,
    AuthModule,
    ExperienceModule,
    BlogModule,
    ProfilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
