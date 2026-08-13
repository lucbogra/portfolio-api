export class ExperienceId {
  private constructor(private readonly value: string) {}

  static create(value: string): ExperienceId {
    if (!value || value.trim().length === 0) {
      throw new Error('ExperienceId ne peut pas être vide');
    }
    return new ExperienceId(value);
  }

  static generate(): ExperienceId {
    return new ExperienceId(crypto.randomUUID());
  }

  toString(): string {
    return this.value;
  }

  equals(other: ExperienceId): boolean {
    return this.value === other.value;
  }
}
