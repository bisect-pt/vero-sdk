import { IPAddress, MacAddress, Netmask, NetmaskString } from './network';

export enum SfpLabel {
    A = 'SFP A',
    B = 'SFP B',
}

export interface IManagementInterfaceSettings {}

export interface ISfpInterfaceStatus {
    address: IPAddress;
    device: string;
    dhcp_enabled: boolean;
    gateway: IPAddress;
    mac_address: MacAddress;
    netmask: Netmask;
}

export interface ISfpInterfaceSettings {
    label: SfpLabel;
    main: ISfpInterfaceStatus;
    ptp: ISfpInterfaceStatus;
}

export type SfpsSettings = ISfpInterfaceSettings[];

export interface ISfpTelemetry {
    link_active: boolean;
    link_speed: string; // '25G', etc.
    module_present: boolean;
    rx_packets: number;
    rx_packets_in_error: number;
    rx_rate: number; // bytes per second
    sfp_module_info: string;
    signal_present: boolean;
    transmit_error: boolean;
    tx_dropped_packets: number;
    tx_packets: number;
    tx_rate: number; // bytes per second
}

export type SfpsTelemetry = ISfpTelemetry[];

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
