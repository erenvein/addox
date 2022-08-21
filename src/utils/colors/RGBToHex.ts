import type { RGBResolvable } from '../../index';

export function RGBToHex({ r, g, b }: RGBResolvable): `#${string}` {
    return `#${[r, g, b]
        .map((component) => {
            const hex = component.toString(16);
            return hex.length === 1 ? `0${hex}` : hex;
        })
        .join('')}`;
}
