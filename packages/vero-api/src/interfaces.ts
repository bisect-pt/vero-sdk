import { IPAddress, MacAddress, Netmask, NetmaskString } from './network';

export enum SfpLabel {
    A = 'SFP A',
    B = 'SFP B',
}

interface ISfps {
    address: IPAddress;
    device?: string;
    dhcp_enabled: boolean;
    gateway: IPAddress;
    mac_address: MacAddress;
    netmask: Netmask;
}

export interface ISfpInterfaceSettings {
    main: ISfps;
    ptp: ISfps;
    label: string;
}

export interface IManagementInterfaceSettings {}

export interface SfpStatus {
    label: SfpLabel;
    main: ISfps;
    ptp: ISfps;
}

export type SfpsStatus = SfpStatus[];

export interface SfpTelemetry {
    link_active: boolean;
    link_speed: string;
    module_present: boolean;
    rx_packets: number;
    rx_packets_in_error: number;
    rx_rate: number;
    sfp_module_info: string;
    signal_present: boolean;
    transmit_error: boolean;
    tx_dropped_packets: number;
    tx_packets: number;
    tx_rate: number;
}

export type SfpsTelemetry = SfpTelemetry[];

export interface IAddressInfo {
    ipAddr: IPAddress;
    ipNetmask: NetmaskString;
    fullAddr: string;
}

export interface IManagementInterfaceStatus {
    name: string;
    macAddr: MacAddress;
    dynamic: Partial<IAddressInfo>;
    static: Partial<IAddressInfo>;
    gateway?: IPAddress;
}
