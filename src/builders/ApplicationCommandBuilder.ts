import {
    type LocalizationMap,
    type APICreateCommandData,
    type PermissionFlagsBitsResolvable,
    type ApplicationCommandTypeResolvable,
    PermissionFlagsBitsResolver,
    ApplicationCommandType,
    APIApplicationCommandOptionData,
    ApplicationCommandAttachmentOptionBuilder,
    ApplicationCommandBooleanOptionBuilder,
    ApplicationCommandChannelOptionBuilder,
    ApplicationCommandIntegerOptionBuilder,
    ApplicationCommandMentionableOptionBuilder,
    ApplicationCommandNumberOptionBuilder,
    ApplicationCommandRoleOptionBuilder,
    ApplicationCommandStringOptionBuilder,
    ApplicationCommandUserOptionBuilder,
    ApplicationCommandSubcommandOptionBuilder,
    ApplicationCommandSubcommandGroupOptionBuilder,
} from '../index';

import { BaseBuilder } from './BaseBuilder';

export class ApplicationCommandBuilder extends BaseBuilder {
    public name!: string;
    public name_localizations?: LocalizationMap;
    public description!: string;
    public description_localizations?: LocalizationMap;
    public options?: APIApplicationCommandOptionData[];
    public default_member_permissions?: string;
    public dm_permission?: boolean;
    public type?: ApplicationCommandType;

    public constructor(data?: APICreateCommandData) {
        super();

        this.default_member_permissions = data?.default_member_permissions;
        //@ts-ignore
        this.description = data?.description;
        this.description_localizations = data?.description_localizations;
        this.dm_permission = data?.dm_permission;
        //@ts-ignore
        this.name = data?.name;
        this.name_localizations = data?.name_localizations;
        this.options = data?.options ?? [];
        this.type = data?.type ?? ApplicationCommandType.ChatInput;
    }

    public setDefaultMemberPermissions(permissions: PermissionFlagsBitsResolvable) {
        return this.set('default_member_permissions', PermissionFlagsBitsResolver(permissions));
    }

    public setDescription(description: string) {
        return this.set('description', description);
    }

    public setDescriptionLocalizations(localizations: LocalizationMap) {
        return this.set('description_localizations', localizations);
    }

    public setDmPermission(dmPermission: boolean) {
        return this.set('dm_permission', dmPermission);
    }

    public setName(name: string) {
        return this.set('name', name);
    }

    public setNameLocalizations(localizations: LocalizationMap) {
        return this.set('name_localizations', localizations);
    }

    public setOptions(options: any[]) {
        return this.set('options', options);
    }

    public setType(type: ApplicationCommandTypeResolvable) {
        return this.set('type', typeof type === 'number' ? type : ApplicationCommandType[type]);
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

    public addSubcommandOption(
        callbackfn: (builder: ApplicationCommandSubcommandOptionBuilder) => void
    ) {
        this._optionAdapterCreator(new ApplicationCommandSubcommandOptionBuilder(), callbackfn);
        return this;
    }

    public addSubcommandGroupOption(
        callbackfn: (builder: ApplicationCommandSubcommandGroupOptionBuilder) => void
    ) {
        this._optionAdapterCreator(
            new ApplicationCommandSubcommandGroupOptionBuilder(),
            callbackfn
        );
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
