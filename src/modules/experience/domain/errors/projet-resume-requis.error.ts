export class ProjetResumeRequisError extends Error {
  constructor() {
    super(
      'Un projet mis en avant doit avoir un résumé non vide',
    );
    this.name = 'ProjetResumeRequisError';
  }
}
