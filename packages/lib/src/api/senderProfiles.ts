
export enum SenderKind {
    video = 'video',
    audio = 'video',
    anc = 'video',
    alpha = 'video',
}

export interface ISender {}

export interface IGeneratorProfile {
    id: string;
    meta: {
        description: string;
    };
    senders: {
        [SenderKind.video]: Array<ISender>;
        [SenderKind.audio]: Array<ISender>;
        [SenderKind.anc]: Array<ISender>;
        [SenderKind.alpha]: Array<ISender>;
    };
}