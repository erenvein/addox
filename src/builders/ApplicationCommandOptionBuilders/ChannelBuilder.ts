import type {
    LocalizationMap,
    APIApplicationCommandChannelOption,
    GuildBasedChannelTypes,
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandChannelOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public description!: string;
    public description_localizations?: LocalizationMap;
    public name!: string;
    public name_localizations?: LocalizationMap;
    public required: boolean;
    public channel_types: GuildBasedChannelTypes[];

    public constructor(data?: APIApplicationCommandChannelOption) {
        super('Channel');

        //@ts-ignore
        this.description = data?.description;
        //@ts-ignore
        this.description_localizations = data?.description_localizations;
        //@ts-ignore
        this.name = data?.name;
        //@ts-ignore
        this.name_localizations = data?.name_localizations;
        this.required = data?.required ?? false;
        this.channel_types = data?.channel_types ?? [];
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

    public setChannelTypes(types: GuildBasedChannelTypes[]) {
        return this.set('channel_types', types);
    }
}
