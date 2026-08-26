import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from 'supertest';
import { AppModule } from "src/app.module.js";
import { PrismaService } from "src/shared/infrastructure/prisma.service.js";

describe('CategorieController (e2e)', () => {
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

    afterAll(async () => {
        await prisma.article.deleteMany();
        await prisma.categorie.deleteMany();
        await app.close();
    });

    describe('POST /categories', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const response = await request(app.getHttpServer())
                .post('/categories')
                .send({
                    slug: 'categorie-sans-auth',
                    nom: 'Catégorie sans auth',
                });

            expect(response.status).toBe(401);
        });

        it('crée une catégorie et retourne 201', async () => {
            const response = await request(app.getHttpServer())
                .post('/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'architecture-logicielle',
                    nom: 'Architecture Logicielle',
                });

            expect(response.status).toBe(201);
            expect(response.body.slug).toBe('architecture-logicielle');
            expect(response.body.nom).toBe('Architecture Logicielle');
        });

        it('lève 409 si le slug existe déjà', async () => {
            await request(app.getHttpServer())
                .post('/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'slug-categorie-duplique',
                    nom: 'Première catégorie',
                });

            const response = await request(app.getHttpServer())
                .post('/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'slug-categorie-duplique',
                    nom: 'Deuxième catégorie',
                });

            expect(response.status).toBe(409);
        });

        it('lève 400 si un champ requis est manquant', async () => {
            const response = await request(app.getHttpServer())
                .post('/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'categorie-incomplete',
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /categories', () => {
        it('retourne la liste des catégories', async () => {
            const response = await request(app.getHttpServer()).get('/categories');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /categories/:slug', () => {
        it('retourne 404 si le slug n\'existe pas', async () => {
            const response = await request(app.getHttpServer()).get('/categories/inexistante');

            expect(response.status).toBe(404);
        });

        it('retourne la catégorie si le slug existe (sans token, route publique)', async () => {
            const response = await request(app.getHttpServer()).get('/categories/architecture-logicielle');

            expect(response.status).toBe(200);
            expect(response.body.slug).toBe('architecture-logicielle');
        });
    });

    describe('PUT /categories/:id', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/categories/' + fakeId)
                .send({ nom: 'Nouveau nom' });

            expect(response.status).toBe(401);
        });

        it('met à jour le nom de la catégorie', async () => {
            const created = await request(app.getHttpServer())
                .post('/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'categorie-a-mettre-a-jour',
                    nom: 'Nom initial',
                });

            const response = await request(app.getHttpServer())
                .put('/categories/' + created.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Nom mis à jour' });

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(created.body.id);
            expect(response.body.nom).toBe('Nom mis à jour');
        });

        it('lève 404 lorsque l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/categories/' + fakeId)
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Nom quelconque' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /categories/:id', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer()).delete('/categories/' + fakeId);

            expect(response.status).toBe(401);
        });

        it('lève 404 lorsque l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .delete('/categories/' + fakeId)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('supprime une catégorie sans article et retourne 204', async () => {
            const created = await request(app.getHttpServer())
                .post('/categories')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'categorie-a-supprimer',
                    nom: 'Catégorie à supprimer',
                });

            const response = await request(app.getHttpServer())
                .delete('/categories/' + created.body.id)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
        });

        it('lève 409 si la catégorie contient encore des articles', async () => {
            const categorie = await request(app.getHttpServer())
              .post('/categories')
              .set('Authorization', `Bearer ${token}`)
              .send({
                slug: 'categorie-avec-article',
                nom: 'Catégorie avec article',
              });
          
            await request(app.getHttpServer())
              .post('/articles')
              .set('Authorization', `Bearer ${token}`)
              .send({
                slug: 'article-bloquant-suppression',
                categorieId: categorie.body.id,
                nom: 'Article bloquant',
                contenu: 'Contenu de test',
              });
          
            const response = await request(app.getHttpServer())
              .delete('/categories/' + categorie.body.id)
              .set('Authorization', `Bearer ${token}`);
          
            expect(response.status).toBe(409);
          });
    });
});