import { type PermissionFlagsBitsResolvable, PermissionFlagsBits } from '../../index';

export function PermissionFlagsBitsResolver(
    permissions: PermissionFlagsBitsResolvable
): number | number[] {
    let res = permissions;

    if (typeof permissions === 'string') {
        res = PermissionFlagsBits[permissions] as unknown as number;
    } else if (Array.isArray(permissions)) {
        res = permissions.map((permission) =>
            typeof permission === 'string' ? PermissionFlagsBits[permission] : permission
        ) as number[];
    }

    return res as number | number[];
}
