export enum CaptureJobStates {
    Waiting = 'waiting',
    Active = 'active',
    Completed = 'completed',
    Analyzing = 'analyzing',
    Analyzed = 'analyzed',
    Failed = 'failed',
}

export interface ICaptureSettings {
    name: string;
    duration: number; // milliseconds. TODO: change to IDuration
    enableSfpA: boolean;
    enableSfpB: boolean;
    id: string;
}

export interface IListAnalysisSummary {
    problems: { errorCount: number; warningCount: number };
    streamCount: { anc: number; audio: number; unknown: number; video: number };
    pcapId: string;
}

export interface ISuccessfulCaptureResult {
    analysis: IListAnalysisSummary;
    fileSize: number;
    sfpAEnabled: boolean;
    sfpBEnabled: boolean;
}

export interface ICaptureJob {
    id: string;
    name: string;
    duration: number; // milliseconds. TODO: change to IDuration
    requestTime: string; // TODO Date
    completionTime?: string; // TODO Date
    state: CaptureJobStates;
    result?: ISuccessfulCaptureResult;
}

export interface ISourceNetInfo {
    primary?: {
        address: string;
        sourceAddress?: string;
    };
    useRedundancy?: boolean;
    secondary?: {
        address: string;
        sourceAddress?: string;
    };
}

export interface ICaptureSource {
    id: string;
    meta: { name: string };
    network: ISourceNetInfo;
}
