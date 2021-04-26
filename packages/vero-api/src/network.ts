export type Netmask = number;
export type NetmaskString = string;
export type MacAddress = string;
export type IPAddress = string;
export type MulticastAddress = string;
export type PortString = string;

export interface IEndpoint {
    address: MulticastAddress;
    port: PortString;
}

export interface IDestinationEndpoint {
    destAddr: MulticastAddress;
    destPort: PortString;
}
