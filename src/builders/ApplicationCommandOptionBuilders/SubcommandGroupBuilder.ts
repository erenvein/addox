import {
    LocalizationMap,
    APIApplicationCommandSubcommandGroupOption,
    APIApplicationCommandSubcommandOption,
    ApplicationCommandSubcommandOptionBuilder,
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandSubcommandGroupOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public description!: string;
    public description_localizations?: LocalizationMap;
    public name!: string;
    public name_localizations?: LocalizationMap;
    public required: boolean;
    public options!: APIApplicationCommandSubcommandOption[];

    public constructor(data?: APIApplicationCommandSubcommandGroupOption) {
        super('Subcommand');

        //@ts-ignore
        this.description = data?.description;
        //@ts-ignore
        this.description_localizations = data?.description_localizations;
        //@ts-ignore
        this.name = data?.name;
        //@ts-ignore
        this.name_localizations = data?.name_localizations;
        this.required = data?.required ?? false;
        this.options = data?.options ?? [];
    }

    public setDescription(description: string) {
        return this.set('description', description);
    }

    public setDescriptionLocalizations(localizations: LocalizationMap) {
        return this.set('description_localizations', localizations);
    }

    public setName(name: string) {
        return this.set('name', name);
    }

    public setNameLocalizations(localizations: LocalizationMap) {
        return this.set('name_localizations', localizations);
    }

    public setRequired(required: boolean) {
        return this.set('required', required);
    }

    public addSubcommand(
        callbackfn: (builder: ApplicationCommandSubcommandOptionBuilder) => void
    ) {
        const builder = new ApplicationCommandSubcommandOptionBuilder();

        callbackfn(builder);
        //@ts-ignore
        this.options.push(builder);

        return this;
    }
}
