//@ts-nocheck

import { BitField, UserPremiumTypeResolvable, UserPremiumTypeResolver } from '..';

export class UserPremiumTypeBitField extends BitField {
    public override set(bits: UserPremiumTypeResolvable) {
        return super.set(UserPremiumTypeResolver(bits));
    }

    public override unset(bits: UserPremiumTypeResolvable) {
        return super.unset(UserPremiumTypeResolver(bits));
    }

    public override has(bits: UserPremiumTypeResolvable) {
        return super.has(UserPremiumTypeResolver(bits));
    }
}
