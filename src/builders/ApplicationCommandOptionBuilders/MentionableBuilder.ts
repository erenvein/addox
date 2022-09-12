import type { APIApplicationCommandMentionableOption } from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandMentionableOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public constructor(data?: APIApplicationCommandMentionableOption) {
        super('Mentionable', data);
    }
}
