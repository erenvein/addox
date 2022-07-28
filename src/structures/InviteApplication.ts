import {
    type Client,
    type APIApplication,
    type Snowflake,
    type ImageOptions,
    Team,
    PermissionFlagsBitField,
    OAuth2Scopes,
    ApplicationFlagsBitField,
} from '../index';

import { BaseStructure } from './BaseStructure';

export class InviteApplication extends BaseStructure {
    public botPublic!: boolean;
    public botRequireCodeGrant!: boolean;
    public coverImage!: string | null;
    public customInstallURL!: string | null;
    public description!: string | null;
    public flags!: ApplicationFlagsBitField;
    public guildId!: Snowflake | null;
    public icon!: string | null;
    public id!: Snowflake | null;
    public installParams!: {
        scopes: (keyof typeof OAuth2Scopes)[];
        permissions: PermissionFlagsBitField;
    } | null;
    public name!: string | null;
    public ownerId!: Snowflake | null;
    public primarySkuId!: Snowflake | null;
    public privacyPolicyURL!: string | null;
    public rpcOrigins!: string[];
    public slug!: string | null;
    public tags!: string[];
    public team!: Team | null;
    public termsOfServiceURL!: string | null;
    public verifyKey!: string | null;

    public constructor(client: Client, data: Partial<APIApplication>) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: Partial<APIApplication>) {
        this.botPublic = data.bot_public ?? false;
        this.botRequireCodeGrant = data.bot_require_code_grant ?? false;
        this.coverImage = data.cover_image ?? null;
        this.customInstallURL = data.custom_install_url ?? null;
        this.description = data.description ?? null;
        this.flags = new ApplicationFlagsBitField(data.flags ?? 0);
        this.guildId = data.guild_id ?? null;
        this.icon = data.icon ?? null;
        this.id = data.id ?? null;
        this.installParams = data.install_params
            ? {
                  scopes: data.install_params.scopes
                      ? // @ts-ignore
                        data.install_params.scopes.map((scope) => OAuth2Scopes[scope])
                      : [],
                  permissions: new PermissionFlagsBitField(+data.install_params.permissions),
              }
            : null;
        this.name = data.name ?? null;
        this.ownerId = data.owner?.id ?? null;
        this.primarySkuId = data.primary_sku_id ?? null;
        this.privacyPolicyURL = data.privacy_policy_url ?? null;
        this.rpcOrigins = data.rpc_origins ?? [];
        this.slug = data.slug ?? null;
        // @ts-ignore
        this.tags = data.tags ?? [];
        this.team = data.team ? new Team(this.client, data.team) : null;
        this.termsOfServiceURL = data.terms_of_service_url ?? null;
        this.verifyKey = data.verify_key ?? null;

        return this;
    }

    public coverImageURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.coverImage
            ? `https://cdn.discordapp.com/icons/${this.id}/${this.coverImage}.${
                  dynamic && this.coverImage.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public iconURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.icon
            ? `https://cdn.discordapp.com/app-icons/${this.id}/${this.icon}.${
                  dynamic && this.icon.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get owner() {
        return this.client.caches.users.cache.get(this.ownerId!);
    }
}
