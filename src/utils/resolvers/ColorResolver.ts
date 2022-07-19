import { type ColorResolvable, Colors } from '../..';

export function ColorResolver(color: ColorResolvable): number {
    let res = color;

    if (typeof color === 'string' && Colors[color]) {
        res = Colors[color];
    }

    return res as number;
}
