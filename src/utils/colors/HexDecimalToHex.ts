export function HexDecimalToHex(color: number) {
    return `#${color.toString(16).padStart(6, '0')}`;
}
