import { ApplicationCommandOptionType, LocalizationMap } from '../../index';

import { BaseBuilder } from '../BaseBuilder';

export class ApplicationCommandBaseOptionBuilder extends BaseBuilder {
    public type: ApplicationCommandOptionType;
    public description!: string;
    public description_localizations?: LocalizationMap;
    public name!: string;
    public name_localizations?: LocalizationMap;
    public required: boolean;

    public constructor(
        type: keyof typeof ApplicationCommandOptionType,
        data: {
            description?: string;
            description_localizations?: LocalizationMap;
            name?: string;
            name_localizations?: LocalizationMap;
            required?: boolean;
        }
    ) {
        super();

        this.type = ApplicationCommandOptionType[type];
        //@ts-ignore
        this.description = data?.description;
        //@ts-ignore
        this.description_localizations = data?.description_localizations;
        //@ts-ignore
        this.name = data?.name;
        //@ts-ignore
        this.name_localizations = data?.name_localizations;
        this.required = data?.required ?? false;
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
}
