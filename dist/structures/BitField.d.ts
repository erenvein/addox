export declare class BitField {
    bitset: number;
    set(bits: number | number[]): number;
    unset(bits: number | number[]): number;
    has(bits: number | number[]): boolean;
    toString(): string;
}
