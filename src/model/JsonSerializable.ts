export class JsonSerializable<T> {
    static fromJson<T>(o: Object, c: new () => T): T {
        return Object.assign(new c(), o);
    }

    toJson(): string {
        return JSON.stringify(this);
    }
}