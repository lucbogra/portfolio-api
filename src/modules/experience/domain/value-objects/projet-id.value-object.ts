export class ProjetId {
  private constructor(private readonly value: string) {}

  static create(value: string): ProjetId {
    if (!value || value.trim().length === 0) {      
      throw new Error('Projet Id ne peut pas être vide'); 
    }
    return new ProjetId(value);
  }

  static generate(): ProjetId {
    return new ProjetId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: ProjetId): boolean {
    return this.value === other.value;
  }
}
