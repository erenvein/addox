import { BitField, UserFlagsBitsResolvable, UserFlagsBitsResolver } from '..';

export class UserFlagsBitField extends BitField {
    public override set(bits: UserFlagsBitsResolvable) {
        return super.set(UserFlagsBitsResolver(bits));
    }

    public override unset(bits: UserFlagsBitsResolvable) {
        return super.unset(UserFlagsBitsResolver(bits));
    }

    public override has(bits: UserFlagsBitsResolvable) {
        return super.has(UserFlagsBitsResolver(bits));
    }
}
