export class BitField {
    public bitset: number;

    public constructor(defaultBitset: number = 0) {
        this.bitset = defaultBitset;
    }

    public set(bits: number | number[]) {
        if (Array.isArray(bits)) {
            for (const bit of bits) {
                this.bitset |= bit;
            }
        } else {
            this.bitset |= bits;
        }

        return this.bitset;
    }

    public unset(bits: number | number[]) {
        if (Array.isArray(bits)) {
            for (const bit of bits) {
                this.bitset &= ~bit;
            }
        } else {
            this.bitset &= ~bits;
        }

        return this.bitset;
    }

    public has(bits: number | number[]) {
        if (Array.isArray(bits)) {
            for (const bit of bits) {
                if (!!(this.bitset & bit)) {
                    return false;
                }
            }
        } else {
            if (!!(this.bitset & bits)) {
                return false;
            }
        }

        return true;
    }

    public toString() {
        return this.bitset.toString();
    }
}
