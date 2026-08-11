export class ArticleId {
    private constructor(private readonly value: string) {}

    static create(value: string) : ArticleId {
        if(!value || value.trim.length === 0) {
            throw Error('ArticleId ne peut être vide');
        }
        return new ArticleId(value);
    }

    static generate(): ArticleId {
        return new ArticleId(crypto.randomUUID());
    }

    toString() : string {
        return this.value;
    }

    equals(other: ArticleId): boolean {
        return this.value === other.value;
    }
}