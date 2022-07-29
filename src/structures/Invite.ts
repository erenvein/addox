import {
    type APIInvite,
    type Client,
    type Snowflake,
    User,
    InviteTargetType,
    type GatewayInviteCreateDispatchData,
    InviteApplication,
    GuildScheduledEvent,
} from '../index';
import { BaseStructure } from './BaseStructure';

export class Invite extends BaseStructure {
    public approximateMemberCount!: number | null;
    public approximatePresenceCount!: number | null;
    public channelId!: Snowflake | null;
    public code!: string;
    public expiresTimestamp!: number | null;
    public guildId!: Snowflake | null;
    public inviter!: User | null;
    public targetType!: keyof typeof InviteTargetType | null;
    public targetUser!: User | null;
    public createdTimestamp!: number | null;
    public uses!: number;
    public temporary!: boolean;
    public maximumAge!: number | null;
    public maximumUses!: number | null;
    public targetApplication!: InviteApplication | null;
    public guildScheduledEvent!: GuildScheduledEvent | null;

    public constructor(client: Client, data: GatewayInviteCreateDispatchData | APIInvite) {
        super(client);

        this._patch(data);
    }

    public _patch(data: GatewayInviteCreateDispatchData | APIInvite) {
        this.code = data.code;
        this.inviter = data.inviter
            ? this.client.caches.users.cache._add(
                  data.inviter.id,
                  new User(this.client, data.inviter)
              )
            : null;
        this.targetType = data.target_type
            ? (InviteTargetType[data.target_type] as keyof typeof InviteTargetType)
            : null;
        this.targetUser = data.target_user
            ? this.client.caches.users.cache._add(
                  data.target_user.id,
                  new User(this.client, data.target_user)
              )
            : null;

        if ('channel' in data) {
            this.channelId = data.channel?.id ?? null;
        } else {
            this.channelId ??= null;
        }

        if ('guild' in data) {
            this.guildId = data.guild?.id ?? null;
        } else {
            this.guildId ??= null;
        }

        if ('approximate_member_count' in data) {
            this.approximateMemberCount = data.approximate_member_count ?? null;
        } else {
            this.approximateMemberCount ??= null;
        }

        if ('approximate_presence_count' in data) {
            this.approximatePresenceCount = data.approximate_presence_count ?? null;
        } else {
            this.approximatePresenceCount ??= null;
        }

        if ('expires_at' in data) {
            this.expiresTimestamp = new Date(data.expires_at!).getTime() ?? null;
        } else {
            this.expiresTimestamp ??= null;
        }

        if ('guild_id' in data) {
            this.guildId = data.guild_id ?? null;
        } else {
            this.guildId ??= null;
        }

        if ('created_at' in data) {
            this.createdTimestamp = new Date(data.created_at!).getTime() ?? null;
        } else {
            this.createdTimestamp ??= null;
        }

        if ('uses' in data) {
            this.uses = data.uses;
        } else {
            this.uses ??= 0;
        }

        if ('temporary' in data) {
            this.temporary = data.temporary;
        } else {
            this.temporary ??= false;
        }

        if ('max_age' in data) {
            this.maximumAge = data.max_age;
        } else {
            this.maximumAge ??= null;
        }

        if ('max_uses' in data) {
            this.maximumUses = data.max_uses;
        } else {
            this.maximumUses ??= null;
        }

        this.targetApplication = data.target_application
            ? new InviteApplication(this.client, data.target_application)
            : null;

        if ('guild_scheduled_event' in data) {
            this.guildScheduledEvent = data.guild_scheduled_event
                ? new GuildScheduledEvent(this.client, data.guild_scheduled_event)
                : null;
        } else {
            this.guildScheduledEvent ??= null;
        }

        return this;
    }

    public delete(reason?: string) {
        // TODO
    }

    public edit() {
        // TODO
    }

    public fetch() {
        // TODO
    }

    public get channel() {
        return this.guild!.caches.channels.cache.get(this.channelId!);
    }

    public get guild() {
        return this.client.caches.guilds.cache.get(this.guildId!);
    }

    public get url() {
        return `https://discord.com/invite/${this.code}`;
    }
}
