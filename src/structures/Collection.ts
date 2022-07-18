export class Collection<K, V> extends Map<K, V> {
    public find(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                return value;
            }
        }

        return undefined;
    }

    public findKey(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                return key;
            }
        }

        return undefined;
    }

    public filter(fn: (value: V, key: K, collection: this) => boolean) {
        const finded = new Collection<K, V>();

        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                finded.set(key, value);
            }
        }

        return finded;
    }

    public map<T>(fn: (value: V, key: K, collection: this) => T) {
        const mapped = new Collection<K, T>();

        for (const [key, value] of this.entries()) {
            mapped.set(key, fn(value, key, this));
        }

        return mapped;
    }

    public some(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (fn(value, key, this)) {
                return true;
            }
        }

        return false;
    }

    public every(fn: (value: V, key: K, collection: this) => boolean) {
        for (const [key, value] of this.entries()) {
            if (!fn(value, key, this)) {
                return false;
            }
        }

        return true;
    }

    public sort(fn: (a: V, b: V, collection: this) => number) {
        const sorted = new Collection<K, V>();

        for (const [key, value] of this.entries()) {
            let inserted = false;

            for (const [key2, value2] of sorted.entries()) {
                if (fn(value, value2, this) < 0) {
                    sorted.set(key, value);
                    inserted = true;
                    break;
                }
            }

            if (!inserted) {
                sorted.set(key, value);
            }
        }

        return sorted;
    }

    public reduce<T>(
        fn: (accumulator: T, value: V, key: K, collection: this) => V,
        initialValue: T
    ): T {
        let accumulator = initialValue;

        for (const [key, value] of this.entries()) {
            accumulator = fn(accumulator, value, key, this) as unknown as T;
        }

        return accumulator;
    }

    public random() {
        return this.array()[Math.floor(Math.random() * this.size)];
    }

    public randomKey() {
        return this.keyArray()[Math.floor(Math.random() * this.size)];
    }

    public first(): V {
        return this.array()[0];
    }

    public firstKey() {
        return this.keyArray()[0];
    }

    public last() {
        return this.array()[this.size - 1];
    }

    public lastKey() {
        return this.keyArray()[this.size - 1];
    }

    public array() {
        return [...this.values()];
    }

    public keyArray() {
        return [...this.keys()];
    }
}
