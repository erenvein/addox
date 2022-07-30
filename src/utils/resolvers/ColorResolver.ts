import { type ColorResolvable, Colors, HexToHexDecimal } from '../../index';

export function ColorResolver(color: ColorResolvable): number {
    let res = color;

    if (typeof color === 'string') {
        if (color.startsWith('#')) {
            res = HexToHexDecimal(color);
        } else {
            res = Colors[color as keyof typeof Colors];
        }
    }

    return res as number;
}
