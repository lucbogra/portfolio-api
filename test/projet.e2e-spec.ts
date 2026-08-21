import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module.js";
import { PrismaService } from "src/shared/infrastructure/prisma.service.js";
import request from 'supertest';


describe('ProjetController (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let token: string;
    let experienceId: string;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));
        await app.init();

        prisma = moduleRef.get(PrismaService);

        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD_PLAIN
            });

        token = loginResponse.body.access_token;                

        const response = await request(app.getHttpServer())
            .post('/experiences')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'mission-avec-projet',
                dateDebut: '2024-01-01',
                dateFin: '2024-12-31',
                titre: 'Titre Test',
                entreprise: 'Entreprise Test',
                contexte: 'freelance',
                description: 'Description test',
                lienDemo: null,
            });
        
        experienceId = response.body.id;
    });

    afterEach(async() => {
        // await prisma.projet.deleteMany();
    });

    afterAll(async() => {
        await prisma.projet.deleteMany();
        await request(app.getHttpServer()).delete('/experiences/'+experienceId).set('Authorization', `Bearer ${token}`);
        await app.close();
    });


    describe('POST /projets', () => {
        it('lève 401 sans token d\'authentification', async() => {
            const response = await request(app.getHttpServer())
                .post('/projets')
                .send({
                    slug: "premier-projet",
                    nom : "troisième projet",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "Conception d'un système d'alerte pour les ouvriers du BTP",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });
            
            expect(response.status).toBe(401);
        })

        it('crée un nouveau projet autonome et retourne 201', async() => {
            const response = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: "premier-projet",
                    nom : "troisième projet",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    image: null,
                    details: "Conception d'un système d'alerte pour les ouvriers du BTP",
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                })

            expect(response.status).toBe(201);
            expect(response.body.slug).toBe('premier-projet');
        })

        it('lève 400 (Bad Request) quand l\'expérience est renseignée mais inexistante', async() => {
            const response = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: "projet-avec-fausse-experience",
                    experienceId: "9e191568-d6b4-4faf-9d4a-e28e437fd12d",
                    nom : "projet avec une fausse expérience",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "Conception d'un système d'alerte pour les ouvriers du BTP",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });

            expect(response.status).toBe(400);
        })

        it('crée un projet avec une expérience existante et retourne 201', async() => {
            const response = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: "projet-avec-vraie-experience",
                    experienceId: experienceId,
                    nom : "projet avec une vraie expérience",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "Conception d'un système d'alerte pour les ouvriers du BTP",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });                

            expect(response.status).toBe(201);
            expect(response.body.experienceId).toBe(experienceId);
        });

        it('lève 409 si le slug existe déjà', async() => {

            await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: "projet-slug-duplique",
                    experienceId: experienceId,
                    nom : "projet avec une vraie expérience",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "Conception d'un système d'alerte pour les ouvriers du BTP",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });

            const response = await request(app.getHttpServer())
            .post('/projets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: "projet-slug-duplique",
                experienceId: experienceId,
                nom : "projet avec une vraie expérience",
                dateDebut: "2024-01-15",
                dateFin: "2024-10-30",
                details: "Conception d'un système d'alerte pour les ouvriers du BTP",
                image: null,
                github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
            }); 

            expect(response.status).toBe(409);
        })

        it('lève 400 si un champ requis est absent', async() => {
            const response = await request(app.getHttpServer())
            .post('/projets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: "projet-slug-duplique",
                experienceId: experienceId,
                nom : "projet avec une vraie expérience",
                dateFin: "2024-10-30",
                details: "Conception d'un système d'alerte pour les ouvriers du BTP",
                image: null,
                github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
            }); 

            expect(response.status).toBe(400);
        });
    });

    describe('Get /projets', () => {
        it('retourne 3 projets', async() => {
            const response = await request(app.getHttpServer())
            .get('/projets');

            expect(response.body.length).toBe(3);
        });
    });

    describe('Get /projets/autonomes', () => {
        it('retourne 1 projet', async() => {
            const response = await request(app.getHttpServer())
            .get('/projets/autonomes');

            expect(response.body.length).toBe(1);
        });
    });

    describe('Get /projets/experience/experienceId', () => {
        it('retourne 2 projet', async() => {
            const response = await request(app.getHttpServer())
            .get('/projets/experience/'+experienceId);

            expect(response.body.length).toBe(2);
        })
    });

    describe('Put /projets/projetId', () => {
        it('lève 401 sans token', async() => {
            let fakeId = crypto.randomUUID();            
            const response = await request(app.getHttpServer())
                .put('/projets/'+fakeId)
                .send({
                    experienceId: experienceId,
                    nom : "projet inexistant",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "details du projet inexistant",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });

            expect(response.status).toBe(401);
        });
        
        it('met à jour le projet', async() => {
            const projetInitial = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: "projet-a-mettre-a-jour",
                    experienceId: experienceId,
                    nom : "projet à mettre à jour",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "Conception du projet à mettre à jour",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });

            const projetAJour = await request(app.getHttpServer())
                .put('/projets/'+projetInitial.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    experienceId: experienceId,
                    nom : "projet à jour",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "Conception du projet à jour",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });

            expect(projetAJour.status).toBe(200);
            expect(projetAJour.body.id).toBe(projetInitial.body.id);
            expect(projetAJour.body.nom).toBe('projet à jour');
        })

        it('lève 404 lorsque l\'id n\'existe pas', async() => {
            let fakeId = crypto.randomUUID();            
            const response = await request(app.getHttpServer())
                .put('/projets/'+fakeId)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    experienceId: experienceId,
                    nom : "projet inexistant",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "details du projet inexistant",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });

            expect(response.status).toBe(404);
        });
    });

    describe('Delete /projets/projetId',() => {
        it('lève 401 sans le token',async() => {
            let fakeId = crypto.randomUUID();   
            const response = await request(app.getHttpServer())
                .delete('/projets/'+fakeId);
            
            expect(response.status).toBe(401);
        });

        it('retoune 404 lorsque l\'id n\'existe pas', async() => {
            let fakeId = crypto.randomUUID();   
            const response = await request(app.getHttpServer())
                .delete('/projets/'+fakeId)
                .set('Authorization', `Bearer ${token}`);
            
            expect(response.status).toBe(404);
        });

        it('supprime le projet existant et retourne 204', async() => {
            const projetASupprimer = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    slug: "projet-a-supprimer",
                    experienceId: experienceId,
                    nom : "projet à supprimer",
                    dateDebut: "2024-01-15",
                    dateFin: "2024-10-30",
                    details: "Conception du projet à supprimer",
                    image: null,
                    github : "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement",
                    lienDemo: "https://www.crunchyroll.com/fr/watch/GYMEW9536/path-of-revenge-path-of-atonement"
                });

            const response = await request(app.getHttpServer())
                .delete('/projets/'+projetASupprimer.body.id)
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(204);
        })
    })
} )