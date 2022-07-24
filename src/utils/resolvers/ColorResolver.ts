import { type ColorResolvable, Colors, HexToHexDecimal } from '../../index';

export function ColorResolver(color: ColorResolvable): number {
    let res = color;

    if (typeof color === 'string' && Colors[color]) {
        res = Colors[color];
    } else if (typeof color === 'string') {
        color = HexToHexDecimal(color);
    }

    return res as number;
}
