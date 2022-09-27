import type { GuildMember, Client, CreateMessageData } from '../../index';

import { BaseManager } from '../base/BaseManager';

export class GuildMemberDMManager extends BaseManager {
    public member: GuildMember;

    public constructor(client: Client, member: GuildMember) {
        super(client);
    }

    public async fetch() {
        return await this.client.caches.users.fetchDM(this.member.id);
    }

    public async create() {
        return await this.client.caches.users.createDM(this.member.id);
    }

    public async delete() {
        return await this.client.caches.users.deleteDM(this.member.id);
    }

    public async send(data: CreateMessageData) {
        return await (await this.create()).send(data);
    }

    public async lastMessage() {
        return (await this.create()).lastMessage;
    }
}
