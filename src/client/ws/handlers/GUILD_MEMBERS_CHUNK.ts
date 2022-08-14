import {
    type GatewayGuildMembersChunkDispatch,
    GuildMember,
    BaseWebSocketHandler,
    Collection,
    Snowflake,
    Presence,
} from '../../../index';

export default class GuildMembersChunkHandler extends BaseWebSocketHandler {
    public constructor() {
        super('GuildMembersChunk');
    }

    public override handle({ d }: GatewayGuildMembersChunkDispatch) {
        const guild = this.shard.guilds.get(d.guild_id);

        if (guild) {
            const members = new Collection<Snowflake, GuildMember>();

            for (const member of d.members) {
                members.set(
                    member.user?.id!,
                    new GuildMember(this.shard.manager.client, guild, member)
                );
            }

            if (d.presences) {
                for (const presence of d.presences) {
                    this.shard.manager.client.caches.presences.set(
                        presence.user.id,
                        new Presence(this.shard.manager.client, presence)
                    );
                }
            }

            this.shard.manager.emit('guildMembersChunk', guild, members, {
                chunkIndex: d.chunk_index ?? null,
                chunkCount: d.chunk_count ?? null,
                notFound: d.not_found ?? [],
                nonce: d.nonce ?? null,
            });
        }
    }
}
