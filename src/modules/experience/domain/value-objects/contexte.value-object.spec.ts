import { Contexte, ContexteType } from './contexte.value-object.js';

describe('Contexte', () => {
  describe('create', () => {
    it('crée un contexte freelance valide', () => {
      const contexte = Contexte.create(ContexteType.FREELANCE);

      expect(contexte.value).toBe(ContexteType.FREELANCE);
    });

    it('crée un contexte CDI valide', () => {
      const contexte = Contexte.create(ContexteType.CDI);

      expect(contexte.value).toBe(ContexteType.CDI);
    });

    it('crée un contexte consultant valide', () => {
      const contexte = Contexte.create(ContexteType.CONSULTANT);

      expect(contexte.value).toBe(ContexteType.CONSULTANT);
    });

    it('lève une erreur si la valeur ne correspond à aucun ContexteType', () => {
      expect(() => Contexte.create('invalide' as ContexteType)).toThrow();
    });
  });

  describe('equals', () => {
    it('retourne true lorsque les deux contextes sont identiques', () => {
      const contexteA = Contexte.create(ContexteType.FREELANCE);
      const contexteB = Contexte.create(ContexteType.FREELANCE);

      expect(contexteA.equals(contexteB)).toBe(true);
    });

    it('retourne false lorsque les deux contextes sont différents', () => {
      const contexteA = Contexte.create(ContexteType.FREELANCE);
      const contexteB = Contexte.create(ContexteType.CDI);

      expect(contexteA.equals(contexteB)).toBe(false);
    });
  });
});