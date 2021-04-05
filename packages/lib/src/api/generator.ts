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

export enum SocketEvent {
    /*
    Collection update
    Payload= {
        collection : string - one of the identifiers in collections below
        added : undefined | [an array of added objects]
        deletedIDs : undefined | [an array of IDs of deleted objects]
        updated : undefined | [an array of updated objects]
    }
    */
    collectionUpdate = 'COLLECTION_UPDATE',
    notify = 'NOTIFY',
    systemStatus = 'SYSTEM_STATUS',
    interruptSystem = 'INTERRUPT_SYSTEM',
    systemUpdate = 'SYSTEM_UPDATE',
    downloadManagerUpdate = 'DOWNLOAD_MANAGER_UPDATE',
    generatorStatus = 'GENERATOR_STATUS',
    capturestatus = 'CAPTURE_STATUS',
    captureJobStatus = 'CAPTUREJOB_STATUS',
}

export enum Collections {
    captureJobs = 'captureJobs',
    captureSources = 'captureSources',
    senderProfiles = 'senderProfiles',
}

export enum CaptureJobStates {
    Waiting = 'waiting',
    Active = 'active',
    Completed = 'completed',
    Analyzing = 'analyzing',
    Analyzed = 'analyzed',
    Failed = 'failed',
}

export enum StateMachine {
    Starting = 'Starting',
    Started = 'Started',
    Stopping = 'Stopping',
    Stopped = 'Stopped',
    Failed = 'Failed',
}