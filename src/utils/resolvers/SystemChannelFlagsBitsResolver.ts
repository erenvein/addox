import { type SystemChannelFlagsBitsResolvable, GuildSystemChannelFlags } from '../..';

export function SystemChannelFlagsBitsResolver(
    flags: SystemChannelFlagsBitsResolvable
): number | number[] {
    let res = flags;

    if (typeof flags === 'string') {
        res = GuildSystemChannelFlags[flags] as unknown as number;
    } else if (Array.isArray(flags)) {
        res = flags.map((flag) =>
            typeof flag === 'string' ? GuildSystemChannelFlags[flag] : flag
        ) as number[];
    }

    return res as number | number[];
}
