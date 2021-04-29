import { IDuration } from '@bisect/bisect-core-ts';
import { api as listApi } from '@bisect/ebu-list-sdk';

export interface ICaptureConfiguration {
    id: string;
    name: string; // The name of the resulting pcap file
    duration: number; // In seconds
    sfpAEnabled: boolean;
    sfpBEnabled: boolean;
}

export interface IListAnalysisSummary {
    problems: { errorCount: number; warningCount: number };
    streamCount: { anc: number; audio: number; unknown: number; video: number };
    pcapId: string;
}

export interface ICaptureJobResult {
    analysis: IListAnalysisSummary;
    fileSize: number; // pcap file size in bytes
    sfpAEnabled: boolean;
    sfpBEnabled: boolean;
}

export enum CaptureJobState {
    Waiting = 'waiting',
    Active = 'active',
    Completed = 'completed',
    Analyzing = 'analyzing',
    Analyzed = 'analyzed',
    Failed = 'failed',
}

export interface ICaptureJob {
    id: string;
    name: string;
    duration: IDuration;
    requestTime: string; // TODO Date
    completionTime?: string; // TODO Date
    state: CaptureJobState;
    result?: ICaptureJobResult;
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

export type EssenceKind = listApi.pcap.MediaType;

export interface IMonitoredData {
    kind: EssenceKind;
    format: string;
}

export interface IMonitoredCaptureInfo {
    external?: boolean; // If true, it is being received without a subscription, probably statically routed.
    monitor?: {
        primary?: IMonitoredData;
        secondary?: IMonitoredData;
    };
}

export type IMonitoredCaptureSource = ICaptureSource & IMonitoredCaptureInfo;

export interface ISubscribeMessage {
    sessionId: string;
    sources: ICaptureSource[];
}

export interface IUnsubscribeMessage {
    sessionId: string;
    sourceIds: string[];
}

export interface ISfpMonitorState {
    streams: listApi.pcap.IStreamInfo[];
}

export interface IMonitorState {
    A: ISfpMonitorState;
    B: ISfpMonitorState;
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
