export enum IGMPStates {
    off = 'off',
    v2 = 'v2',
    v3 = 'v3',
}
export interface IIGMPSettings {
    state: IGMPStates.off | IGMPStates.v2 | IGMPStates.v3;
}

export function isIIGMPSettings(data: unknown): data is IIGMPSettings {
    const d = (data as IIGMPSettings) ?? {};

    if (d.state === 'off' || d.state === 'v2' || d.state === 'v3') {
        return true;
    }

    return false;
}
