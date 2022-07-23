import {
    type Client,
    Role,
    type Snowflake,
    type Guild,
    type CollectionLike,
    type APIRole,
    type FetchOptions,
    type RoleData,
    type Collection,
    RoleDataResolver,
} from '../../';

import { CachedManager } from '../CachedManager';

export class GuildRoleManager extends CachedManager<Snowflake, Role> {
    public guild: Guild;
    public constructor(client: Client, guild: Guild) {
        super(client);

        this.guild = guild;
    }

    public async fetch(
        id?: Snowflake | null,
        { force }: FetchOptions = { force: false }
    ): Promise<CollectionLike<Snowflake, Role>> {
        if (id) {
            const _role = this.cache.get(id)!;

            if (!force && _role) {
                return _role;
            }

            const roles = (await this.fetch(null, { force })) as Collection<Snowflake, Role>;

            const role = roles.get(id)!;

            return this.cache._add(role.id, role);
        } else {
            const roles = await this.client.rest.get<APIRole[]>(`/guilds/${this.guild.id}/roles`);

            for (const role of roles) {
                this.cache.set(role.id, new Role(this.client, this.guild, role));
            }

            return this.cache;
        }
    }

    public async create(data: RoleData, reason?: string) {
        const role = await this.client.rest.post<APIRole>(`/guilds/${this.guild.id}/roles`, {
            body: RoleDataResolver(data),
            reason: reason,
        });

        return this.cache._add(role.id, new Role(this.client, this.guild, role));
    }

    public async delete(id: Snowflake, reason?: string) {
        await this.client.rest.delete(`/guilds/${this.guild.id}/roles/${id}`, { reason: reason });
        this.cache.delete(id);
    }

    public async edit(id: Snowflake, data: RoleData, reason?: string) {
        const role = await this.client.rest.patch<APIRole>(`/guilds/${this.guild.id}/roles/${id}`, {
            body: RoleDataResolver(data),
            reason: reason,
        });

        let _role = this.cache.get(id)!;

        if (_role) {
            _role = _role._patch(role);
        }

        return this.cache._add(role.id, _role ?? new Role(this.client, this.guild, role));
    }

    public async setPosition(id: Snowflake, position: number, reason?: string) {
        const role = await this.client.rest.patch<APIRole>(`/guilds/${this.guild.id}/roles`, {
            body: { id, position, reason: reason },
        });

        let _role = this.cache.get(id);

        if (_role) {
            _role = _role._patch(role);
        }

        return this.cache._add(role.id, _role ?? new Role(this.client, this.guild, role));
    }
}
