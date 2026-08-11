export class CategorieId {
    private constructor(private readonly value: string) {}
  
    static create(value: string): CategorieId {
      if (!value || value.trim().length === 0) {
        throw new Error('CategorieId ne peut être vide');
      }
      return new CategorieId(value);
    }
  
    toString(): string {
      return this.value;
    }
  
    equals(other: CategorieId): boolean {
      return this.value === other.value;
    }
  }