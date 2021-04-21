export type MulticastAddress = string;
export type PortString = string;

export interface IEndpoint {
    address: MulticastAddress;
    port: PortString;
}
