import { InvalidLienError } from "./lien.errors.js";

export class Lien {
    private constructor(private readonly url: string) {}

    static create(url: string): Lien {
        try {
            new URL(url);
        } catch {
            throw new InvalidLienError(url)
        }
        return new Lien(url);
    }

    toString(): string {
        return this.url;
    }
}