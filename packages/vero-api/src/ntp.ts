export interface INtpStatus {
    locked: boolean;
    serverAddress?: string;
}

export interface INtpSettings {
    useSystem: boolean;
    serverAddresses?: string[];
}
