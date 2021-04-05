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
export interface INmosSettings {
    enable: boolean;
    autodiscover: boolean;
    registrationUri: string;
}

export enum GenlockFamily {
    genlock25 = 'genlock25',
    genlock30M = 'genlock30M',
    genlock30 = 'genlock30',
}

export interface IGenlockSettings {
    family: GenlockFamily;
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

export interface IGenlockStatus {
    locked: boolean;
    family: GenlockFamily;
}


export const GenlockFamilies = Object.keys(GenlockFamily);