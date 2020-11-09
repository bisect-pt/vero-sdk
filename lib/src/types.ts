export interface IVersion {
    major: number;
    minor: number;
    patch: number;
    hash: string;
}

export type LanguageCode = 'en-US';

export interface IGUIPreferences {
    language: LanguageCode;
}

export interface IPreferences {
    gui: IGUIPreferences;
}

export interface IUserInfo {
    username: string;
    preferences: IPreferences;
}
