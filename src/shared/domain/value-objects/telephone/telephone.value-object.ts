import { InvalidTelephoneError } from 'src/shared/domain/value-objects/telephone/telephone.errors.js';

export class Telephone {
  // Format E.164 : + suivi de 8 à 15 chiffres (norme internationale ITU-T)
  private static readonly E164_REGEX = /^\+[1-9]\d{7,14}$/;

  private constructor(private readonly value: string) {}

  static create(raw: string): Telephone {
    const normalized = raw.trim().replace(/[\s.-]/g, '');

    if (!Telephone.E164_REGEX.test(normalized)) {
      throw new InvalidTelephoneError(raw);
    }

    return new Telephone(normalized);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Telephone): boolean {
    return this.value === other.value;
  }
}
