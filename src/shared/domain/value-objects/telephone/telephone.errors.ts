export class InvalidTelephoneError extends Error {
  constructor(raw: string) {
    super(
      `Numéro de téléphone invalide : "${raw}" (format international E.164 attendu, ex: +212612345678)`,
    );
    this.name = 'InvalidTelephoneError';
  }
}
