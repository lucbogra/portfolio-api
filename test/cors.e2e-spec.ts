import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module.js';
import { App } from 'supertest/types.js';
import {
  construireCorsOptions,
  normaliserOrigine,
  origineCorrespond,
  parseOrigines,
} from 'src/shared/config/cors.config.js';

const ORIGINE_AUTORISEE = 'https://www.lucbogra.com';
const ORIGINE_PREVIEW = 'https://portfolio-next-abc123-lucbogra.vercel.app';
const ORIGINE_INTERDITE = 'https://attaquant.example';

describe('CORS (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors(
      construireCorsOptions(
        parseOrigines(
          ' https://lucbogra.com/ , https://www.lucbogra.com ,https://portfolio-next-*-lucbogra.vercel.app ',
        ),
      ),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('parsing de CORS_ORIGIN', () => {
    it('découpe sur les virgules et supprime les espaces superflus', () => {
      expect(parseOrigines(' https://a.com , https://b.com ')).toEqual([
        'https://a.com',
        'https://b.com',
      ]);
    });

    it('normalise la barre oblique finale et la casse', () => {
      expect(normaliserOrigine('https://Lucbogra.com/')).toBe(
        'https://lucbogra.com',
      );
      expect(parseOrigines('https://a.com/,https://a.com')).toEqual([
        'https://a.com',
      ]);
    });

    it('renvoie une liste vide quand la variable est absente ou vide', () => {
      expect(parseOrigines(undefined)).toEqual([]);
      expect(parseOrigines('   ,  ')).toEqual([]);
    });

    it('fait correspondre un motif à joker sur un seul segment', () => {
      const motif = 'https://portfolio-next-*-lucbogra.vercel.app';
      expect(origineCorrespond(ORIGINE_PREVIEW, motif)).toBe(true);
      expect(
        origineCorrespond(
          'https://portfolio-next-x.y-lucbogra.vercel.app',
          motif,
        ),
      ).toBe(false);
      expect(origineCorrespond('https://autre-projet.vercel.app', motif)).toBe(
        false,
      );
    });
  });

  describe('requête préliminaire OPTIONS sur /auth/login', () => {
    it('aboutit pour une origine autorisée, sans passer par l’authentification', async () => {
      const reponse = await request(app.getHttpServer())
        .options('/auth/login')
        .set('Origin', ORIGINE_AUTORISEE)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'content-type, authorization');

      expect(reponse.status).toBe(204);
      expect(reponse.headers['access-control-allow-origin']).toBe(
        ORIGINE_AUTORISEE,
      );
      expect(reponse.headers['access-control-allow-methods']).toContain('POST');
      expect(reponse.headers['access-control-allow-headers']).toContain(
        'Authorization',
      );
    });

    it('accepte une origine saisie avec une barre oblique finale', async () => {
      const reponse = await request(app.getHttpServer())
        .options('/auth/login')
        .set('Origin', 'https://lucbogra.com/')
        .set('Access-Control-Request-Method', 'POST');

      expect(reponse.headers['access-control-allow-origin']).toBe(
        'https://lucbogra.com/',
      );
    });

    it('accepte une URL de préversion Vercel couverte par le motif', async () => {
      const reponse = await request(app.getHttpServer())
        .options('/auth/login')
        .set('Origin', ORIGINE_PREVIEW)
        .set('Access-Control-Request-Method', 'POST');

      expect(reponse.headers['access-control-allow-origin']).toBe(
        ORIGINE_PREVIEW,
      );
    });

    it('n’envoie aucun en-tête Access-Control-Allow-Origin pour une origine interdite', async () => {
      const reponse = await request(app.getHttpServer())
        .options('/auth/login')
        .set('Origin', ORIGINE_INTERDITE)
        .set('Access-Control-Request-Method', 'POST');

      expect(reponse.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('requête réelle POST /auth/login', () => {
    it('porte l’en-tête CORS même sur une réponse 401', async () => {
      const reponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Origin', ORIGINE_AUTORISEE)
        .send({ username: 'inconnu', password: 'mauvais' });

      expect(reponse.status).toBe(401);
      expect(reponse.headers['access-control-allow-origin']).toBe(
        ORIGINE_AUTORISEE,
      );
    });

    it('ne porte pas d’en-tête CORS pour une origine interdite', async () => {
      const reponse = await request(app.getHttpServer())
        .post('/auth/login')
        .set('Origin', ORIGINE_INTERDITE)
        .send({ username: 'inconnu', password: 'mauvais' });

      expect(reponse.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('origines vides', () => {
    it('n’autorise aucune origine inter-domaine quand la liste est vide', async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      const appVide = moduleFixture.createNestApplication();
      appVide.enableCors(construireCorsOptions([]));
      await appVide.init();

      const reponse = await request(appVide.getHttpServer())
        .options('/auth/login')
        .set('Origin', ORIGINE_AUTORISEE)
        .set('Access-Control-Request-Method', 'POST');

      expect(reponse.headers['access-control-allow-origin']).toBeUndefined();
      await appVide.close();
    });
  });
});
