import {
    type LocalizationMap,
    type APIApplicationCommandOptionData,
    APIApplicationCommandSubcommandOption,
    ApplicationCommandAttachmentOptionBuilder,
    ApplicationCommandBooleanOptionBuilder,
    ApplicationCommandChannelOptionBuilder,
    ApplicationCommandIntegerOptionBuilder,
    ApplicationCommandMentionableOptionBuilder,
    ApplicationCommandNumberOptionBuilder,
    ApplicationCommandRoleOptionBuilder,
    ApplicationCommandStringOptionBuilder,
    ApplicationCommandUserOptionBuilder,
    ApplicationCommandSubcommandGroupOptionBuilder,
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandSubcommandOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public description!: string;
    public description_localizations?: LocalizationMap;
    public name!: string;
    public name_localizations?: LocalizationMap;
    public required: boolean;
    public options!: APIApplicationCommandOptionData[];

    public constructor(data?: APIApplicationCommandSubcommandOption) {
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
        //@ts-ignore
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

    public addAttachmentOption(
        callbackfn: (builder: ApplicationCommandAttachmentOptionBuilder) => void
    ) {
        this._optionAdapterCreator(new ApplicationCommandAttachmentOptionBuilder(), callbackfn);
        return this;
    }

    public addBooleanOption(callbackfn: (builder: ApplicationCommandBooleanOptionBuilder) => void) {
        this._optionAdapterCreator(new ApplicationCommandBooleanOptionBuilder(), callbackfn);
        return this;
    }

    public addChannelOption(callbackfn: (builder: ApplicationCommandChannelOptionBuilder) => void) {
        this._optionAdapterCreator(new ApplicationCommandChannelOptionBuilder(), callbackfn);
        return this;
    }

    public addIntegerOption(callbackfn: (builder: ApplicationCommandIntegerOptionBuilder) => void) {
        this._optionAdapterCreator(new ApplicationCommandIntegerOptionBuilder(), callbackfn);
        return this;
    }

    public addMentionableOption(
        callbackfn: (builder: ApplicationCommandMentionableOptionBuilder) => void
    ) {
        this._optionAdapterCreator(new ApplicationCommandMentionableOptionBuilder(), callbackfn);
        return this;
    }

    public addNumberOption(callbackfn: (builder: ApplicationCommandNumberOptionBuilder) => void) {
        this._optionAdapterCreator(new ApplicationCommandNumberOptionBuilder(), callbackfn);
        return this;
    }

    public addRoleOption(callbackfn: (builder: ApplicationCommandRoleOptionBuilder) => void) {
        this._optionAdapterCreator(new ApplicationCommandRoleOptionBuilder(), callbackfn);
        return this;
    }

    public addStringOption(callbackfn: (builder: ApplicationCommandBooleanOptionBuilder) => void) {
        this._optionAdapterCreator(new ApplicationCommandStringOptionBuilder(), callbackfn);
        return this;
    }

    public addUserOption(callbackfn: (builder: ApplicationCommandUserOptionBuilder) => void) {
        this._optionAdapterCreator(new ApplicationCommandUserOptionBuilder(), callbackfn);
        return this;
    }

    private _optionAdapterCreator(builder: any, callbackfn: Function) {
        callbackfn(builder);
        this.options?.push(builder);
    }
}
