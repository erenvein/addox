import type {
    APIApplicationCommandNumberOption,
    APIApplicationCommandOptionChoice,
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandNumberOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public autocomplete: boolean;
    public max_length?: number;
    public min_length?: number;
    public choices!: APIApplicationCommandOptionChoice<number>[];

    public constructor(data?: APIApplicationCommandNumberOption) {
        super('Number', data);

        this.autocomplete = data?.autocomplete ?? false;
        this.max_length = data?.max_value;
        this.min_length = data?.min_value;
        //@ts-ignore
        this.choices = data?.choices ?? [];
    }

    public setAutocomplete(autocomplete: boolean) {
        return this.set('autocomplete', autocomplete);
    }

    public setMaxValue(maxValue: number) {
        return this.set('max_value', maxValue);
    }

    public setMinValue(minValue: number) {
        return this.set('min_value', minValue);
    }

    public setChoices(choices: APIApplicationCommandOptionChoice<number>[]) {
        return this.set('choices', choices);
    }
}
