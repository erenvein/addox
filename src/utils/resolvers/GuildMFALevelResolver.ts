import { type GuildMFALevelResolvable, GuildMFALevel } from '../..';

export function GuildMFALevelResolver(level: GuildMFALevelResolvable): number {
    let res = level;

    if (typeof level === 'string') {
        res = GuildMFALevel[level] as unknown as number;
    }

    return res as number;
}
