export const DiscordGatewayURL = 'wss://gateway.discord.gg';
export const DiscordGatewayVersion = '10';
export const DiscordAPIURL = 'https://discord.com/api';
export const DiscordAPIVersion = '10';

export enum Colors {
    Default = 0x000000,
    White = 0xffffff,
    Aqua = 0x1abc9c,
    Green = 0x2ecc71,
    Blue = 0x3498db,
    Yellow = 0xfee75c,
    Purple = 0x9b59b6,
    LuminousVividPink = 0xe91e63,
    Fuchsia = 0xeb459e,
    Gold = 0xf1c40f,
    Orange = 0xe67e22,
    Red = 0xe74c3c,
    Grey = 0x95a5a6,
    Navy = 0x34495e,
    DarkAqua = 0x11806a,
    DarkGreen = 0x1f8b4c,
    DarkBlue = 0x206694,
    DarkPurple = 0x71368a,
    DarkVividPink = 0xad1457,
    DarkGold = 0xc27c0e,
    DarkOrange = 0xa84300,
    DarkRed = 0x992d22,
    DarkGrey = 0x979c9f,
    DarkerGrey = 0x2c2f33,
    DarkNavy = 0x2c3e50,
    LightAqua = 0x00b8d4,
    LightGreen = 0x2f6e4f,
    LightBlue = 0x00abd4,
    LightPurple = 0x72418f,
    LightVividPink = 0xf984ef,
    LightGold = 0xffcb00,
    LightOrange = 0xf09819,
    LightRed = 0xe55b3c,
    LightGrey = 0xbcc0c0,
    LightNavy = 0x3a5fcd,
    Random = Math.floor(Math.random() * (0xffffff + 1)),
}

export const ReconnectableWebSocketCloseCodes = new Set([
    4000, 4001, 4002, 4003, 4005, 4007, 4008, 4009,
]);

export enum AutoModerationRuleEventTypes {
    MessageSend = 1,
}

export enum AutoModerationRuleTriggerTypes {
    Keyword = 1,
    Spam = 3,
    KeywordPreset = 4,
    MentionSpam = 5,
}

export enum AutoModerationRuleKeywordPresetTypes {
    Profanity = 1,
    SexualContent = 2,
    Slurs = 3,
}

export enum AutoModerationRuleActionTypes {
    BlockMessage = 1,
    SendAlertMessage = 2,
    Timeout = 3,
}

export enum ThreadType {
    Public = 11,
    Private = 12,
    News = 10,
}

export enum GuildIntegrationType {
    Twitch = 1,
    YouTube = 2,
    Discord = 3,
}

export enum ForumChannelDefaultShortOrderTypes {
    LatestActivity = 0,
    CreationDate = 1,
}

export const SlashCommandPattern = /<\/(\w+):(\d{17,19})>/;
