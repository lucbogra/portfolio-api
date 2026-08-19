import { InvalidTelephoneError } from './telephone.errors.js';
import { Telephone } from './telephone.value-object.js';

describe('Telephone', () => {
  describe('create', () => {
    it('crée un téléphone avec un numéro E.164 valide', () => {
      const telephone = Telephone.create('+212612345678');

      expect(telephone.toString()).toBe('+212612345678');
    });

    it('normalise un numéro contenant des espaces', () => {
      const telephone = Telephone.create('+212 6 12 34 56 78');

      expect(telephone.toString()).toBe('+212612345678');
    });

    it('normalise un numéro contenant des tirets', () => {
      const telephone = Telephone.create('+212-6-12-34-56-78');

      expect(telephone.toString()).toBe('+212612345678');
    });

    it('normalise un numéro contenant des points', () => {
      const telephone = Telephone.create('+212.6.12.34.56.78');

      expect(telephone.toString()).toBe('+212612345678');
    });

    it('lève InvalidTelephoneError si le numéro ne commence pas par un +', () => {
      expect(() => Telephone.create('212612345678')).toThrow(InvalidTelephoneError);
    });

    it('lève InvalidTelephoneError si le numéro contient des lettres', () => {
      expect(() => Telephone.create('+212abc345678')).toThrow(InvalidTelephoneError);
    });

    it('lève InvalidTelephoneError si le numéro est trop court', () => {
      expect(() => Telephone.create('+2126')).toThrow(InvalidTelephoneError);
    });

    it('lève InvalidTelephoneError si le numéro est vide', () => {
      expect(() => Telephone.create('')).toThrow(InvalidTelephoneError);
    });
  });

  describe('equals', () => {
    it('retourne true lorsque les deux numéros sont identiques', () => {
      const telephoneA = Telephone.create('+212612345678');
      const telephoneB = Telephone.create('+212612345678');

      expect(telephoneA.equals(telephoneB)).toBe(true);
    });

    it('retourne false lorsque les deux numéros sont différents', () => {
      const telephoneA = Telephone.create('+212612345678');
      const telephoneB = Telephone.create('+33612345678');

      expect(telephoneA.equals(telephoneB)).toBe(false);
    });

    it('retourne true pour deux numéros équivalents après normalisation', () => {
      const telephoneA = Telephone.create('+212 6 12 34 56 78');
      const telephoneB = Telephone.create('+212612345678');

      expect(telephoneA.equals(telephoneB)).toBe(true);
    });
  });
});