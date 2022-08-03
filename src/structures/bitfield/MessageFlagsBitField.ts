//@ts-nocheck

import {
    BitField,
    MessageFlagsBitsResolvable,
    MessageFlagsBitsResolver,
} from '../../index';

export class MessageFlagsBitField extends BitField {
    public override set(bits: MessageFlagsBitsResolvable) {
        return super.set(MessageFlagsBitsResolver(bits));
    }

    public override unset(bits: MessageFlagsBitsResolvable) {
        return super.unset(MessageFlagsBitsResolver(bits));
    }

    public override has(bits: MessageFlagsBitsResolvable) {
        return super.has(MessageFlagsBitsResolver(bits));
    }
}
