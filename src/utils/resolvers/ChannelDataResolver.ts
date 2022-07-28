import {
    type EditChannelData,
    PermissionFlagsBitField,
    DataResolver,
    ChannelType,
    VideoQualityMode,
    CreateGuildChannelData,
    OverwriteType,
} from '../../index';

export const ChannelPattern = /<#(!)?(\d{17,19})>/;

export async function ChannelDataResolver(channel: EditChannelData | CreateGuildChannelData) {
    const res = channel;

    if ('icon' in res) {
        res.icon = await DataResolver.resolveBase64(res.icon!);
    }

    if ('type' in res) {
        if (typeof res.type === 'string') res.type = ChannelType[res.type!];
    }

    if ('permission_overwrites' in res) {
        for (const overwrite of res.permission_overwrites!) {
            if ('allow' in overwrite) {
                overwrite.allow = new PermissionFlagsBitField().set(overwrite.allow!);
            }

            if ('deny' in overwrite) {
                overwrite.deny = new PermissionFlagsBitField().set(overwrite.deny!);
            }

            if ('type' in overwrite) {
                if (typeof overwrite.type === 'string')
                    overwrite.type = OverwriteType[overwrite.type!];
            }
        }
    }

    if ('video_quality_mode' in res) {
        if (typeof res.video_quality_mode === 'string')
            res.video_quality_mode = VideoQualityMode[res.video_quality_mode!];
    }

    if ('type' in res) {
        if (typeof res.type === 'string') res.type = ChannelType[res.type!];
    }

    return res;
}
