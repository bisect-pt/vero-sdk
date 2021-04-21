export enum GenlockFamily {
    genlock25 = 'genlock25',
    genlock30M = 'genlock30M',
    genlock30 = 'genlock30',
}

export const GenlockFamilies = Object.keys(GenlockFamily);

export interface IGenlockSettings {
    family: GenlockFamily;
}

export interface IGenlockStatus {
    locked: boolean;
    family: GenlockFamily;
}
