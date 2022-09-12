import {
    type GatewayInteractionCreateDispatch,
    type APIMessageComponentButtonInteraction,
    type APIMessageComponentSelectMenuInteraction,
    type APIChatInputApplicationCommandInteraction,
    type APIUserApplicationCommandInteraction,
    type APIMessageApplicationCommandInteraction,
    type AnyInteraction,
    BaseWebSocketHandler,
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    UserCommandInteraction,
    MessageCommandInteraction,
    ModalSubmitInteraction,
    SelectMenuInteraction,
    InteractionType,
    ComponentType,
    ApplicationCommandType,
} from '../../../index';

export default class InteractionCreateHandler extends BaseWebSocketHandler {
    public constructor() {
        super();
    }

    public override handle({ d }: GatewayInteractionCreateDispatch) {
        const client = this.shard.manager.client;

        let interaction: AnyInteraction | null = null;

        switch (d.type) {
            case InteractionType.ApplicationCommand:
                switch (d.data.type) {
                    case ApplicationCommandType.ChatInput:
                        interaction = new ChatInputCommandInteraction(
                            client,
                            d as APIChatInputApplicationCommandInteraction
                        );
                        break;
                    case ApplicationCommandType.User:
                        interaction = new UserCommandInteraction(
                            client,
                            d as APIUserApplicationCommandInteraction
                        );
                        break;
                    case ApplicationCommandType.Message:
                        interaction = new MessageCommandInteraction(
                            client,
                            d as APIMessageApplicationCommandInteraction
                        );
                        break;
                }
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
                break;
            case InteractionType.ModalSubmit:
                interaction = new ModalSubmitInteraction(client, d);
                break;
        }

        if (interaction) {
            this.shard.manager.emit('interactionCreate', interaction);
        }
    }
}
