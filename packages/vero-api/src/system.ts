export interface IVersion {
    major: number;
    minor: number;
    patch: number;
    hash: string;
}

export interface IStorageStats {
    systemPartition: { used: Number; free: Number };
    dataPartition: { used: Number; free: Number };
}
