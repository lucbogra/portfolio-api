import { InvalidPeriodeError } from "./periode.errors.js";
import { Periode } from "./periode.value-object.js";
import { jest } from '@jest/globals';

describe('Periode', () => {
    describe('create', () => {
        it('crée une période valide avec une date de fin postérieure à la date de début', () => {
            const periode = Periode.create(new Date('2024-01-01'), new Date('2024-06-01'));

            expect(periode.dateDebut).toEqual(new Date('2024-01-01'));
            expect(periode.dateFin).toEqual(new Date('2024-06-01'));
        });

        it('crée une période valide sans date de fin (mission en cours)', () => {
            const periode = Periode.create(new Date('2024-01-01'), null);

            expect(periode.dateFin).toBeNull();
        });

        it('accepte une date de début égale à une date de fin', () => {
            const meme = new Date('2024-01-01');

            expect(() => Periode.create(meme, meme)).not.toThrow();
        });

        it('lève InvalidPeriodeError si la date de fin précède la date de début', () => {
            expect(() => Periode.create(new Date('2024-06-01'), new Date('2024-01-01'))).toThrow(InvalidPeriodeError);
        })
    });

    describe('enCours', () => {
        it('retourne true quand il n\'y a pas de date de fin', () => {
            const periode = Periode.create(new Date('2024-01-01'), null);

            expect(periode.encours).toBe(true);
        });

        it('retourne false quand une date de fin est définie', () => {
            const periode = Periode.create(new Date('2024-01-01'), new Date('2024-06-01'));

            expect(periode.encours).toBe(false);
        })
    });

    describe('englobe', () => {
        it('retourne true quand la période englobe entièrement une autre période', () => {
            const parent = Periode.create(new Date('2024-01-01'), new Date('2024-06-01'));
            const enfant = Periode.create(new Date('2024-01-02'), new Date('2024-05-30'));

            expect(parent.englobe(enfant)).toBe(true);
        })

        it('retourne false quand une période déborde avant le début de la parente', () => {
            const parent = Periode.create(new Date('2024-01-02'), new Date('2024-06-01'));
            const enfant = Periode.create(new Date('2024-01-01'), new Date('2024-05-30'));

            expect(parent.englobe(enfant)).toBe(false);
        })

        it('retourne false quand une période déborde après la fin de la parente', () => {
            const parent = Periode.create(new Date('2024-01-01'), new Date('2024-06-01'));
            const enfant = Periode.create(new Date('2024-01-02'), new Date('2024-06-02'));

            expect(parent.englobe(enfant)).toBe(false);
        });

        it('retourne true quand les deux périodes sont strictement identiques', () => {
            const parent = Periode.create(new Date('2024-01-01'), new Date('2024-06-01'));
            const enfant = Periode.create(new Date('2024-01-01'), new Date('2024-06-01'));

            expect(parent.englobe(enfant)).toBe(true);
        })

        it('gère correctement une période enfant sans date de fin (en cours)', () => {
            const parent = Periode.create(new Date('2024-01-01'), new Date('2024-06-01'));
            const enfant = Periode.create(new Date('2024-01-01'), null);

            expect(parent.englobe(enfant)).toBe(false);
        });
    });

    describe('dureeEnMois', () => {
        it('calcule correctement la durée entre deux dates fixes', () => {
            const periode = Periode.create(new Date('2024-01-01'), new Date('2024-07-01'));

            expect(periode.dureeEnMois()).toBe(6);
        })

        it('utilise la date actuelle quand il n\'y a pas de date de fin', () => {
            const maintenant = new Date('2024-07-01');
            jest.useFakeTimers().setSystemTime(maintenant);

            const periode = Periode.create(new Date('2024-01-01'), null);

            expect(periode.dureeEnMois()).toBe(6);

            jest.useRealTimers();
        })
    });
} );