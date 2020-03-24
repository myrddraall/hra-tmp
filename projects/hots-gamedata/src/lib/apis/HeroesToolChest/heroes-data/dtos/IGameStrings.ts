export interface IGameStringsFile {
    meta: { version: string, locale: string };
    gamestrings: IGameStrings
}

export interface IGameStrings {
    abiltalent: IAbiltalentStrings;
    announcer: IAnnouncerStrings;
    award: IAwardStrings;
    banner: IBannerStrings;
    emoticon: IEmoticonStrings;
    emoticonpack: IEmoticonPackStrings;
    heroskin: IHeroSkinStrings;
    mount: IMountStrings;
    portrait: IPortraitStrings;
    spray: ISprayStrings;
    unit: IUnitStrings;
    voiceline: IVoicelineStrings;
}

export interface IAbiltalentStrings {
    cooldown: IGameStringKeyValue;
    energy: IGameStringKeyValue;
    full: IGameStringKeyValue;
    life: IGameStringKeyValue;
    name: IGameStringKeyValue;
    short: IGameStringKeyValue;
}

export interface IAnnouncerStrings {
    name: IGameStringKeyValue;
}

export interface IAwardStrings {
    name: IGameStringKeyValue;
    description: IGameStringKeyValue
}

export interface IBannerStrings {
    name: IGameStringKeyValue;
    description: IGameStringKeyValue;
    shortname: IGameStringKeyValue
}

export interface IEmoticonStrings {
    name: IGameStringKeyValue;
    description: IGameStringKeyValue;
    alias: IGameStringKeyValue;
    searchtext: IGameStringKeyValue
}

export interface IEmoticonPackStrings {
    name: IGameStringKeyValue;
    description: IGameStringKeyValue;
}

export interface IHeroSkinStrings {
    info: IGameStringKeyValue;
    name: IGameStringKeyValue;
    searchtext: IGameStringKeyValue;
    sortname: IGameStringKeyValue;
}

export interface IMountStrings {
    info: IGameStringKeyValue;
    name: IGameStringKeyValue;
    searchtext: IGameStringKeyValue;
    sortname: IGameStringKeyValue;
}

export interface IPortraitStrings {
    name: IGameStringKeyValue;
}

export interface ISprayStrings {
    name: IGameStringKeyValue;
    searchtext: IGameStringKeyValue;
    sortname: IGameStringKeyValue;
}

export interface IUnitStrings {
    damagetype: IGameStringKeyValue;
    description: IGameStringKeyValue;
    difficulty: IGameStringKeyValue;
    energytype: IGameStringKeyValue;
    expandedrole: IGameStringKeyValue;
    lifetype: IGameStringKeyValue;
    name: IGameStringKeyValue;
    role: IGameStringKeyValue;
    searchtext: IGameStringKeyValue;
    shieldtype: IGameStringKeyValue;
    title: IGameStringKeyValue;
    type: IGameStringKeyValue;
}

export interface IVoicelineStrings {
    name: IGameStringKeyValue;
}

export interface IGameStringKeyValue {
    [key: string]: string;
}