//@ts-nocheck

import { BitField, PermissionFlagsBitsResolvable, UserPremiumTypeResolver } from '..';

export class PermissionFlagsBitField extends BitField {
    public override set(bits: PermissionFlagsBitsResolvable) {
        return super.set(UserPremiumTypeResolver(bits));
    }

    public override unset(bits: PermissionFlagsBitsResolvable) {
        return super.unset(UserPremiumTypeResolver(bits));
    }

    public override has(bits: PermissionFlagsBitsResolvable) {
        return super.has(UserPremiumTypeResolver(bits));
    }
}
