import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from 'supertest';
import { AppModule } from "src/app.module.js";
import { PrismaService } from "src/shared/infrastructure/prisma.service.js";

describe('ProfilController (e2e)', () => {
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

        // Le profil est un singleton : on part d'un état propre pour que
        // le premier PUT du fichier emprunte bien le chemin "création".
        await prisma.profil.deleteMany();
    });

    afterAll(async () => {
        await prisma.profil.deleteMany();
        await app.close();
    });

    describe('GET /profil', () => {
        it('retourne 404 tant que le profil n\'a pas encore été configuré', async () => {
            const response = await request(app.getHttpServer()).get('/profil');

            expect(response.status).toBe(404);
        });
    });

    describe('PUT /profil', () => {
        it('lève 401 sans token d\'authentification', async () => {
            const response = await request(app.getHttpServer())
                .put('/profil')
                .send({
                    titre: 'Architecte Logiciel',
                    description: 'Description test',
                    telephone: '+212612345678',
                    pays: 'Maroc',
                    ville: 'Rabat',
                });

            expect(response.status).toBe(401);
        });

        it('lève 400 si un champ requis est manquant', async () => {
            const response = await request(app.getHttpServer())
                .put('/profil')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titre: 'Architecte Logiciel',
                });

            expect(response.status).toBe(400);
        });

        it('crée le profil au premier appel (upsert) et retourne 200', async () => {
            const response = await request(app.getHttpServer())
                .put('/profil')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titre: 'Architecte Logiciel Freelance',
                    description: 'Développeur full-stack spécialisé PHP/Laravel et NestJS',
                    telephone: '+212612345678',
                    github: 'https://github.com/lucbogra',
                    linkedin: 'https://linkedin.com/in/lucbogra',
                    pays: 'Maroc',
                    ville: 'Rabat',
                    adresse: null,
                });

            expect(response.status).toBe(200);
            expect(response.body.titre).toBe('Architecte Logiciel Freelance');
            expect(response.body.telephone).toBe('+212612345678');
            expect(response.body.github).toBe('https://github.com/lucbogra');
            expect(response.body.pays).toBe('Maroc');
        });

        it('retourne le profil créé via GET (route publique, sans token)', async () => {
            const response = await request(app.getHttpServer()).get('/profil');

            expect(response.status).toBe(200);
            expect(response.body.titre).toBe('Architecte Logiciel Freelance');
            expect(response.body.ville).toBe('Rabat');
        });

        it('met à jour le profil existant au second appel, sans le dupliquer', async () => {
            const response = await request(app.getHttpServer())
                .put('/profil')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titre: 'Architecte Logiciel & Lead Technique',
                    description: 'Description mise à jour',
                    telephone: '+212687654321',
                    github: 'https://github.com/lucbogra',
                    linkedin: null,
                    pays: 'Maroc',
                    ville: 'Casablanca',
                    adresse: null,
                });

            expect(response.status).toBe(200);
            expect(response.body.titre).toBe('Architecte Logiciel & Lead Technique');
            expect(response.body.telephone).toBe('+212687654321');
            expect(response.body.linkedin).toBeNull();
            expect(response.body.ville).toBe('Casablanca');
        });

        it('confirme qu\'une seule ligne de profil existe après plusieurs mises à jour', async () => {
            const count = await prisma.profil.count();

            expect(count).toBe(1);
        });

        it('accepte github et linkedin absents (optionnels)', async () => {
            const response = await request(app.getHttpServer())
                .put('/profil')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titre: 'Titre sans réseaux',
                    description: 'Description',
                    telephone: '+212600000000',
                    pays: 'Maroc',
                    ville: 'Fès',
                });

            expect(response.status).toBe(200);
            expect(response.body.github).toBeNull();
            expect(response.body.linkedin).toBeNull();
        });

        it('considère le profil disponible par défaut', async () => {
            const response = await request(app.getHttpServer()).get('/profil');

            expect(response.status).toBe(200);
            expect(response.body.disponible).toBe(true);
        });

        it('permet de passer le profil en indisponible', async () => {
            const response = await request(app.getHttpServer())
                .put('/profil')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    titre: 'Titre',
                    description: 'Description',
                    telephone: '+212600000000',
                    pays: 'Maroc',
                    ville: 'Fès',
                    disponible: false,
                });

            expect(response.status).toBe(200);
            expect(response.body.disponible).toBe(false);
        });
    });
});