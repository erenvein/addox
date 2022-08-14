export class BaseBuilder {
    public set(key: string, value: any) {
        Object.defineProperty(this, key, { value });
        return this;
    }
}
