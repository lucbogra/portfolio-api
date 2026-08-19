import { InvalidSlugError } from "./slug.errors.js";
import { Slug } from "./slug.value-object.js";

describe('Slug', () => {
    describe('create', () => {
        it('crée un slug avec un string valide et le normalise', () => {
            const slug = Slug.create('ingenieur-full-stack-chez-X-CONSULT');
    
            expect(slug.toString()).toBe('ingenieur-full-stack-chez-x-consult');
        })
    
        it('lève InvalidSlugError si le slug n\'est pas valide', () => {
            expect(() => Slug.create('ingenieur full-stack chez X-CONSULT')).toThrow(InvalidSlugError);
        });

        it('lève InvalidSlugError si le slug est vide', () => {
            expect(() => Slug.create('')).toThrow(InvalidSlugError);
        });
    });

    describe('equals', () => {
        it('retourne true lorque les deux slugs sont identiques', () => {
            const slugA = Slug.create('ingenieur-full-stack-chez-X-CONSULT');
            const slugB = Slug.create('ingenieur-full-stack-chez-X-CONSULT');

            expect(slugA.equals(slugB)).toBe(true);
        });

        it('retourne false lorsque les deux slugs sont différents', () => {
            const slugA = Slug.create('ingenieur-full-stack-chez-X-CONSULT');
            const slugB = Slug.create('consultant-full-stack-chez-X-CONSULT');

            expect(slugA.equals(slugB)).toBe(false);
        })
        
    });
    
});