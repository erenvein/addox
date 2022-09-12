import type { APIApplicationCommandAttachmentOption } from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandAttachmentOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public constructor(data?: APIApplicationCommandAttachmentOption) {
        super('Attachment', data);
    }
}
