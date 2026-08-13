import { InvalidPeriodeError } from 'src/shared/domain/value-objects/periode/periode.errors.js';

export class Periode {
  private constructor(
    private readonly _dateDebut: Date,
    private readonly _dateFin: Date | null,
  ) {}

  static create(dateDebut: Date, dateFin: Date | null): Periode {
    if (dateFin && dateFin < dateDebut) {
      throw new InvalidPeriodeError(
        'La date de fin ne peut précéder la date de début',
      );
    }
    return new Periode(dateDebut, dateFin);
  }

  get encours(): boolean {
    return this._dateFin == null;
  }

  englobe(autre: Periode): boolean {
    const finComparaison = autre._dateFin ?? new Date();
    const finActuelle = this._dateFin ?? new Date();
    return this._dateDebut <= autre._dateDebut && finActuelle >= finComparaison;
  }

  dureeEnMois(): number {
    const fin = this._dateFin ?? new Date();
    const diffMs = fin.getTime() - this._dateDebut.getTime();

    return Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
  }

  get dateDebut(): Date {
    return this._dateDebut;
  }

  get dateFin(): Date | null {
    return this._dateFin;
  }
}
