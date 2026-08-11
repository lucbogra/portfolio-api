import { InvalidPeriodeError } from "./periode.errors";

export class Periode {
    private constructor(
        private readonly dateDebut: Date,
        private readonly dateFin: Date | null
    ) {}

    static create(dateDebut: Date, dateFin: Date|null): Periode {
        if(dateFin && dateFin < dateDebut) {
            throw new InvalidPeriodeError('La date de fin ne peut précéder la date de début');
        }
        return new Periode(dateDebut, dateFin);
    }

    get encours() : boolean {
        return this.dateFin == null;
    }

    englobe(autre: Periode): boolean {
        const finComparaison = autre.dateFin ?? new Date();
        const finActuelle = this.dateFin ?? new Date();
        return this.dateDebut <= autre.dateDebut && finActuelle >= finComparaison;
    }

    dureeEnMois(): number {
        const fin = this.dateFin ?? new Date();
        const diffMs = fin.getTime() - this.dateDebut.getTime();

        return Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
    }
}