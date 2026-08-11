export class ProfilId {
    private constructor(private readonly value: string) {}

    // Singleton : un seul profil existe, l'id est toujours fixe
    static readonly UNIQUE = new ProfilId('profil-unique');

    toString(): string {
        return this.value;
    }

    equals(other: ProfilId): boolean {
        return this.value === other.value;
    }
}