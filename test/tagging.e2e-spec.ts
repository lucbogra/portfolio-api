import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { randomUUID } from "crypto";
import request from 'supertest';
import { AppModule } from "src/app.module.js";
import { PrismaService } from "src/shared/infrastructure/prisma.service.js";

// Le tagging (attach/detach/list) est générique et partagé par Experience,
// Projet et Article via le même TaggingRepository. On le teste ici sur
// Experience comme représentant du pattern — les routes /projets/:id/tags
// et /articles/:id/tags suivent exactement la même logique.
describe('Tagging (e2e) — via ExperienceController', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let token: string;
    let experienceId: string;
    let tagId: string;

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

        const experience = await request(app.getHttpServer())
            .post('/experiences')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'experience-pour-tagging',
                dateDebut: '2024-01-01',
                titre: 'Titre',
                entreprise: 'Entreprise',
                contexte: 'freelance',
                description: 'Description',
            });

        experienceId = experience.body.id;

        const tag = await request(app.getHttpServer())
            .post('/tags')
            .set('Authorization', `Bearer ${token}`)
            .send({ nom: 'NestJS', type: 'stack' });

        tagId = tag.body.id;
    });

    afterAll(async () => {
        await prisma.taggable.deleteMany();
        await prisma.experience.deleteMany();
        await prisma.tag.deleteMany();
        await app.close();
    });

    describe('GET /experiences/:id/tags', () => {
        it('retourne une liste vide avant tout attach', async () => {
            const response = await request(app.getHttpServer()).get(
                '/experiences/' + experienceId + '/tags',
            );

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });

    describe('POST /experiences/:id/tags', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const response = await request(app.getHttpServer())
                .post('/experiences/' + experienceId + '/tags')
                .send({ tagId });

            expect(response.status).toBe(401);
        });

        it('lève 400 si le tag n\'existe pas', async () => {
            const fakeTagId = randomUUID();

            const response = await request(app.getHttpServer())
                .post('/experiences/' + experienceId + '/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ tagId: fakeTagId });

            expect(response.status).toBe(400);
        });

        it('attache le tag et retourne 201', async () => {
            const response = await request(app.getHttpServer())
                .post('/experiences/' + experienceId + '/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ tagId });

            expect(response.status).toBe(201);
        });

        it('lève 409 si le tag est déjà attaché à cette expérience', async () => {
            const response = await request(app.getHttpServer())
                .post('/experiences/' + experienceId + '/tags')
                .set('Authorization', `Bearer ${token}`)
                .send({ tagId });

            expect(response.status).toBe(409);
        });
    });

    describe('GET /experiences/:id/tags (après attach)', () => {
        it('retourne le tag attaché', async () => {
            const response = await request(app.getHttpServer()).get(
                '/experiences/' + experienceId + '/tags',
            );

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0].nom).toBe('NestJS');
        });
    });

    describe('DELETE /experiences/:id/tags/:tagId', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const response = await request(app.getHttpServer()).delete(
                '/experiences/' + experienceId + '/tags/' + tagId,
            );

            expect(response.status).toBe(401);
        });

        it('lève 404 si le lien n\'existe pas', async () => {
            const fakeTagId = randomUUID();

            const response = await request(app.getHttpServer())
                .delete('/experiences/' + experienceId + '/tags/' + fakeTagId)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it('détache le tag et retourne 204', async () => {
            const response = await request(app.getHttpServer())
                .delete('/experiences/' + experienceId + '/tags/' + tagId)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
        });

        it('la liste des tags de l\'expérience est de nouveau vide', async () => {
            const response = await request(app.getHttpServer()).get(
                '/experiences/' + experienceId + '/tags',
            );

            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});