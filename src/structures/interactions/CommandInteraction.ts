import type { Client, APIApplicationCommandInteraction } from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class CommandInteraction extends BaseInteraction {
    public constructor(client: Client, data: APIApplicationCommandInteraction) {
        super(client, data);
    }
}
