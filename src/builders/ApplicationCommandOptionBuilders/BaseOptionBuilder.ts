import { ApplicationCommandOptionType } from '../../index';

import { BaseBuilder } from '../BaseBuilder';

export class ApplicationCommandBaseOptionBuilder extends BaseBuilder {
    public type: ApplicationCommandOptionType;

    public constructor(type: keyof typeof ApplicationCommandOptionType) {
        super();

        this.type = ApplicationCommandOptionType[type];
    }
}
