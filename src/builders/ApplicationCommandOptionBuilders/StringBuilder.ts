import type {
    APIApplicationCommandStringOption,
    APIApplicationCommandOptionChoice,
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandStringOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public autocomplete: boolean;
    public max_length?: number;
    public min_length?: number;
    public choices!: APIApplicationCommandOptionChoice<string>[];

    public constructor(data?: APIApplicationCommandStringOption) {
        super('String', data);

        this.autocomplete = data?.autocomplete ?? false;
        this.max_length = data?.max_length;
        this.min_length = data?.min_length;
        this.required = data?.required ?? false;
        //@ts-ignore
        this.choices = data?.choices ?? [];
    }

    public setAutocomplete(autocomplete: boolean) {
        return this.set('autocomplete', autocomplete);
    }

    public setMaxLength(maxLength: number) {
        return this.set('max_length', maxLength);
    }

    public setMinLength(minLength: number) {
        return this.set('min_length', minLength);
    }

    public setChoices(choices: APIApplicationCommandOptionChoice<string>[]) {
        return this.set('choices', choices);
    }
}
