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
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandSubcommandOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public options!: APIApplicationCommandOptionData[];

    public constructor(data?: APIApplicationCommandSubcommandOption) {
        super('Subcommand', data);

        //@ts-ignore
        this.options = data?.options ?? [];
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
