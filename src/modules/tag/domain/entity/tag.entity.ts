import { TagId } from "../value-object/tag-id.value-object.js";
import { TagType } from "../value-object/tag-type.value-object.js";

export interface CreateTagParams {
    id: TagId;
    nom: string;
    type: TagType;
}

export interface UpdateTagParams {
    nom: string;
    type: TagType;
}

export class Tag {
    private constructor(
        private readonly _id: TagId,
        private _nom: string,
        private _type: TagType
    ) {}

    static create(params: CreateTagParams): Tag {
        return new Tag(
            params.id,
            params.nom,
            params.type
        );
    }

    get id(): TagId {
        return this._id;
    }

    get nom(): string {
        return this._nom;
    }

    get type(): TagType {
        return this._type;
    }

    update(params: UpdateTagParams): void {
        this._nom = params.nom;
        this._type = params.type;
    }

}