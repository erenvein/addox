import { BitField, UserFlags } from '../';

export class UserFlagsBitField extends BitField {
    public override Flags = UserFlags;
}
