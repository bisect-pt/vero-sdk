import { IEndpoint, IDestinationEndpoint } from './network';
import { IGenlockStatus } from './genlock';
import { IPtpStatus } from './ptp';
import { INmosStatus } from './nmos';
import { SfpsSettings, SfpsTelemetry, IManagementInterfaceStatus } from './interfaces';

export enum GeneratorChannelId {
    channel1 = '1',
    channel2 = '2',
}

export type SenderGroupsIds = '1' | '2';

export enum SenderKind {
    video = 'video',
    audio = 'audio',
    anc = 'anc',
    alpha = 'alpha',
}

export type SenderKinds = SenderKind.video | SenderKind.audio | SenderKind.anc | SenderKind.alpha;

export interface ISenderMulticastAddress {
    group_id: SenderGroupsIds;
    kind: SenderKinds;
    primary: IEndpoint;
    secondary: IEndpoint;
}

export type ISenderMulticastAddresses = Array<ISenderMulticastAddress>;

export interface IAudioSettings {
    audioChannels: string; // TODO: constrain
    packetTime: string; // TODO: constrain
}

export interface IAlphaSettings {
    format: 'Y' | 'YUV';
}

export interface IVideoSettings {
    resolution: string;
    schedule: {
        kind: string;
        tr_offset_delay?: string;
        trs_delay?: string;
        distribution_mode?: string;
    };
    patternId: string;
}
export interface IAncSettings {
    //TODO
}

export type MediaSpecificSettings = IVideoSettings | IAudioSettings | IAncSettings | IAlphaSettings;

export interface ISenderNetwork {
    enabled: boolean;
    useDefaultAddress?: boolean;
    useRedundancy?: boolean;
    primary?: { destAddr: string; destPort: string };
    secondary?: { destAddr: string; destPort: string };
    rtp?: { tsDelta: string; payloadId: string; ssrc: string };
}

export interface ISender {
    isActive: boolean;
    network: ISenderNetwork;
    settings?: MediaSpecificSettings;
}

export interface IGeneratorProfile {
    id: string;
    meta: {
        description: string;
    };
    senders: {
        [SenderKind.video]?: Array<ISender>;
        [SenderKind.audio]?: Array<ISender>;
        [SenderKind.anc]?: Array<ISender>;
        [SenderKind.alpha]?: Array<ISender>;
    };
}

export enum StateMachine {
    Starting = 'Starting',
    Started = 'Started',
    Stopping = 'Stopping',
    Stopped = 'Stopped',
    Failed = 'Failed',
}

export interface IRtpSettings {
    payloadId: string;
    ssrc: string;
    tsDelta: string;
}

export interface IBaseSenderStatus {
    isActive: boolean;
    network: {
        enabled: boolean;
        primary: IDestinationEndpoint;
        secondary?: IDestinationEndpoint;
    };
}

export interface IAlphaSenderStatus extends IBaseSenderStatus {}

export interface IAncSenderStatus extends IBaseSenderStatus {}

export interface IAudioSenderStatus extends IBaseSenderStatus {}

export enum TimingKind {
    narrow = 'narrow',
    wide = 'wide',
    narrow90 = 'narrow90',
    narrow110 = 'narrow110',
    wide100 = 'wide100',
    wide110 = 'wide110',
    manual = 'manual',
}

export enum DistributionMode {
    gapped = 'gapped',
    linear = 'linear',
}

export interface IVideoScheduleStatus {
    distribution_mode: DistributionMode;
    kind: TimingKind;
    tr_offset_delay: string;
    trs_delay: string;
}

export interface IVideoSettingsStatus {
    schedule: IVideoScheduleStatus;
}

export interface IVideoSenderStatus extends IBaseSenderStatus {
    settings: IVideoSettingsStatus;
}

export interface IGeneratorStatus {
    alpha?: [IAlphaSenderStatus];
    anc?: [IAncSenderStatus];
    audio?: [IAudioSenderStatus];
    video?: [IVideoSenderStatus];
    generator_profile_id: string;
    group_id: SenderGroupsIds;
    id: string;
    profile: IGeneratorProfile;
    status: StateMachine;
}

export interface IErrorMessage {}
export interface IWarningMessage {}

export interface IGeneratorDaemonInfo {
    id: string;
    label: string;
}

export interface ILicenseInfo {
    features: [{ id: string; version: string }];
    license_format_version: string;
    license_kind: string;
    licensee_name: string;
    product_name: string;
    serial_number: string;
}

export interface INicInfo {
    firmware_version: string;
    fpga_version: string;
    model_name: string;
    serial_number: string;
    temperature: { current: number; error_threshold: number; fan_ok: boolean; maximum: number };
}

export interface IGeneratorStatusEntry {
    errors: IErrorMessage[];
    genlock: IGenlockStatus;
    info: IGeneratorDaemonInfo;
    generator: {
        errors: IErrorMessage[];
        genlock: IGenlockStatus;
        info: IGeneratorDaemonInfo;
        senders: IGeneratorStatus[];
        license: ILicenseInfo;
        nic: INicInfo;
        ptp: IPtpStatus;
        sfps: SfpsSettings;
        sfps_telemetry: SfpsTelemetry;
        warnings: IWarningMessage[];
        timestamp: number;
        nmos: INmosStatus;
    };
    license: ILicenseInfo;
    nic: INicInfo;
    ptp: IPtpStatus;
    sfps: SfpsSettings;
    sfps_telemetry: SfpsTelemetry;
    warnings: IWarningMessage[];
    timestamp: number;
    nmos: INmosStatus;
}

export type IFullGeneratorStatus = {
    '0': IGeneratorStatusEntry;
    managementInterface: IManagementInterfaceStatus;
};
