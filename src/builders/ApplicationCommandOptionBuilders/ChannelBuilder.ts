import {
    APIApplicationCommandChannelOption,
    GuildBasedChannelTypes,
    GuildBasedChannelTypesResolvable,
    ChannelType,
} from '../../index';

import { ApplicationCommandBaseOptionBuilder } from './BaseOptionBuilder';

export class ApplicationCommandChannelOptionBuilder extends ApplicationCommandBaseOptionBuilder {
    public channel_types: GuildBasedChannelTypes[];

    public constructor(data?: APIApplicationCommandChannelOption) {
        super('Channel', data);

        this.channel_types = data?.channel_types ?? [];
    }

    public setChannelTypes(types: GuildBasedChannelTypesResolvable[]) {
        const resolved = [];

        for (const type of types) {
            if (typeof type === 'string') resolved.push(ChannelType[type]);
            else resolved.push(type);
        }

        return this.set('channel_types', resolved);
    }
}
