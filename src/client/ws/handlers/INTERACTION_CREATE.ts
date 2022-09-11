import {
    type GatewayInteractionCreateDispatch,
    type APIMessageComponentButtonInteraction,
    type APIMessageComponentSelectMenuInteraction,
    BaseWebSocketHandler,
    AutocompleteInteraction,
    ButtonInteraction,
    CommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    InteractionType,
    ComponentType,
} from '../../../index';

export default class InteractionCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayInteractionCreateDispatch) {
        const client = this.shard.manager.client;

        let interaction:
            | AutocompleteInteraction
            | ButtonInteraction
            | CommandInteraction
            | ModalSubmitInteraction
            | SelectMenuInteraction
            | null = null;

        switch (d.type) {
            case InteractionType.ApplicationCommand:
                interaction = new CommandInteraction(client, d);
                break;
            case InteractionType.ModalSubmit:
                interaction = new ModalSubmitInteraction(client, d);
                break;
            case InteractionType.MessageComponent:
                switch (d.data.component_type) {
                    case ComponentType.Button:
                        interaction = new ButtonInteraction(
                            client,
                            d as APIMessageComponentButtonInteraction
                        );
                        break;
                    case ComponentType.SelectMenu:
                        interaction = new SelectMenuInteraction(
                            client,
                            d as APIMessageComponentSelectMenuInteraction
                        );
                        break;
                }
        }

        if (interaction) {
            this.shard.manager.emit('interactionCreate', interaction);
        }
    }
}
