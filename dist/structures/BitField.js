"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitField = void 0;
class BitField {
    bitset = 0;
    set(bits) {
        if (Array.isArray(bits)) {
            for (const bit of bits) {
                this.bitset |= bit;
            }
        }
        else {
            this.bitset |= bits;
        }
        return this.bitset;
    }
    unset(bits) {
        if (Array.isArray(bits)) {
            for (const bit of bits) {
                this.bitset &= ~bit;
            }
        }
        else {
            this.bitset &= ~bits;
        }
        return this.bitset;
    }
    has(bits) {
        if (Array.isArray(bits)) {
            for (const bit of bits) {
                if (!!(this.bitset & bit)) {
                    return false;
                }
            }
        }
        else {
            if (!!(this.bitset & bits)) {
                return false;
            }
        }
        return true;
    }
    toString() {
        return this.bitset.toString();
    }
}
exports.BitField = BitField;
