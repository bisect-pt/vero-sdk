interface ISfps {
    address: string;
    device?: string;
    dhcp_enabled: boolean;
    gateway: string;
    mac_address: string;
    netmask: number;
}

export interface ISfpInterfaceSettings {
    main: ISfps;
    ptp: ISfps;
    label: string;
}
export interface IManagementInterfaceSettings {}
