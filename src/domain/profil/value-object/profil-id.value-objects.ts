export class ProfilId {
    private constructor(private readonly value: string) {}

    // Singleton : un seul profil existe, l'id est toujours fixe
    static readonly UNIQUE = new ProfilId('a3f5e8c2-1b4d-4f6a-9e7c-2d8b5a1f3c9e');

    toString(): string {
        return this.value;
    }

    equals(other: ProfilId): boolean {
        return this.value === other.value;
    }
}