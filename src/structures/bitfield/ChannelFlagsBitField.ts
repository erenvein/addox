//@ts-nocheck

import { BitField, ChannelFlagsBitsResolvable, ChannelFlagsBitsResolver } from '../../index';

export class ChannelFlagsBitField extends BitField {
    public override set(bits: ChannelFlagsBitsResolvable) {
        return super.set(ChannelFlagsBitsResolver(bits));
    }

    public override unset(bits: ChannelFlagsBitsResolvable) {
        return super.unset(ChannelFlagsBitsResolver(bits));
    }

    public override has(bits: ChannelFlagsBitsResolvable) {
        return super.has(ChannelFlagsBitsResolver(bits));
    }
}
