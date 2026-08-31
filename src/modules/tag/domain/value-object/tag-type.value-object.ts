export enum TagTypeEnum {
    STACK = 'stack',
    SOFT_SKILL = 'soft-skill',
    AUTRE = 'autre'
};

export class TagType {
    private constructor(private readonly type: TagTypeEnum) {}

    static create(value: TagTypeEnum): TagType {
        if(!Object.values(TagTypeEnum).includes(value)) {
            throw new Error('type de tag invalide: '+value);
        }

        return new TagType(value);
    }

    get value(): TagTypeEnum {
        return this.type;
    }

    equals(other: TagType): boolean {
        return this.type === other.type;
    }
}