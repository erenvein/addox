export function HexToHexDecimal(color: `#${string}`) {
    return parseInt(color.replace(/^#/g, ''), 16);
}
