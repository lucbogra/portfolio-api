import { Logger } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface.js';

/**
 * Origines autorisées par défaut quand CORS_ORIGIN n'est pas renseignée,
 * hors production uniquement (serveur Next local sur 3001).
 */
export const ORIGINES_DEV_PAR_DEFAUT = [
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

export const METHODES_AUTORISEES = [
  'GET',
  'POST',
  'PATCH',
  'PUT',
  'DELETE',
  'OPTIONS',
];

export const ENTETES_AUTORISES = ['Content-Type', 'Authorization'];

/**
 * Normalise une origine pour la comparaison :
 * minuscules et suppression des barres obliques finales.
 * `https://Lucbogra.com/` et `https://lucbogra.com` deviennent identiques.
 */
export function normaliserOrigine(origine: string): string {
  return origine.trim().toLowerCase().replace(/\/+$/, '');
}

/**
 * Découpe la valeur brute de CORS_ORIGIN en liste d'origines normalisées.
 * Accepte plusieurs origines séparées par des virgules, espaces superflus inclus.
 */
export function parseOrigines(brut: string | undefined): string[] {
  if (!brut) return [];
  return [
    ...new Set(
      brut
        .split(',')
        .map(normaliserOrigine)
        .filter((origine) => origine.length > 0),
    ),
  ];
}

/**
 * Compare une origine à un motif autorisé.
 * Le caractère `*` est accepté dans le motif et remplace un segment sans point,
 * ce qui permet de couvrir les URL de préversion Vercel dont le hachage change
 * à chaque déploiement (ex. `https://portfolio-next-*-lucbogra.vercel.app`).
 */
export function origineCorrespond(origine: string, motif: string): boolean {
  if (!motif.includes('*')) return origine === motif;

  const echappe = motif
    .split('*')
    .map((partie) => partie.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^.]*');

  return new RegExp(`^${echappe}$`).test(origine);
}

export function construireCorsOptions(
  originesAutorisees: string[],
): CorsOptions {
  return {
    origin(
      origine: string | undefined,
      callback: (err: Error | null, autorise?: boolean) => void,
    ) {
      // Requête sans en-tête Origin (curl, health check, appel serveur à serveur) :
      // ce n'est pas une requête inter-origines, le navigateur n'est pas concerné.
      if (!origine) {
        callback(null, true);
        return;
      }

      const normalisee = normaliserOrigine(origine);
      const autorisee = originesAutorisees.some((motif) =>
        origineCorrespond(normalisee, motif),
      );

      // On renvoie `false` au lieu d'une erreur : la requête aboutit sans
      // en-tête Access-Control-Allow-Origin, et c'est le navigateur qui bloque.
      callback(null, autorisee);
    },
    methods: METHODES_AUTORISEES,
    allowedHeaders: ENTETES_AUTORISES,
    // Le front envoie le jeton via l'en-tête Authorization (localStorage),
    // aucun cookie n'est utilisé : les identifiants ne sont pas nécessaires.
    credentials: false,
    optionsSuccessStatus: 204,
  };
}

/**
 * Résout la liste des origines autorisées et journalise le résultat.
 */
export function resoudreOriginesAutorisees(
  brut: string | undefined,
  estProduction: boolean,
  logger: Logger,
): string[] {
  const origines = parseOrigines(brut);

  if (origines.length > 0) {
    logger.log(`CORS — origines autorisées : ${origines.join(', ')}`);
    return origines;
  }

  if (estProduction) {
    logger.warn(
      'CORS — CORS_ORIGIN absente ou vide en production : aucune origine ' +
        'inter-domaine autorisée. Renseignez CORS_ORIGIN (liste séparée par ' +
        'des virgules) pour autoriser le front.',
    );
    return [];
  }

  logger.warn(
    `CORS — CORS_ORIGIN absente ou vide : repli sur les origines de ` +
      `développement ${ORIGINES_DEV_PAR_DEFAUT.join(', ')}.`,
  );
  return ORIGINES_DEV_PAR_DEFAUT;
}

export function configurerCors(app: INestApplication): string[] {
  const logger = new Logger('Cors');
  const origines = resoudreOriginesAutorisees(
    process.env.CORS_ORIGIN,
    process.env.NODE_ENV === 'production',
    logger,
  );
  app.enableCors(construireCorsOptions(origines));
  return origines;
}
