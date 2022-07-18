import { BitField, UserPremiumType } from '..';

export class UserPremiumTypeBitField extends BitField {
    public override Flags = UserPremiumType;
}
