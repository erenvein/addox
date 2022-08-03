//@ts-nocheck

import { BitField, ApplicationFlagsBitsResolvable, ApplicationFlagsBitsResolver } from '../../index';

export class ApplicationFlagsBitField extends BitField {
    public override set(bits: ApplicationFlagsBitsResolvable) {
        return super.set(ApplicationFlagsBitsResolver(bits));
    }

    public override unset(bits: ApplicationFlagsBitsResolvable) {
        return super.unset(ApplicationFlagsBitsResolver(bits));
    }

    public override has(bits: ApplicationFlagsBitsResolvable) {
        return super.has(ApplicationFlagsBitsResolver(bits));
    }
}
