import { get, makeAwaiter, post, deleteRequest, validateResponseCode, putStream } from './common';
import { logger } from './logger';

//////////////////////////////////////////////////////////////////////////////

export class Transport {
    public constructor(
        private readonly baseUrl: string,
        private readonly token: string,
        private readonly ws: SocketIOClient.Socket
    ) {
        this.ws.on('error', this.handleWsError);
        this.ws.on('connect_error', this.handleWsConnectError);
    }

    public close(): void {
        this.ws.off('error', this.handleWsError);
        this.ws.off('connect_error', this.handleWsConnectError);
        this.ws.close();
    }

    private handleWsError(error: any): void {
        logger.error(`WebSocket error: ${error}`);
    }

    private handleWsConnectError(error: any): void {
        logger.error(`WebSocket connection error: ${error}`);
    }

    public async get(endpoint: string): Promise<any> {
        const response = await get(`${this.baseUrl}/api`, this.token, endpoint);
        validateResponseCode(response);
        return response.content;
    }

    public async post(endpoint: string, data: any): Promise<any> {
        const response = await post(`${this.baseUrl}/api`, this.token, endpoint, data);
        validateResponseCode(response);
        return response.content;
    }

    public async delete(endpoint: string): Promise<any> {
        const response = await deleteRequest(`${this.baseUrl}/api`, this.token, endpoint);
        validateResponseCode(response);
        return response.content;
    }

    public async putFile(endpoint: string, path: string, tag: string): Promise<void> {
        return await putStream(`${this.baseUrl}/api`, this.token, endpoint, path, tag);
    }

    public async postRaw(endpoint: string, data: any): Promise<any> {
        return await post(this.baseUrl, this.token, endpoint, data);
    }

    // Returns a promise which resolves to:
    // - the event, if succeeded
    // - undefined, if timeout
    public makeAwaiter<TResponse>(
        eventName: string,
        condition: (data: any) => TResponse | false,
        timeoutMs: number
    ): Promise<TResponse | undefined> {
        return makeAwaiter(this.ws, eventName, condition, timeoutMs);
    }
}
