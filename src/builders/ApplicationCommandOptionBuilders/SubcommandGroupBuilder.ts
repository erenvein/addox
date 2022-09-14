import {
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandSubcommandOption,
    ApplicationCommandSubcommandOptionBuilder,
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandSubcommandGroupOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public options!: APIApplicationCommandSubcommandOption[];

    public constructor(data?: APIApplicationCommandSubcommandGroupOption) {
        super('SubcommandGroup', data);

        this.options = data?.options ?? [];
    }

    public addSubcommand(callbackfn: (builder: ApplicationCommandSubcommandOptionBuilder) => void) {
        const builder = new ApplicationCommandSubcommandOptionBuilder();

        callbackfn(builder);
        //@ts-ignore
        this.options.push(builder);

        return this;
    }
}
