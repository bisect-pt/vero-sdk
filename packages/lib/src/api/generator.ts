export enum GeneratorChannelId {
    channel1 = 1,
    channel2 = 2,
}


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
export interface ICaptureSettings {}
export interface IGeneratorStatus {}
export interface ICaptureJob {
    id: string;
}

export enum StateMachine {
    Starting = 'Starting',
    Started = 'Started',
    Stopping = 'Stopping',
    Stopped = 'Stopped',
    Failed = 'Failed',
}