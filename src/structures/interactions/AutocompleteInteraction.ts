import type { Client, APIApplicationCommandAutocompleteInteraction } from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class AutocompleteInteraction extends BaseInteraction {
    public constructor(client: Client, data: APIApplicationCommandAutocompleteInteraction) {
        super(client, data);
    }
}
