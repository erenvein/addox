import { type ColorResolvable, Colors, HexToHexDecimal, RGBToHex } from '../../index';

export function ColorResolver(color: ColorResolvable): number {
    let res = color;

    if (typeof color === 'string') {
        if (color.startsWith('#')) {
            res = HexToHexDecimal(color);
        } else {
            res = Colors[color as keyof typeof Colors];
        }
    } else if (typeof color === 'object' && 'r' in color && 'g' in color && 'b' in color) {
        res = RGBToHex(color);
        res = HexToHexDecimal(res);
    }

    return res as number;
}
