import type { APIThreadMetadata, Client } from '../../index';

import { BaseStructure } from '../base/BaseStructure';

export class ThreadMetadata extends BaseStructure {
    public archiveTimestamp!: number;
    public archived!: boolean;
    public autoArchiveDuration!: number;
    public createTimestamp!: number | null;
    public invitable!: boolean;
    public locked!: boolean;

    public constructor(client: Client, data: APIThreadMetadata) {
        super(client);

        this._patch(data);
    }

    public override _patch(data: APIThreadMetadata) {
        super._patch(data);

        this.archiveTimestamp = new Date(data.archive_timestamp).getTime();
        this.archived = data.archived ?? false;
        this.autoArchiveDuration = data.auto_archive_duration;
        this.createTimestamp = data.create_timestamp
            ? new Date(data.create_timestamp).getTime()
            : null;
        this.invitable = data.invitable ?? true;
        this.locked = data.locked ?? false;

        return this;
    }

    public get archiveAt() {
        return new Date(this.archiveTimestamp);
    }

    public get createdAt() {
        return new Date(this.createTimestamp!);
    }
}
