export class BaseBuilder {
    public _change(key: string, value: any) {
        Object.defineProperty(this, key, { value });
        return this;
    }
}
