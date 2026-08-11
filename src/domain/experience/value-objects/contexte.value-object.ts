export enum ContexteType {
    FREELANCE = 'freelance',
    CDI = 'cdi',
    CONSULTANT = 'consultant',
    CDD = 'cdd'
}

export class Contexte {
    private constructor(private readonly type: ContexteType) {}

    static create(type: ContexteType): Contexte {
        if(!Object.values(ContexteType).includes(type)) {
            throw new Error(`Contexte invalide : "${type}"`);
        }
        return new Contexte(type);
    }

    get value(): ContexteType {
        return this.type;
    }

    equals(other: Contexte): boolean {
        return this.type === other.type;
    }
}