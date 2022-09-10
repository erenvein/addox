import type { LocalizationMap, APIApplicationCommandNumberOption } from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandNumberOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public autocomplete: boolean;
    public description!: string;
    public description_localizations?: LocalizationMap;
    public max_length?: number;
    public min_length?: number;
    public name!: string;
    public name_localizations?: LocalizationMap;
    public required: boolean;

    public constructor(data?: APIApplicationCommandNumberOption) {
        super('Number');

        this.autocomplete = data?.autocomplete ?? false;
        //@ts-ignore
        this.description = data?.description;
        //@ts-ignore
        this.description_localizations = data?.description_localizations;
        this.max_length = data?.max_value;
        this.min_length = data?.min_value;
        //@ts-ignore
        this.name = data?.name;
        //@ts-ignore
        this.name_localizations = data?.name_localizations;
        this.required = data?.required ?? false;
    }

    public setAutocomplete(autocomplete: boolean) {
        return this.set('autocomplete', autocomplete);
    }

    public setDescription(description: string) {
        return this.set('description', description);
    }

    public setDescriptionLocalizations(localizations: LocalizationMap) {
        return this.set('description_localizations', localizations);
    }

    public setMaxValue(maxValue: number) {
        return this.set('max_value', maxValue);
    }

    public setMinValue(minValue: number) {
        return this.set('min_value', minValue);
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
