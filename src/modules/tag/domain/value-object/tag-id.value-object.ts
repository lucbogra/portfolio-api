export class TagId {
    private constructor(private readonly value: string) { }

    static create(value: string) : TagId {
        if(!value || value.trim().length === 0 ) {
            throw Error('TagId ne peut pas être vide.');
        }
        return new TagId(value);
    }

    static generate(): TagId {
        return new TagId(crypto.randomUUID());
    }

    toString(): string {
        return this.value;
    }

    equals(other: TagId): boolean {
        return this.value === other.value;
    }
}