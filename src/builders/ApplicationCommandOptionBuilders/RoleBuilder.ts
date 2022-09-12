import type { APIApplicationCommandRoleOption } from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandRoleOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public constructor(data?: APIApplicationCommandRoleOption) {
        super('Role', data);
    }
}
