import {
    Client,
    APIApplicationCommandInteractionDataOption,
    APIChatInputApplicationCommandInteractionDataResolved,
    Guild,
    ChatInputCommandOptionsResolver,
    ChatInputCommandResolvedOptionsData,
} from '../../index';

import { BaseManager } from '../base/BaseManager';

export class ChatInputCommandInteractionOptionManager extends BaseManager {
    public guild: Guild | null;
    public options: ChatInputCommandResolvedOptionsData;

    public constructor(
        client: Client,
        options: APIApplicationCommandInteractionDataOption[],
        resolved: APIChatInputApplicationCommandInteractionDataResolved,
        guild?: Guild
    ) {
        super(client);

        this.guild = guild ?? null;
        this.options = ChatInputCommandOptionsResolver(this.client, this.guild, options, resolved);
    }

    public pick(name: string) {
        return this.options.options.get(name);
    }

    public pickSubcommand(name: string) {
        return this.pick(name).value as string;
    }

    public pickSubcommandGroup(name: string) {
        return this.pick(name).options!;
    }

    public pickString(name: string) {
        return this.pick(name).value as string;
    }

    public pickInteger(name: string) {
        return this.pick(name).value as number;
    }

    public pickBoolean(name: string) {
        return this.pick(name).value as boolean;
    }

    public pickChannel(name: string) {
        return this.pick(name).resolved.channel!;
    }

    public pickMember(name: string) {
        return this.pick(name).resolved.member!;
    }

    public pickRole(name: string) {
        return this.pick(name).resolved.role!;
    }

    public pickMentionable(name: string) {
        const picked = this.pick(name).resolved;

        return picked.user ?? picked.member ?? picked.role ?? picked.channel;
    }

    public pickUser(name: string) {
        return this.pick(name).resolved.user!;
    }

    public pickNumber(name: string) {
        return this.pick(name).value as number;
    }

    public pickAttachment(name: string) {
        return this.pick(name).resolved.attachment!;
    }
}
