import {
    type APIInteraction,
    type Client,
    type Snowflake,
    type LocalizationMap,
    type APIMessage,
    type APIGuildMember,
    Message,
    PermissionFlagsBitField,
    InteractionType,
    User,
    GuildMember,
} from '../../index';

import { BaseStructure } from './BaseStructure';

export class BaseInteraction extends BaseStructure {
    public applicationPermissions!: PermissionFlagsBitField;
    public applicationId!: Snowflake;
    public channelId!: Snowflake | null;
    public guildId!: Snowflake | null;
    public guildLocale!: LocalizationMap | null;
    public id!: Snowflake;
    public member!: GuildMember | APIGuildMember | null;
    public message!: Message | APIMessage | null;
    public token!: string;
    public type!: keyof typeof InteractionType;
    public user!: User | null;
    public version!: number;

    public constructor(client: Client, data: APIInteraction) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIInteraction) {
        this.applicationPermissions = new PermissionFlagsBitField(
            data.app_permissions ? +data.app_permissions : 0
        );
        this.applicationId = data.application_id;
        this.channelId = data.channel_id ?? null;
        this.guildId = data.guild_id ?? null;
        this.guildLocale = (data.guild_locale as LocalizationMap) ?? null;
        this.id = data.id;
        this.member =
            this.guild && data.member
                ? new GuildMember(this.client, this.guild, data.member)
                : data.member ?? null;
        this.message = data.message ?? null;
        this.token = data.token;
        this.type = InteractionType[data.type] as keyof typeof InteractionType;
        this.user = data.user
            ? this.client.caches.users.cache._add(data.user.id, new User(this.client, data.user))
            : null;
        this.version = data.version;

        return this;
    }

    public get channel() {
        return this.client.caches.channels.cache.get(this.channelId!);
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }
}
