import type { APIPartialEmoji } from '../../index';

export const EmojiPattern = /<(a?)?:(\w+):(\d{17,19})>/;

export function EmojiResolver(emoji: APIPartialEmoji | string): APIPartialEmoji | string {
    if (typeof emoji === 'string') {
        const match = emoji.match(EmojiPattern)!;

        return { animated: !!match[0], name: match[2], id: match[3] };
    } else {
        return `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`;
    }
}
