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

export enum CaptureJobStates {
    Waiting = 'waiting',
    Active = 'active',
    Completed = 'completed',
    Analyzing = 'analyzing',
    Analyzed = 'analyzed',
    Failed = 'failed',
}

export enum GeneratorChannelId {
    channel1 = 1,
    channel2 = 2,
}

export enum Collections {
    captureJobs = 'captureJobs',
    captureSources = 'captureSources',
    senderProfiles = 'senderProfiles',
}

export enum StateMachine {
    Starting = 'Starting',
    Started = 'Started',
    Stopping = 'Stopping',
    Stopped = 'Stopped',
    Failed = 'Failed',
}

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

export enum SenderKind {
    video = 'video',
    audio = 'video',
    anc = 'video',
    alpha = 'video',
}

export type SenderKinds = SenderKind.video | SenderKind.audio | SenderKind.anc | SenderKind.alpha;

export type SenderGroupsIds = '1' | '2';

export type MulticastAddress = string;
export type PortString = string;

export interface IEndpoint {
    address: MulticastAddress;
    port: PortString;
}

export interface ISenderMulticastAddress {
    // '1' or '2'
    group_id: SenderGroupsIds;
    kind: SenderKinds;
    primary: IEndpoint;
    secondary: IEndpoint;
}

export type ISenderMulticastAddresses = Array<ISenderMulticastAddress>;

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

export interface INmosSettings {
    enable: boolean;
    autodiscover: boolean;
    registrationUri: string;
}

export enum PtpSfpSelection {
    auto = 'auto',
    sfp_a = 'sfp_a',
    sfp_b = 'sfp_b',
}

export enum PtpDelayMechanism {
    end_to_end = 'end_to_end',
    peer_to_peer = 'peer_to_peer',
}

export enum PtpMode {
    hybrid = 'hybrid',
    unicast = 'unicast',
    multicast = 'multicast',
}

export enum PtpMembershipType {
    none = 'none',
    igmp_v2 = '',
    igmp_v3 = 'igmp_v3',
}

export interface IPtpSettings {
    domain: string;
    autodiscover: boolean;
    sfp_selection: PtpSfpSelection;
    delay_mechanism: PtpDelayMechanism;
    mode: PtpMode;
    membership_type: PtpMembershipType;
    tos_dscp: string;
    announce_receipt_timeout: string;
}

export interface ISfpInterfaceSettings {}

export interface IManagementInterfaceSettings {}

export interface ISettings {
    sendernetwork: ISenderMulticastAddresses;
    genlock: IGenlockSettings;
    nmos: INmosSettings;
    ptp: IPtpSettings;
    sfps: Array<ISfpInterfaceSettings>;
    mgmt: Array<IManagementInterfaceSettings>;
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
