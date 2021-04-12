export interface IResponse {
    result: number;
    desc: string;
    content: any;
}

export function resolveResponse(response: IResponse): any | Error {
    if (response.result === 0) {
        return response.content;
    }
    throw new Error(`API response error ${response.desc}`);
}
