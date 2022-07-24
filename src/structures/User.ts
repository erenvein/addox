import {
    type APIUser,
    UserFlagsBitField,
    type Client,
    type Snowflake,
    SnowflakeUtil,
    UserPremiumType,
    type ImageOptions,
} from '../';

import { BaseStructure } from './BaseStructure';

export class User extends BaseStructure {
    public id!: Snowflake;
    public username!: string;
    public discriminator!: string;
    public avatar!: string | null;
    public bot!: boolean;
    public system!: boolean;
    public mfaEnabled!: boolean;
    public banner!: string | null;
    public accentColor!: number | null;
    public locale!: string | null;
    public verified!: boolean;
    public email!: string | null;
    public flags!: UserFlagsBitField;
    public premiumType!: keyof typeof UserPremiumType;
    public publicFlags!: UserFlagsBitField;

    public constructor(client: Client, data: APIUser) {
        super(client);

        this._patch(data);
    }

    public _patch(data: APIUser) {
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.bot = data.bot ?? false;
        this.system = data.system ?? false;
        this.mfaEnabled = data.mfa_enabled ?? false;
        this.banner = data.banner ?? null;
        this.accentColor = data.accent_color ?? null;
        this.locale = data.locale ?? null;
        this.verified = data.verified ?? false;
        this.email = data.email ?? null;
        this.flags = new UserFlagsBitField(data.public_flags as number);
        this.premiumType = data.premium_type
            ? (UserPremiumType[data.premium_type as number] as keyof typeof UserPremiumType)
            : 'None';
        this.publicFlags = new UserFlagsBitField(data.public_flags as number);

        return this;
    }

    public get tag(): string {
        return `${this.username}#${this.discriminator}`;
    }

    public get createdTimestamp() {
        return SnowflakeUtil.timestampFrom(this.id);
    }

    public get createdAt() {
        return new Date(this.createdTimestamp);
    }

    public get defaultAvatarURL() {
        return `https://cdn.discordapp.com/embed/avatars/${
            (this.discriminator as unknown as number) % 5
        }.png`;
    }

    public get presence() {
        return this.client.caches.presences.get(this.id);
    }

    public avatarURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.avatar
            ? `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${
                  dynamic && this.avatar.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : this.defaultAvatarURL;
    }

    public bannerURL({ dynamic, size, format }: ImageOptions = { dynamic: true, size: 1024 }) {
        return this.banner
            ? `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${
                  dynamic && this.banner.startsWith('a_') ? 'gif' : format ?? 'png'
              }?size=${size ?? 1024}`
            : null;
    }

    public async fetch(): Promise<User> {
        return (await this.client.caches.users.fetch(this.id)) as unknown as User;
    }
}
