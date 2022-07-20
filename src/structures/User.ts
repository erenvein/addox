import {
    type APIUser,
    UserFlagsBitField,
    Client,
    Snowflake,
    SnowflakeUtil,
    UserPremiumTypeBitField,
    ImageOptions,
} from '../';

export class User {
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
    public premiumType!: UserPremiumTypeBitField;
    public publicFlags!: UserFlagsBitField;
    public client: Client;

    public constructor(client: Client, data: APIUser) {
        this.client = client;

        this._patch(data);
    }

    protected _patch(data: APIUser) {
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
        this.premiumType = new UserPremiumTypeBitField(data.premium_type as number);
        this.publicFlags = new UserFlagsBitField(data.public_flags as number);
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
        const response: APIUser = await this.client.rest.get(`/users/${this.id}`);

        this._patch(response);

        return this;
    }

    public async send() {}
}
