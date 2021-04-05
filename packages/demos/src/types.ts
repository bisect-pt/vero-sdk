export interface IArgs {
    _: string[];
    baseUrl: string;
    username: string;
    password: string;
    pcapFile?: string;
}

export interface IProblem {
    stream_id: string | null; // If null, applies to the whole pcap, e.g. truncated
    value: {
        id: string; // Problem id
    };
}

