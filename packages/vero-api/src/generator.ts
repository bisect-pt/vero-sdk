import * as types from './network';

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
    primary: types.IEndpoint;
    secondary: types.IEndpoint;
}

export type ISenderMulticastAddresses = Array<ISenderMulticastAddress>;

export interface ISender {}

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

export interface ISenderStatus {
    generator_profile_id: string;
    status: StateMachine;
}

export interface IGeneratorStatusEntry {
    generator: {
        senders: ISenderStatus[];
    };
}

export type IGeneratorStatus = IGeneratorStatusEntry[];
