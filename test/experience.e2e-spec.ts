import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/shared/infrastructure/prisma.service.js';

describe('ExperienceController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleRef.get(PrismaService);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD_PLAIN,
      });

    token = loginResponse.body.access_token;
  });

  afterEach(async () => {
    await prisma.taggable.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.experience.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /experiences', () => {
    it('retourne 401 sans token d\'authentification', async () => {
      const response = await request(app.getHttpServer())
        .post('/experiences')
        .send({
          slug: 'sans-auth',
          dateDebut: '2024-01-01',
          titre: 'Titre',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
        });

      expect(response.status).toBe(401);
    });

    it('crée une expérience et retourne 201 avec un token valide', async () => {
      const response = await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
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
      await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slug: 'slug-duplique',
          dateDebut: '2024-01-01',
          titre: 'Titre',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
        });

      const response = await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
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
      const response = await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slug: 'slug-incomplet',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /experiences', () => {
    it('ne nécessite pas de token (route publique)', async () => {
      const response = await request(app.getHttpServer()).get('/experiences');

      expect(response.status).toBe(200);
    });

    it('inclut les tags de chaque expérience, tableau vide si aucun tag', async () => {
      const sansTag = await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slug: 'experience-sans-tag',
          dateDebut: '2024-01-01',
          titre: 'Titre sans tag',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
        });

      const avecTag = await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slug: 'experience-avec-tag',
          dateDebut: '2024-01-01',
          titre: 'Titre avec tag',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
        });

      const tag = await request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'Tag e2e experience', type: 'stack' });

      await request(app.getHttpServer())
        .post(`/experiences/${avecTag.body.id}/tags`)
        .set('Authorization', `Bearer ${token}`)
        .send({ tagId: tag.body.id });

      const response = await request(app.getHttpServer()).get('/experiences');

      const foundAvecTag = response.body.find((e: { id: string }) => e.id === avecTag.body.id);
      const foundSansTag = response.body.find((e: { id: string }) => e.id === sansTag.body.id);

      expect(foundAvecTag).toBeDefined();
      expect(foundAvecTag.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: tag.body.id, nom: 'Tag e2e experience' }),
        ]),
      );

      expect(foundSansTag).toBeDefined();
      expect(foundSansTag.tags).toEqual([]);
    });
  });

  describe('GET /experiences/:slug', () => {
    it('retourne 404 si le slug n\'existe pas', async () => {
      const response = await request(app.getHttpServer()).get('/experiences/inexistant');

      expect(response.status).toBe(404);
    });

    it('retourne l\'expérience si le slug existe (sans token, route publique)', async () => {
      await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
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

  describe('PUT /experiences/:id', () => {
    it('retourne 401 sans token d\'authentification', async () => {
      const response = await request(app.getHttpServer())
        .put('/experiences/a3f5e8c2-1b4d-4f6a-9e7c-2d8b5a1f3c9e')
        .send({
          titre: 'Titre modifié',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
          dateDebut: '2024-01-01',
        });

      expect(response.status).toBe(401);
    });

    it('met à jour une expérience avec un token valide', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slug: 'mission-a-modifier',
          dateDebut: '2024-01-01',
          titre: 'Titre initial',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
        });

      const response = await request(app.getHttpServer())
        .put(`/experiences/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          titre: 'Titre modifié',
          entreprise: 'Entreprise',
          contexte: 'cdi',
          description: 'Description modifiée',
          dateDebut: '2024-01-01',
        });

      expect(response.status).toBe(200);
      expect(response.body.titre).toBe('Titre modifié');
      expect(response.body.contexte).toBe('cdi');
    });

    it('retourne 404 si l\'id n\'existe pas', async () => {
      const response = await request(app.getHttpServer())
        .put('/experiences/a3f5e8c2-1b4d-4f6a-9e7c-2d8b5a1f3c9e')
        .set('Authorization', `Bearer ${token}`)
        .send({
          titre: 'Titre',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
          dateDebut: '2024-01-01',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /experiences/:id', () => {
    it('retourne 401 sans token d\'authentification', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/experiences/a3f5e8c2-1b4d-4f6a-9e7c-2d8b5a1f3c9e',
      );

      expect(response.status).toBe(401);
    });

    it('retourne 404 si l\'id n\'existe pas', async () => {
      const response = await request(app.getHttpServer())
        .delete('/experiences/a3f5e8c2-1b4d-4f6a-9e7c-2d8b5a1f3c9e')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it('supprime une expérience existante et retourne 204', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/experiences')
        .set('Authorization', `Bearer ${token}`)
        .send({
          slug: 'mission-a-supprimer',
          dateDebut: '2024-01-01',
          titre: 'Titre',
          entreprise: 'Entreprise',
          contexte: 'freelance',
          description: 'Description',
        });

      const response = await request(app.getHttpServer())
        .delete(`/experiences/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
    });
  });
});