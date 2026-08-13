export class ProjectHorsPeriodeError extends Error {
  constructor() {
    super(
      "Le projet ne peut pas avoir une période en dehors de celle de l'expérience parente",
    );
    this.name = 'ProjetHorsPeriodeError';
  }
}
