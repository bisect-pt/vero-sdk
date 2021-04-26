import { SfpLabel } from './interfaces';

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

export interface IPtpStatus {
    domain: number;
    grand_master_id: string;
    master_id: string;
    locked: boolean;
    mean_path_delay: number;
    offset_from_master: number;
    sfp_label: SfpLabel;
}
