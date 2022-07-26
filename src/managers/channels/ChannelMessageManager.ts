import type { Message, Snowflake } from '../../index';
import { CachedManager } from './../CachedManager';

export class ChannelMessageManager extends CachedManager<Snowflake, Message> {}