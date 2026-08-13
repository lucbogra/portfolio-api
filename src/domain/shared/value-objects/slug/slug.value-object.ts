import { InvalidSlugError } from "./slug.errors.js";

export class Slug {
    private constructor(private readonly value: string) {}

    static create(raw: string): Slug {
        const normalized = raw.toLowerCase().trim();
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
          throw new InvalidSlugError(raw);
        }
        return new Slug(normalized);
      }
    
      toString(): string {
        return this.value;
      }
    
      equals(other: Slug): boolean {
        return this.value === other.value;
      }
}