import type { APIApplicationCommandBooleanOption } from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandBooleanOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public constructor(data?: APIApplicationCommandBooleanOption) {
        super('Boolean', data);
    }
}
