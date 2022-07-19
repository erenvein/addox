import { type UserPremiumTypeResolvable, UserPremiumType } from '../..';

export function UserPremiumTypeResolver(type: UserPremiumTypeResolvable): number {
    let res = type;

    if (typeof type === 'string') {
        res = UserPremiumType[type] as number;
    }

    return res as number;
}
