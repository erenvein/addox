import {
    APIVoiceBasedChannelResolvable,
    Guild,
    Client,
    VideoQualityMode,
    EditChannelData,
    FetchOptions,
    GuildChannelCacheManager,
} from '../../index';

import { BaseGuildChannel } from '../base/BaseGuildChannel';

export class VoiceChannel extends BaseGuildChannel {
    public bitrate!: number;
    public nsfw!: boolean;
    public rtcRegion!: string | null;
    public userLimit!: number;
    public videoQualityMode!: keyof typeof VideoQualityMode;
    public caches!: GuildChannelCacheManager;

    public constructor(client: Client, guild: Guild, data: APIVoiceBasedChannelResolvable) {
        super(client, guild, data);

        this._patch(data);
    }

    public override _patch(data: APIVoiceBasedChannelResolvable) {
        super._patch(data);

        this.bitrate = data.bitrate ?? 64;
        this.nsfw = data.nsfw ?? false;
        this.rtcRegion = data.rtc_region ?? null;
        this.userLimit = data.user_limit ?? 0;
        this.videoQualityMode = VideoQualityMode[
            data.video_quality_mode ?? 1
        ] as keyof typeof VideoQualityMode;

        this.caches ??= new GuildChannelCacheManager(this.client, this);

        return this;
    }

    public override async fetch(options?: FetchOptions) {
        return (await super.fetch(options)) as VoiceChannel;
    }

    public override async edit(data: EditChannelData, reason?: string) {
        return (await super.edit(data, reason)) as VoiceChannel;
    }
}
