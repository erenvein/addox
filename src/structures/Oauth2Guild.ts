import {
    type Client,
    type RESTAPIPartialCurrentUserGuild,
    PermissionFlagsBitField,
    type APIGuild,
} from '../';

import { BaseGuild } from './BaseGuild';

export class Oauth2Guild extends BaseGuild {
    public owner!: boolean;
    public permissions!: PermissionFlagsBitField;

    public constructor(client: Client, data: RESTAPIPartialCurrentUserGuild) {
        super(client, data as APIGuild);

        this.permissions = new PermissionFlagsBitField(+data.permissions);
        this.owner = data.owner;
    }
}