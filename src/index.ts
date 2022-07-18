// CLIENT
export { BaseClient } from './client/BaseClient';
export { Client } from './client/Client';

// WS
export { WebSocketManager } from './client/ws/WebSocketManager';
export { BaseWebSocketEvent } from './client/ws/events/BaseWebSocketEvent';
export { BaseWebSocketHandler } from './client/ws/handlers/BaseWebSocketHandler';
export { DiscordSocketError } from './client/ws/DiscordSocketError';

// REST
export { RequestManager } from './client/rest/RequestManager';
export { HTTPError } from './client/rest/errors/HTTPError';
export { DiscordAPIError } from './client/rest/errors/DiscordAPIError';
export { RateLimitError } from './client/rest/errors/RateLimitError';

// STRUCTURES
export { BitField } from './structures/BitField';
export { Collection } from './structures/Collection';

// TYPES
export * from './Constants';
export * from './Interfaces';

// API TYPES
export * from 'discord-api-types/v10';
