import {
    APIApplicationCommandInteractionDataOption,
    APIChatInputApplicationCommandInteractionDataResolved,
    Collection,
    Attachment,
    InteractionDataResolvedChannel,
    GuildMember,
    Role,
    User,
    Snowflake,
    Client,
    Guild,
    ApplicationCommandOptionType,
    ChatInputCommandResolvedOptionsData,
    ChatInputCommandResolvedOptionData,
} from '../../index';

export function ChatInputCommandOptionsResolver(
    client: Client,
    guild: Guild | null,
    options: APIApplicationCommandInteractionDataOption[],
    resolved: APIChatInputApplicationCommandInteractionDataResolved
): ChatInputCommandResolvedOptionsData {
    let res: ChatInputCommandResolvedOptionsData = {
        resolved: {
            attachments: new Collection(),
            channels: new Collection(),
            members: new Collection(),
            roles: new Collection(),
            users: new Collection(),
        },
        options: new Collection(),
    };

    if (resolved.attachments) {
        for (const attachment of Object.entries(resolved.attachments)) {
            res.resolved.attachments.set(attachment[0], new Attachment(attachment[1]));
        }
    }

    if (resolved.channels) {
        for (const channel of Object.entries(resolved.channels)) {
            res.resolved.channels.set(
                channel[0],
                new InteractionDataResolvedChannel(client, channel[1])
            );
        }
    }

    if (resolved.members) {
        for (const member of Object.entries(resolved.members)) {
            res.resolved.members.set(
                member[0],
                new GuildMember(client, guild, {
                    ...member[1],
                    user: resolved.users[member[0]],
                    deaf: false,
                    mute: false,
                })
            );
        }
    }

    if (resolved.roles) {
        for (const role of Object.entries(resolved.roles)) {
            res.resolved.roles.set(
                role[0],
                guild
                    ? guild.caches.roles.cache._add(role[0], new Role(client, guild, role[1]))
                    : new Role(client, guild, role[1])
            );
        }
    }

    if (resolved.users) {
        for (const user of Object.entries(resolved.users)) {
            res.resolved.users.set(
                user[0],
                client.caches.users.cache._add(user[0], new User(client, user[1]))
            );
        }
    }

    for (const option of options) {
        res.options.set(option.name, ChatInputCommandOptionResolver(option, res.resolved));
    }

    return res;
}

export function ChatInputCommandOptionResolver(
    option: APIApplicationCommandInteractionDataOption,
    resolved: ChatInputCommandResolvedOptionsData['resolved']
) {
    let res: ChatInputCommandResolvedOptionData = {
        name: option.name,
        type: ApplicationCommandOptionType[
            option.type
        ] as keyof typeof ApplicationCommandOptionType,
        value: undefined,
        options: undefined,
        focusted: undefined,
        resolved: {},
    };

    if ('value' in option) {
        res.value = option.value;
    }

    if ('options' in option) {
        res.options = option.options.map((opt) => ChatInputCommandOptionResolver(opt, resolved));
    }

    if ('focused' in option) {
        res.focusted = option.focused;
    }

    const attachment = resolved.attachments.get(res.value as Snowflake);
    const channel = resolved.channels.get(res.value as Snowflake);
    const member = resolved.members.get(res.value as Snowflake);
    const role = resolved.roles.get(res.value as Snowflake);
    const user = resolved.users.get(res.value as Snowflake);

    if (attachment) {
        res.resolved.attachment = attachment;
    }

    if (channel) {
        res.resolved.channel = channel;
    }

    if (member) {
        res.resolved.member = member;
    }

    if (role) {
        res.resolved.role = role;
    }

    if (user) {
        res.resolved.user = user;
    }

    return res;
}
