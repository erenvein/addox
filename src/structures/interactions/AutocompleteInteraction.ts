import {
    Client,
    APIApplicationCommandAutocompleteInteraction,
    ChatInputCommandInteractionOptionManager,
    APIApplicationCommandOptionChoice,
    InteractionResponseType,
} from '../../index';

import { BaseInteraction } from '../base/BaseInteraction';

export class AutocompleteInteraction extends BaseInteraction {
    public options!: ChatInputCommandInteractionOptionManager;

    public constructor(client: Client, data: APIApplicationCommandAutocompleteInteraction) {
        super(client, data);

        this._patch(data);
    }

    public override _patch(data: APIApplicationCommandAutocompleteInteraction) {
        super._patch(data);

        this.options = new ChatInputCommandInteractionOptionManager(
            this.client,
            data.data.options ?? [],
            data.data.resolved ?? {},
            this.guild
        );

        return this;
    }

    public async result(choices: APIApplicationCommandOptionChoice[]) {
        return await this.client.rest.post<void>(
            `/interactions/${this.id}/${this.token}/callback`,
            {
                body: {
                    type: InteractionResponseType.ApplicationCommandAutocompleteResult,
                    choices,
                },
            }
        );
    }
}
