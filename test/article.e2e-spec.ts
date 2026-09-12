import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from 'supertest';
import { AppModule } from "src/app.module.js";
import { PrismaService } from "src/shared/infrastructure/prisma.service.js";

describe('ArticleController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let token: string;
    let categorieId: string;    

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

        const categorie = await request(app.getHttpServer())
            .post('/categories')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'categorie-pour-articles',
                nom: 'Catégorie pour articles',
            });

        categorieId = categorie.body.id;
    });

    afterAll(async () => {
        await prisma.taggable.deleteMany();
        await prisma.tag.deleteMany();
        await prisma.article.deleteMany();
        await prisma.categorie.deleteMany();
        await app.close();
    });

    describe('POST /articles', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const response = await request(app.getHttpServer())
                .post('/articles')
                .send({
                    slug: 'article-sans-auth',
                    categorieId: categorieId,
                    nom: 'Article sans auth',
                    contenu: 'Contenu de test',
                });

            expect(response.status).toBe(401);
        });

        it('crée un article en statut brouillon et retourne 201', async () => {
            const response = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'premier-article',
                    categorieId: categorieId,
                    nom: 'Premier article',
                    contenu: 'Contenu du premier article',
                    image: null,
                });

            expect(response.status).toBe(201);
            expect(response.body.slug).toBe('premier-article');
            expect(response.body.statut).toBe('brouillon');
            expect(response.body.datePublication).toBeNull();
        });

        it('lève 400 (Bad Request) quand la catégorie est renseignée mais inexistante', async () => {
            const fakeCategorieId = randomUUID();

            const response = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-avec-fausse-categorie',
                    categorieId: fakeCategorieId,
                    nom: 'Article avec fausse catégorie',
                    contenu: 'Contenu de test',
                });

            expect(response.status).toBe(400);
        });

        it('lève 409 si le slug existe déjà', async () => {
            await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-slug-duplique',
                    categorieId: categorieId,
                    nom: 'Article original',
                    contenu: 'Contenu original',
                });

            const response = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-slug-duplique',
                    categorieId: categorieId,
                    nom: 'Article dupliqué',
                    contenu: 'Contenu dupliqué',
                });

            expect(response.status).toBe(409);
        });

        it('lève 400 si un champ requis est absent', async () => {
            const response = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-incomplet',
                    categorieId: categorieId,
                });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /articles', () => {
        it('retourne la liste des articles', async () => {
            const response = await request(app.getHttpServer()).get('/articles');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /articles/publies', () => {
        it('ne retourne que les articles publiés, avec leurs tags et leur catégorie', async () => {
            const brouillon = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-brouillon-publies-test',
                    categorieId: categorieId,
                    nom: 'Article brouillon',
                    contenu: 'Contenu',
                });

            const publie = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-publie-publies-test',
                    categorieId: categorieId,
                    nom: 'Article publié',
                    contenu: 'Contenu',
                });

            await request(app.getHttpServer())
                .put('/articles/statut/' + publie.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ statut: 'publié' });

            const tag = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Tag e2e article publie', type: 'stack' });

            await request(app.getHttpServer())
                .post(`/articles/${publie.body.id}/tags`)
                .set('Authorization', `Bearer ${token}`)
                .send({ tagId: tag.body.id });

            const response = await request(app.getHttpServer()).get('/articles/publies');

            expect(response.status).toBe(200);

            const slugs = response.body.map((a: { slug: string }) => a.slug);
            expect(slugs).toContain('article-publie-publies-test');
            expect(slugs).not.toContain('article-brouillon-publies-test');

            const found = response.body.find(
                (a: { slug: string }) => a.slug === 'article-publie-publies-test',
            );
            expect(found.categorie).toEqual(
                expect.objectContaining({ id: categorieId }),
            );
            expect(found.tags).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ id: tag.body.id, nom: 'Tag e2e article publie' }),
                ]),
            );
        });
    });

    describe('GET /articles/:id/tags', () => {
        it('retourne les tags attachés à l\'article', async () => {
            const article = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-liste-tags-test',
                    categorieId: categorieId,
                    nom: 'Article liste tags',
                    contenu: 'Contenu',
                });

            const tag = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Tag e2e liste tags article', type: 'stack' });

            await request(app.getHttpServer())
                .post(`/articles/${article.body.id}/tags`)
                .set('Authorization', `Bearer ${token}`)
                .send({ tagId: tag.body.id });

            const response = await request(app.getHttpServer()).get(
                `/articles/${article.body.id}/tags`,
            );

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ id: tag.body.id, nom: 'Tag e2e liste tags article' }),
                ]),
            );
        });
    });

    describe('GET /articles/publies/:slug', () => {
        it('retourne l\'article publié avec sa catégorie et ses tags', async () => {
            const response = await request(app.getHttpServer()).get(
                '/articles/publies/article-publie-publies-test',
            );

            expect(response.status).toBe(200);
            expect(response.body.slug).toBe('article-publie-publies-test');
            expect(response.body.categorie).toEqual(
                expect.objectContaining({ id: categorieId }),
            );
            expect(response.body.tags).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ nom: 'Tag e2e article publie' }),
                ]),
            );
        });

        it('retourne 404 pour un article en brouillon, même si le slug existe', async () => {
            const response = await request(app.getHttpServer()).get(
                '/articles/publies/article-brouillon-publies-test',
            );

            expect(response.status).toBe(404);
        });

        it('retourne 404 si le slug n\'existe pas', async () => {
            const response = await request(app.getHttpServer()).get('/articles/publies/inexistant');

            expect(response.status).toBe(404);
        });
    });

    describe('GET /articles/categorie/:categorieId', () => {
        it('retourne uniquement les articles de la catégorie', async () => {
            const response = await request(app.getHttpServer()).get(
                '/articles/categorie/' + categorieId,
            );

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            for (const article of response.body) {
                expect(article.categorieId).toBe(categorieId);
            }
        });
    });

    describe('GET /articles/:slug', () => {
        it('retourne 404 si le slug n\'existe pas', async () => {
            const response = await request(app.getHttpServer()).get('/articles/inexistant');

            expect(response.status).toBe(404);
        });

        it('retourne l\'article si le slug existe (sans token, route publique)', async () => {
            const response = await request(app.getHttpServer()).get('/articles/premier-article');

            expect(response.status).toBe(200);
            expect(response.body.slug).toBe('premier-article');
        });
    });

    describe('PUT /articles/:id', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/articles/' + fakeId)
                .send({
                    categorieId: categorieId,
                    nom: 'Nom modifié',
                    contenu: 'Contenu modifié',
                });

            expect(response.status).toBe(401);
        });

        it('met à jour le contenu de l\'article', async () => {
            const created = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-a-mettre-a-jour',
                    categorieId: categorieId,
                    nom: 'Nom initial',
                    contenu: 'Contenu initial',
                });

            const response = await request(app.getHttpServer())
                .put('/articles/' + created.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    categorieId: categorieId,
                    nom: 'Nom mis à jour',
                    contenu: 'Contenu mis à jour',
                });

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(created.body.id);
            expect(response.body.nom).toBe('Nom mis à jour');
            expect(response.body.contenu).toBe('Contenu mis à jour');
        });

        it('lève 400 quand la nouvelle catégorie est inexistante', async () => {
            const created = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-a-mettre-a-jour-mauvaise-categorie',
                    categorieId: categorieId,
                    nom: 'Nom',
                    contenu: 'Contenu',
                });

            const fakeCategorieId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/articles/' + created.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    categorieId: fakeCategorieId,
                    nom: 'Nom',
                    contenu: 'Contenu',
                });

            expect(response.status).toBe(400);
        });

        it('lève 404 lorsque l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/articles/' + fakeId)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    categorieId: categorieId,
                    nom: 'Nom',
                    contenu: 'Contenu',
                });

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /articles/statut/:id', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/articles/statut/' + fakeId)
                .send({ statut: 'publié' });

            expect(response.status).toBe(401);
        });

        it('publie un article et renseigne datePublication', async () => {
            const created = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-a-publier',
                    categorieId: categorieId,
                    nom: 'Article à publier',
                    contenu: 'Contenu',
                });

            const response = await request(app.getHttpServer())
                .put('/articles/statut/' + created.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ statut: 'publié' });

            expect(response.status).toBe(200);
            expect(response.body.statut).toBe('publié');
            expect(response.body.datePublication).not.toBeNull();
        });

        it('lève 400 lors d\'une transition de statut invalide', async () => {
            const created = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-transition-invalide',
                    categorieId: categorieId,
                    nom: 'Article',
                    contenu: 'Contenu',
                });

            // brouillon -> brouillon n'est pas une transition autorisée
            const response = await request(app.getHttpServer())
                .put('/articles/statut/' + created.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ statut: 'brouillon' });

            expect(response.status).toBe(400);
        });

        it('lève 404 lorsque l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/articles/statut/' + fakeId)
                .set('Authorization', `Bearer ${token}`)
                .send({ statut: 'publié' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /articles/:id', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer()).delete('/articles/' + fakeId);

            expect(response.status).toBe(401);
        });

        it('lève 404 lorsque l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .delete('/articles/' + fakeId)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('supprime un article existant et retourne 204', async () => {
            const created = await request(app.getHttpServer())
                .post('/articles')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'article-a-supprimer',
                    categorieId: categorieId,
                    nom: 'Article à supprimer',
                    contenu: 'Contenu',
                });

            const response = await request(app.getHttpServer())
                .delete('/articles/' + created.body.id)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
        });
    });
});