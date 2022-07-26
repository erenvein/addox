import { APIGroupDMChannel, Client, Snowflake, deleteProperty } from '../index';

import { BaseTextChannel } from './BaseTextChannel';

class GroupDMChannel extends BaseTextChannel {
    public applicationId!: string | null;
    public icon!: string | null;
    public ownerId!: Snowflake | null;

    public constructor(client: Client, data: APIGroupDMChannel) {
        //@ts-ignore
        super(client, data);

        this._patch(data);
    }

    //@ts-ignore
    public override _patch(data: APIGroupDMChannel) {
        super._patch(data);

        this.applicationId = data.application_id ?? null;
        this.icon = data.icon ?? null;
        this.ownerId = data.owner_id ?? null;

        return this;
    }
}

GroupDMChannel.prototype = deleteProperty<GroupDMChannel>(GroupDMChannel.prototype, 'url');

export { GroupDMChannel };
