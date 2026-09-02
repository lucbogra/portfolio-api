import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from 'supertest';
import { AppModule } from "src/app.module.js";
import { PrismaService } from "src/shared/infrastructure/prisma.service.js";

describe('TagController (e2e)', () => {
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
        await prisma.taggable.deleteMany();
        await prisma.tag.deleteMany();
        await app.close();
    });

    describe('POST /tags', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const response = await request(app.getHttpServer())
                .post('/tags')
                .send({ nom: 'React', type: 'stack' });

            expect(response.status).toBe(401);
        });

        it('crée un tag et retourne 201', async () => {
            const response = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'React', type: 'stack' });

            expect(response.status).toBe(201);
            expect(response.body.nom).toBe('React');
            expect(response.body.type).toBe('stack');
        });

        it('lève 409 si le nom existe déjà', async () => {
            await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Nom Duplique', type: 'stack' });

            const response = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Nom Duplique', type: 'autre' });

            expect(response.status).toBe(409);
        });

        it('lève 400 si un champ requis est manquant', async () => {
            const response = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Tag incomplet' });

            expect(response.status).toBe(400);
        });

        it('lève 400 si le type est invalide', async () => {
            const response = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Tag type invalide', type: 'inexistant' });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /tags', () => {
        it('retourne la liste des tags', async () => {
            const response = await request(app.getHttpServer()).get('/tags');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /tags/:id', () => {
        it('retourne 404 si l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer()).get('/tags/' + fakeId);

            expect(response.status).toBe(404);
        });

        it('retourne le tag si l\'id existe (sans token, route publique)', async () => {
            const created = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Vue.js', type: 'stack' });

            const response = await request(app.getHttpServer()).get('/tags/' + created.body.id);

            expect(response.status).toBe(200);
            expect(response.body.nom).toBe('Vue.js');
        });
    });

    describe('PUT /tags/:id', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/tags/' + fakeId)
                .send({ nom: 'Nouveau nom', type: 'stack' });

            expect(response.status).toBe(401);
        });

        it('met à jour le tag', async () => {
            const created = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Angular', type: 'stack' });

            const response = await request(app.getHttpServer())
                .put('/tags/' + created.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Angular (mis à jour)', type: 'stack' });

            expect(response.status).toBe(200);
            expect(response.body.id).toBe(created.body.id);
            expect(response.body.nom).toBe('Angular (mis à jour)');
        });

        it('lève 404 lorsque l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .put('/tags/' + fakeId)
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Nom quelconque', type: 'stack' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /tags/:id', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer()).delete('/tags/' + fakeId);

            expect(response.status).toBe(401);
        });

        it('lève 404 lorsque l\'id n\'existe pas', async () => {
            const fakeId = randomUUID();

            const response = await request(app.getHttpServer())
                .delete('/tags/' + fakeId)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('supprime un tag inutilisé et retourne 204', async () => {
            const created = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Tag à supprimer', type: 'autre' });

            const response = await request(app.getHttpServer())
                .delete('/tags/' + created.body.id)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
        });

        it('lève 409 si le tag est encore attaché à un élément', async () => {
            const tag = await request(app.getHttpServer())
                .post('/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ nom: 'Tag attaché', type: 'stack' });

            const experience = await request(app.getHttpServer())
                .post('/experiences')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: 'experience-pour-tag-en-usage',
                    dateDebut: '2024-01-01',
                    titre: 'Titre',
                    entreprise: 'Entreprise',
                    contexte: 'freelance',
                    description: 'Description',
                });

            await request(app.getHttpServer())
                .post('/experiences/' + experience.body.id + '/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ tagId: tag.body.id });

            const response = await request(app.getHttpServer())
                .delete('/tags/' + tag.body.id)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(409);

            await request(app.getHttpServer())
                .delete('/experiences/' + experience.body.id + '/tags/' + tag.body.id)
                .set('Authorization', `Bearer ${token}`);

            await prisma.experience.delete({ where: { id: experience.body.id } });
        });
    });
});