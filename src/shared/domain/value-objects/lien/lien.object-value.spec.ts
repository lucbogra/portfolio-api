import { InvalidLienError } from "./lien.errors.js";
import { Lien } from "./lien.value-object.js";

describe('Lien', () => {
    describe('create', () => {
        it('Accepte la création avec un lien valide', () => {
            const lien = Lien.create('https://www.jmdoudoux.fr/java/dej/chap-streams.htm');

            expect(lien.toString()).toBe('https://www.jmdoudoux.fr/java/dej/chap-streams.htm');
        })

        it('Lève InvalidLienError lorque la valeur n\'est pas un lien', () => {
            expect(() => Lien.create('ceci est un texte.com')).toThrow(InvalidLienError);
        });

        it('Lève InvalidLienError lorque la valeur n\'est est vide', () => {
            expect(() => Lien.create('')).toThrow(InvalidLienError);
        });

        it('lève InvalidLienError pour une URL sans protocole (www.example.com)', () => {
            expect(() => Lien.create('www.example.com')).toThrow(InvalidLienError);
        });
    });
})