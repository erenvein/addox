import {
    type Client,
    type RESTAPIPartialCurrentUserGuild,
    PermissionFlagsBitField,
    type APIGuild,
} from '../../index';

import { BaseGuild } from '../channels/BaseGuild';

export class OAuth2Guild extends BaseGuild {
    public owner!: boolean;
    public permissions!: PermissionFlagsBitField;

    public constructor(client: Client, data: RESTAPIPartialCurrentUserGuild) {
        super(client, data as APIGuild);

        this.permissions = new PermissionFlagsBitField(+data.permissions);
        this.owner = data.owner;
    }
}
