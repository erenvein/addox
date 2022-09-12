import type { APIApplicationCommandUserOption } from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandUserOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public constructor(data?: APIApplicationCommandUserOption) {
        super('User', data);
    }
}
