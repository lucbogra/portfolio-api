import { Experience } from './experience.entity.js';
import { ExperienceId } from '../value-objects/experience-id.value-object.js';
import { Contexte, ContexteType } from '../value-objects/contexte.value-object.js';
import { Slug } from 'src/shared/domain/value-objects/slug/slug.value-object.js';
import { Periode } from 'src/shared/domain/value-objects/periode/periode.value-object.js';
import { Lien } from 'src/shared/domain/value-objects/lien/lien.value-object.js';

function createExperienceValide(): Experience {
  return Experience.create({
    id: ExperienceId.generate(),
    slug: Slug.create('mission-freelance-kapiia'),
    periode: Periode.create(new Date('2024-01-01'), new Date('2024-12-31')),
    titre: 'Architecte Logiciel Freelance',
    entreprise: 'Kapiia',
    contexte: Contexte.create(ContexteType.FREELANCE),
    description: 'Résolution de dette technique.',
    lienDemo: null,
  });
}

describe('Experience', () => {
  describe('create', () => {
    it('crée une expérience valide avec tous les champs', () => {
      const experience = createExperienceValide();

      expect(experience.titre).toBe('Architecte Logiciel Freelance');
      expect(experience.entreprise).toBe('Kapiia');
      expect(experience.contexte.value).toBe(ContexteType.FREELANCE);
      expect(experience.description).toBe('Résolution de dette technique.');
      expect(experience.lienDemo).toBeNull();
    });

    it('crée une expérience avec un lienDemo renseigné', () => {
      const experience = Experience.create({
        id: ExperienceId.generate(),
        slug: Slug.create('mission-avec-lien'),
        periode: Periode.create(new Date('2024-01-01'), null),
        titre: 'Consultant',
        entreprise: 'Groupe NB',
        contexte: Contexte.create(ContexteType.CONSULTANT),
        description: 'Développement Laravel.',
        lienDemo: Lien.create('https://example.com'),
      });

      expect(experience.lienDemo?.toString()).toBe('https://example.com');
    });
  });

  describe('update', () => {
    it('met à jour tous les champs modifiables', () => {
      const experience = createExperienceValide();

      experience.update({
        titre: 'Nouveau titre',
        entreprise: 'Nouvelle entreprise',
        contexte: Contexte.create(ContexteType.CDI),
        description: 'Nouvelle description',
        periode: Periode.create(new Date('2025-01-01'), null),
        lienDemo: Lien.create('https://nouveau-lien.com'),
      });

      expect(experience.titre).toBe('Nouveau titre');
      expect(experience.entreprise).toBe('Nouvelle entreprise');
      expect(experience.contexte.value).toBe(ContexteType.CDI);
      expect(experience.description).toBe('Nouvelle description');
      expect(experience.periode.encours).toBe(true);
      expect(experience.lienDemo?.toString()).toBe('https://nouveau-lien.com');
    });

    it('ne modifie pas le slug ni l\'id lors de la mise à jour', () => {
      const experience = createExperienceValide();
      const idAvant = experience.id;
      const slugAvant = experience.slug;

      experience.update({
        titre: 'Titre modifié',
        entreprise: experience.entreprise,
        contexte: experience.contexte,
        description: experience.description,
        periode: experience.periode,
        lienDemo: experience.lienDemo,
      });

      expect(experience.id.equals(idAvant)).toBe(true);
      expect(experience.slug.equals(slugAvant)).toBe(true);
    });

    it('permet de passer lienDemo à null lors de la mise à jour', () => {
      const experience = Experience.create({
        id: ExperienceId.generate(),
        slug: Slug.create('mission-test'),
        periode: Periode.create(new Date('2024-01-01'), null),
        titre: 'Titre',
        entreprise: 'Entreprise',
        contexte: Contexte.create(ContexteType.FREELANCE),
        description: 'Description',
        lienDemo: Lien.create('https://ancien-lien.com'),
      });

      experience.update({
        titre: experience.titre,
        entreprise: experience.entreprise,
        contexte: experience.contexte,
        description: experience.description,
        periode: experience.periode,
        lienDemo: null,
      });

      expect(experience.lienDemo).toBeNull();
    });
  });
});