import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/shared/infrastructure/prisma.service.js';

describe('ExperienceController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleRef.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.experience.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /experiences', () => {
    it('crée une expérience et retourne 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/experiences')
        .send({
          slug: 'mission-e2e-test',
          dateDebut: '2024-01-01',
          dateFin: '2024-12-31',
          titre: 'Titre Test',
          entreprise: 'Entreprise Test',
          contexte: 'freelance',
          description: 'Description test',
          lienDemo: null,
        });

      expect(response.status).toBe(201);
      expect(response.body.slug).toBe('mission-e2e-test');
      expect(response.body.contexte).toBe('freelance');
    });

    it('retourne 409 si le slug existe déjà', async () => {
      await request(app.getHttpServer()).post('/experiences').send({
        slug: 'slug-duplique',
        dateDebut: '2024-01-01',
        titre: 'Titre',
        entreprise: 'Entreprise',
        contexte: 'freelance',
        description: 'Description',
      });

      const response = await request(app.getHttpServer()).post('/experiences').send({
        slug: 'slug-duplique',
        dateDebut: '2024-01-01',
        titre: 'Autre titre',
        entreprise: 'Autre entreprise',
        contexte: 'cdi',
        description: 'Autre description',
      });

      expect(response.status).toBe(409);
    });

    it('retourne 400 si un champ requis est manquant', async () => {
      const response = await request(app.getHttpServer()).post('/experiences').send({
        slug: 'slug-incomplet',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /experiences/:slug', () => {
    it('retourne 404 si le slug n\'existe pas', async () => {
      const response = await request(app.getHttpServer()).get('/experiences/inexistant');

      expect(response.status).toBe(404);
    });

    it('retourne l\'expérience si le slug existe', async () => {
      await request(app.getHttpServer()).post('/experiences').send({
        slug: 'mission-a-retrouver',
        dateDebut: '2024-01-01',
        titre: 'Titre',
        entreprise: 'Entreprise',
        contexte: 'freelance',
        description: 'Description',
      });

      const response = await request(app.getHttpServer()).get('/experiences/mission-a-retrouver');

      expect(response.status).toBe(200);
      expect(response.body.slug).toBe('mission-a-retrouver');
    });
  });

  describe('DELETE /experiences/:id', () => {
    it('retourne 404 si l\'id n\'existe pas', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/experiences/a3f5e8c2-1b4d-4f6a-9e7c-2d8b5a1f3c9e',
      );

      expect(response.status).toBe(404);
    });
  });
});