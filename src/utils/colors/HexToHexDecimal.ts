export function HexToHexDecimal(color: string) {
    return parseInt(color.replace(/^#/, ''), 16);
}
