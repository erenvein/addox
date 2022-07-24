//@ts-nocheck

import {
    BitField,
    PresenceActivityFlagsBitsResolvable,
    PresenceActivityFlagsBitsResolver,
} from '../index';

export class PresenceActivityFlagsBitField extends BitField {
    public override set(bits: PresenceActivityFlagsBitsResolvable) {
        return super.set(PresenceActivityFlagsBitsResolver(bits));
    }

    public override unset(bits: PresenceActivityFlagsBitsResolvable) {
        return super.unset(PresenceActivityFlagsBitsResolver(bits));
    }

    public override has(bits: PresenceActivityFlagsBitsResolvable) {
        return super.has(PresenceActivityFlagsBitsResolver(bits));
    }
}
