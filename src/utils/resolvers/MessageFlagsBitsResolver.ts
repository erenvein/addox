import { type MessageFlagsBitsResolvable, MessageFlags } from '../../index';

export function MessageFlagsBitsResolver(flags: MessageFlagsBitsResolvable): number {
    let res = flags;

    if (typeof flags === 'string') {
        res = MessageFlags[flags];
    }

    return res as number;
}
