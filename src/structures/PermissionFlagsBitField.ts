//@ts-nocheck

import { BitField, PermissionFlagsBitsResolvable, PermissionFlagsBitsResolver } from '..';

export class PermissionFlagsBitField extends BitField {
    public override set(bits: PermissionFlagsBitsResolvable) {
        return super.set(PermissionFlagsBitsResolver(bits));
    }

    public override unset(bits: PermissionFlagsBitsResolvable) {
        return super.unset(PermissionFlagsBitsResolver(bits));
    }

    public override has(bits: PermissionFlagsBitsResolvable) {
        return super.has(PermissionFlagsBitsResolver(bits));
    }
}
