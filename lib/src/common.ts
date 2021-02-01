import http from 'http';
import https from 'https';
import io from 'socket.io-client';
import { StringDecoder } from 'string_decoder';
import fs from 'fs';
import formData from 'form-data';

//////////////////////////////////////////////////////////////////////////////

declare type resolver = (value?: any | PromiseLike<any>) => void;
declare type rejector = (reason?: any) => void;
declare type promiseExecutor = (
    resolve: (value?: object | PromiseLike<object>) => void,
    reject: (reason?: any) => void
) => void;

interface IRequestOptionsExt extends http.RequestOptions {
    rejectUnauthorized?: boolean;
}

const makeRequest = (
    u: string,
    options: http.RequestOptions,
    callback: (res: http.IncomingMessage) => void
): http.ClientRequest => {
    if (u.startsWith('https')) {
        return https.request(u, options, callback);
    }

    return http.request(u, options, callback);
};

const handleHttpResponse = (res: http.IncomingMessage, resolve: resolver, reject: rejector): void => {
    let body = '';
    const decoder: StringDecoder = new StringDecoder('utf8');
    res.on('data', (data: Buffer) => (body += decoder.write(data)));
    res.on('end', () => {
        try {
            const contentType = res.headers['content-type'];
            if (!contentType || !contentType?.startsWith('application/json')) {
                reject(new Error(`Expected a JSON response but got '${contentType}'`));
                return;
            }

            if (body.length === 0) {
                resolve(undefined);
            } else {
                resolve(JSON.parse(body));
            }
        } catch (err) {
            reject(err);
        }
    });
    res.on('error', reject);
};

export async function post(baseUrl: string, authToken: string | null, endpoint: string, data: object): Promise<any> {
    const payload: string = JSON.stringify(data);

    const headers: http.OutgoingHttpHeaders = {
        'Content-Length': Buffer.byteLength(payload),
        'Content-Type': 'application/json;charset=UTF-8',
    };

    if (authToken !== null) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const options: IRequestOptionsExt = {
        headers,
        method: 'POST',
        rejectUnauthorized: false,
    };

    return new Promise((resolve, reject): void => {
        const callback = (res: http.IncomingMessage): void => handleHttpResponse(res, resolve, reject);
        const req: http.ClientRequest = makeRequest(`${baseUrl}${endpoint}`, options, callback);
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

export async function putStream(
    baseUrl: string,
    authToken: string | null,
    endpoint: string,
    path: string,
    tag: string
): Promise<void> {
    const form = new formData();
    form.append(tag, fs.createReadStream(path));

    const headers: http.OutgoingHttpHeaders = {
        ...form.getHeaders()
    };

    if (authToken !== null) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    const options: IRequestOptionsExt = {
        headers,
        method: 'PUT',
        rejectUnauthorized: false,
    };

    return new Promise((resolve, reject) => {
        const callback = (res: http.IncomingMessage): void => handleHttpResponse(res, resolve, reject);
        const req: http.ClientRequest = makeRequest(`${baseUrl}${endpoint}`, options, callback);
        form.pipe(req);
        req.on('error', reject);
        req.on('response', () => resolve());
    });
}

export async function get(baseUrl: string, authToken: string, endpoint: string): Promise<any> {
    const headers: http.OutgoingHttpHeaders = {
        Authorization: `Bearer ${authToken}`,
    };

    const options = {
        headers,
        method: 'GET',
        rejectUnauthorized: false,
    };

    return new Promise((resolve, reject): void => {
        const callback = (res: http.IncomingMessage): void => handleHttpResponse(res, resolve, reject);
        const req: http.ClientRequest = makeRequest(`${baseUrl}${endpoint}`, options, callback);
        req.on('error', reject);
        req.end();
    });
}

export async function deleteRequest(baseUrl: string, authToken: string, endpoint: string): Promise<any> {
    const headers: http.OutgoingHttpHeaders = {
        Authorization: `Bearer ${authToken}`,
    };

    const options = {
        headers,
        method: 'DELETE',
        rejectUnauthorized: false,
    };

    return new Promise((resolve, reject): void => {
        const callback = (res: http.IncomingMessage): void => handleHttpResponse(res, resolve, reject);
        const req: http.ClientRequest = makeRequest(`${baseUrl}${endpoint}`, options, callback);
        req.on('error', reject);
        req.end();
    });
}

declare interface IResponseBase {
    result: number;
}

function isResponse(object: any): object is IResponseBase {
    return 'result' in object;
}

export const validateResponseCode = (res: any) => {
    if (!res) {
        throw new Error(`Failed: ${JSON.stringify(res)}`);
    }

    if (!isResponse(res)) {
        throw new Error(`Failed: ${JSON.stringify(res)}`);
    }

    const r: IResponseBase = res as IResponseBase;

    if (r.result !== 0) {
        throw new Error(`Failed: ${JSON.stringify(res)}`);
    }
};

export function createWebSocketClient(url: string, path: string) {
    const ws = io(url, {
        autoConnect: false,
        path,
        rejectUnauthorized: false,
        transports: ['websocket', 'polling'],
    });

    ws.on('connect', () => ws.emit('register', ws.id));

    ws.connect();

    return ws;
}

interface IWSMessage {
    event: string;
    data: any;
}

// Returns a promise which resolves to:
// - the value returned by condition, if succeeded
// - undefined, if timeout
// condition should return a truthy value to indicate that the event is accepted.
export function makeAwaiter<TResponse>(
    ws: SocketIOClient.Socket,
    eventName: string,
    condition: (data: any) => TResponse | false,
    timeoutMs: number
): Promise<TResponse | undefined> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            ws.off('message', callback);
            resolve(undefined);
        }, timeoutMs);

        const callback = (msg: IWSMessage) => {
            if (msg.event !== eventName) {
                return;
            }
            const result = condition(msg.data);
            if (result) {
                clearTimeout(timer);
                ws.off('message', callback);
                resolve(result);
            }
        };

        ws.on('message', callback);
    });
}
