export interface INtpStatus {
    locked: boolean;
    serverAddress?: string;
}

export interface INtpSettings {
    // If true, use the server provided by DHCP or the default NTP server.
    // If false, use the one defined in the serverAddress property
    useSystem: boolean;

    // A list of space-separated addresses for NTP servers.
    serverAddress?: string;
}

export function isINtpSettings(data: unknown): data is INtpSettings {
    const d = (data as INtpSettings) ?? {};

    if (typeof d.useSystem === 'boolean') {
        return true;
    }

    return false;
}
