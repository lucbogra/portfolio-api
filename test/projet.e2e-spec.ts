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

        describe('enrichissement avec experience', () => {
            it('retourne experience.titre pour un projet attaché à une expérience', async() => {
                const experienceResponse = await request(app.getHttpServer())
                    .post('/experiences')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        slug: 'experience-pour-enrichissement',
                        dateDebut: '2024-01-01',
                        dateFin: '2024-12-31',
                        titre: 'Experience Enrichie',
                        entreprise: 'Entreprise Enrichie',
                        contexte: 'freelance',
                        description: 'Description test',
                        lienDemo: null,
                    });

                const enrichedExperienceId = experienceResponse.body.id;

                const projetResponse = await request(app.getHttpServer())
                    .post('/projets')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        slug: 'projet-enrichi',
                        experienceId: enrichedExperienceId,
                        nom: 'projet enrichi',
                        dateDebut: '2024-02-01',
                        dateFin: '2024-03-01',
                        image: null,
                        details: 'Détails du projet enrichi',
                        github: null,
                        lienDemo: null,
                    });

                const response = await request(app.getHttpServer())
                    .get('/projets');

                const item = response.body.find((p: { id: string }) => p.id === projetResponse.body.id);

                expect(item).toBeDefined();
                expect(item.experience).toEqual({ id: enrichedExperienceId, titre: 'Experience Enrichie' });
                expect(Array.isArray(item.tags)).toBe(true);
                expect(item.tags).toEqual([]);

                await request(app.getHttpServer())
                    .delete('/projets/' + projetResponse.body.id)
                    .set('Authorization', `Bearer ${token}`);
                await request(app.getHttpServer())
                    .delete('/experiences/' + enrichedExperienceId)
                    .set('Authorization', `Bearer ${token}`);
            });

            it('retourne experience: null pour un projet autonome', async() => {
                const projetResponse = await request(app.getHttpServer())
                    .post('/projets')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        slug: 'projet-autonome-enrichi',
                        nom: 'projet autonome enrichi',
                        dateDebut: '2024-02-01',
                        dateFin: '2024-03-01',
                        image: null,
                        details: 'Détails du projet autonome enrichi',
                        github: null,
                        lienDemo: null,
                    });

                const response = await request(app.getHttpServer())
                    .get('/projets');

                const item = response.body.find((p: { id: string }) => p.id === projetResponse.body.id);

                expect(item).toBeDefined();
                expect(item.experience).toBeNull();

                await request(app.getHttpServer())
                    .delete('/projets/' + projetResponse.body.id)
                    .set('Authorization', `Bearer ${token}`);
            });
        });

        describe('enrichissement avec tags', () => {
            it('retourne les tags attachés au projet', async() => {
                const tagResponse = await request(app.getHttpServer())
                    .post('/tags')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ nom: 'NestJS-projets-enrichis', type: 'stack' });

                const tagId = tagResponse.body.id;

                const projetResponse = await request(app.getHttpServer())
                    .post('/projets')
                    .set('Authorization', `Bearer ${token}`)
                    .send({
                        slug: 'projet-avec-tag',
                        nom: 'projet avec tag',
                        dateDebut: '2024-02-01',
                        dateFin: '2024-03-01',
                        image: null,
                        details: 'Détails du projet avec tag',
                        github: null,
                        lienDemo: null,
                    });

                const projetId = projetResponse.body.id;

                await request(app.getHttpServer())
                    .post('/projets/' + projetId + '/tags')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ tagId });

                const response = await request(app.getHttpServer())
                    .get('/projets');

                const item = response.body.find((p: { id: string }) => p.id === projetId);

                expect(item).toBeDefined();
                expect(item.tags).toEqual([{ id: tagId, nom: 'NestJS-projets-enrichis', type: 'stack' }]);

                await request(app.getHttpServer())
                    .delete('/projets/' + projetId + '/tags/' + tagId)
                    .set('Authorization', `Bearer ${token}`);
                await request(app.getHttpServer())
                    .delete('/projets/' + projetId)
                    .set('Authorization', `Bearer ${token}`);
                await request(app.getHttpServer())
                    .delete('/tags/' + tagId)
                    .set('Authorization', `Bearer ${token}`);
            });
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

    describe('Get /projets/selection', () => {
        const base = {
            experienceId: undefined,
            details: "Projet pour la sélection de l'accueil",
            resume: "Résumé pour la sélection de l'accueil",
            image: null,
        };
        let ancienOrdre2: string;
        let recentOrdre1: string;
        let sansOrdre: string;
        let nonMisEnAvant: string;

        beforeAll(async() => {
            const creer = async (body: Record<string, unknown>) => {
                const response = await request(app.getHttpServer())
                    .post('/projets')
                    .set('Authorization', `Bearer ${token}`)
                    .send({ ...base, ...body });
                expect(response.status).toBe(201);
                return response.body;
            };

            ancienOrdre2 = (await creer({ slug: 'selection-ancien-ordre-2', nom: 'Ancien projet ordre 2', dateDebut: '2020-01-01', dateFin: '2020-06-30', enAvant: true, ordreAffichage: 2 })).id;
            recentOrdre1 = (await creer({ slug: 'selection-recent-ordre-1', nom: 'Projet récent ordre 1', dateDebut: '2023-01-01', dateFin: '2023-06-30', enAvant: true, ordreAffichage: 1 })).id;
            sansOrdre = (await creer({ slug: 'selection-sans-ordre', nom: 'Projet très récent sans ordre', dateDebut: '2025-01-01', enAvant: true })).id;
            const nonMisEnAvantBody = await creer({ slug: 'selection-non-mis-en-avant', nom: 'Projet non mis en avant', dateDebut: '2024-01-01' });
            nonMisEnAvant = nonMisEnAvantBody.id;
            expect(nonMisEnAvantBody.enAvant).toBe(false);
            expect(nonMisEnAvantBody.ordreAffichage).toBeNull();
        });

        it('ne retourne que les projets mis en avant, dans l\'ordre d\'affichage puis les sans-ordre en dernier', async() => {
            const response = await request(app.getHttpServer()).get('/projets/selection');

            expect(response.status).toBe(200);
            expect(response.body.map((p: { id: string }) => p.id)).toEqual([recentOrdre1, ancienOrdre2, sansOrdre]);
            expect(response.body.map((p: { id: string }) => p.id)).not.toContain(nonMisEnAvant);
            expect(response.body[0].tags).toEqual([]);
            expect(response.body[0].experience).toBeNull();
            expect(response.body[0].resume).toBe(base.resume);
        });

        it('ne modifie pas le tri chronologique de GET /projets', async() => {
            const response = await request(app.getHttpServer()).get('/projets');
            const ids: string[] = response.body.map((p: { id: string }) => p.id);

            expect(ids.indexOf(sansOrdre)).toBeLessThan(ids.indexOf(nonMisEnAvant));
            expect(ids.indexOf(nonMisEnAvant)).toBeLessThan(ids.indexOf(recentOrdre1));
            expect(ids.indexOf(recentOrdre1)).toBeLessThan(ids.indexOf(ancienOrdre2));
        });

        it('ne capture pas « selection » comme un slug de GET /projets/:slug', async() => {
            const response = await request(app.getHttpServer()).get('/projets/selection');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('Règle métier : resume obligatoire si enAvant', () => {
        const base = {
            dateDebut: '2024-01-15',
            dateFin: '2024-10-30',
            image: null,
            details: 'Détails du projet pour la règle resume',
        };

        it('rejette la création d\'un projet mis en avant sans resume', async() => {
            const response = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, slug: 'resume-en-avant-sans-resume', nom: 'projet en avant sans resume', enAvant: true });

            expect(response.status).toBe(400);
        });

        it('accepte la création d\'un projet non mis en avant sans resume', async() => {
            const response = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, slug: 'resume-pas-en-avant-sans-resume', nom: 'projet pas en avant sans resume', enAvant: false });

            expect(response.status).toBe(201);
        });

        it('rejette le passage à enAvant: true d\'un projet existant sans resume', async() => {
            const projet = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, slug: 'resume-passage-en-avant-sans-resume', nom: 'projet à passer en avant', enAvant: false });

            const response = await request(app.getHttpServer())
                .put('/projets/' + projet.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, nom: 'projet à passer en avant', enAvant: true });

            expect(response.status).toBe(400);
        });

        it('accepte de passer enAvant: true sur un projet ayant déjà un resume en base, sans le renvoyer dans la requête', async() => {
            const projet = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, slug: 'resume-deja-en-base', nom: 'projet avec resume en base', enAvant: false, resume: 'Un résumé déjà présent en base' });

            const response = await request(app.getHttpServer())
                .put('/projets/' + projet.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, nom: 'projet avec resume en base', enAvant: true });

            expect(response.status).toBe(200);
            expect(response.body.resume).toBe('Un résumé déjà présent en base');
        });

        it('rejette le fait de vider le resume d\'un projet déjà mis en avant', async() => {
            const projet = await request(app.getHttpServer())
                .post('/projets')
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, slug: 'resume-vidage-refuse', nom: 'projet dont on vide le resume', enAvant: true, resume: 'Un résumé à vider' });

            const response = await request(app.getHttpServer())
                .put('/projets/' + projet.body.id)
                .set('Authorization', `Bearer ${token}`)
                .send({ ...base, nom: 'projet dont on vide le resume', enAvant: true, resume: '' });

            expect(response.status).toBe(400);
        });
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