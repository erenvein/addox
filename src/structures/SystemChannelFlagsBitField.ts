//@ts-nocheck

import { BitField, SystemChannelFlagsBitsResolvable, SystemChannelFlagsBitsResolver } from '..';

export class SystemChannelFlagsBitField extends BitField {
    public override set(bits: SystemChannelFlagsBitsResolvable) {
        return super.set(SystemChannelFlagsBitsResolver(bits));
    }

    public override unset(bits: SystemChannelFlagsBitsResolvable) {
        return super.unset(SystemChannelFlagsBitsResolver(bits));
    }

    public override has(bits: SystemChannelFlagsBitsResolvable) {
        return super.has(SystemChannelFlagsBitsResolver(bits));
    }
}
