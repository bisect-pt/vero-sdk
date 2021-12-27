import { IDuration } from '@bisect/bisect-core-ts';
import { api as listApi } from '@bisect/ebu-list-sdk';

export interface ICaptureConfiguration {
    id: string;
    name: string; // The name of the resulting pcap file
    duration: number; // In seconds
    sfpAEnabled: boolean;
    sfpBEnabled: boolean;
    enableListAnalysis: boolean; // Perform the analysis automatically using EBU LIST
    truncate: boolean; // Perform the analysis automatically using EBU LIST
}

export interface IListAnalysisSummary {
    problems: { errorCount: number; warningCount: number };
    streamCount: { anc: number; audio: number; unknown: number; video: number };
    pcapId: string;
}

export interface ICaptureJobResult {
    analysis?: IListAnalysisSummary;
    fileSize: number; // pcap file size in bytes
    sfpAEnabled: boolean;
    sfpBEnabled: boolean;
    truncate: boolean;
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
    primary?: ITransport;
    useRedundancy?: boolean;
    secondary?: ITransport;
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

export interface IConnectorPatchRequest {
    enabled: boolean;
    source?: ICaptureSource;
}

export type ConnectorKind = 'video' | 'audio' | 'anc';

export interface ISfpMonitorState {
    streams: listApi.pcap.IStreamInfo[];
}

export interface IMonitorState {
    A: ISfpMonitorState;
    B: ISfpMonitorState;
}

export interface ICaptureSource {
    id: string;
    meta: { name: string };
    network: ISourceNetInfo;
}

export interface ITransport {
    multicastAddress: string;
    destinationPort: string;
    sourceAddress?: string;
}

export interface INmosConnectorInfo {
    senderId?: string;
}

export interface ILocalSourceConnectorInfo {
    id?: string;
    description: string;
}

export interface IConnectorStatus {
    enabled: boolean;
    description: string;
    kind: ConnectorKind;
    index: number; // 0-based index of that kind
    primary: ITransport;
    secondary?: ITransport;
    monitor?: {
        primary?: IMonitoredData;
        secondary?: IMonitoredData;
    };
    nmos?: INmosConnectorInfo;
    localSource?: ILocalSourceConnectorInfo;
}

export type ConnectorsStatus = IConnectorStatus[];

export interface IConnectorsGroupsStatus {
    video: ConnectorsStatus;
    audio: ConnectorsStatus;
    anc: ConnectorsStatus;
}
