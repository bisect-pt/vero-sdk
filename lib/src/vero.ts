import _ from 'lodash';
import { login } from './auth';
import { createWebSocketClient, get, makeAwaiter, post, validateResponseCode } from './common';
import { CaptureJobStates, Collections, GeneratorChannelId, GenlockFamily, SocketEvent, StateMachine } from './enums';
import { logger } from './logger';
import * as types from './types';

//////////////////////////////////////////////////////////////////////////////

interface ICaptureSettings {}
interface IGeneratorStatus {}
interface ICaptureJob {
    id: string;
}

interface IGeneratorProfile {}

// Extracts the current profile Id of the channel with id 'channelId'
// If the channel is not active, returns undefined
// TODO: proper types
const getCurrentProfileId = (data: IGeneratorStatus, channelId: GeneratorChannelId): string | undefined => {
    const senders = _.get(data, `[0].generator.senders`);
    if (!senders) {
        return undefined;
    }
    const sender = senders.find((s: any) => s.group_id === channelId);
    if (!sender) {
        return undefined;
    }
    const generatorProfileId = _.get(sender, 'generator_profile_id');
    const status = _.get(sender, 'status');

    if (status !== StateMachine.Started) {
        return undefined;
    }
    return generatorProfileId;
};

export class Vero {
    public static async connect(baseUrl: string, userName: string, password: string): Promise<Vero> {
        const token = await login(baseUrl, userName, password);
        logger.info(`Logged into ${baseUrl}`);

        const ws = createWebSocketClient(baseUrl, '/socket');

        return new Vero(baseUrl, token, ws);
    }

    private baseUrl: string;
    private token: string;
    private ws: SocketIOClient.Socket;

    private constructor(baseUrl: string, token: string, ws: SocketIOClient.Socket) {
        this.baseUrl = baseUrl;
        this.token = token;
        this.ws = ws;

        this.ws.on('error', this.handleWsError);
        this.ws.on('connect_error', this.handleWsConnectError);
    }

    public shutdown(): void {
        this.ws.off('error', this.handleWsError);
        this.ws.off('connect_error', this.handleWsConnectError);
        this.ws.close();
    }

    public async logout(): Promise<void> {
        return this.postRaw('/auth/logout', {});
    }

    public async getVersion(): Promise<types.IVersion> {
        return this.get('/version');
    }

    public async getUser(): Promise<types.IUserInfo> {
        return this.get('/user');
    }

    public async setGenlock(family: GenlockFamily): Promise<void> {
        const data = { family };
        return this.post('/settings/genlock', data);
    }

    public makeGenlockAwaiter(family: GenlockFamily, timeoutMs: number): Promise<any> {
        return this.makeAwaiter(
            SocketEvent.generatorStatus,
            (data: any) => {
                // TODO: use a proper type for the event
                const current = _.get(data, '[0].genlock');
                if (current === undefined) {
                    return false;
                }
                if (!current.locked) {
                    return false;
                }
                if (current.family !== family) {
                    return false;
                }

                return current;
            },
            timeoutMs
        );
    }

    public async setGenlockSync(family: GenlockFamily, timeoutMs: number) {
        await this.setGenlock(family);
        const awaiter = this.makeGenlockAwaiter(family, timeoutMs);
        return await awaiter;
    }

    public async startGenerator(channelId: GeneratorChannelId, profile: IGeneratorProfile) {
        return this.post(`/sendergroup/${channelId}/start`, { profile });
    }

    public makeGeneratorAwaiter(channelId: GeneratorChannelId, profileId: string, timeoutMs: number): Promise<any> {
        return this.makeAwaiter(
            SocketEvent.generatorStatus,
            (data: IGeneratorStatus) => {
                const id = getCurrentProfileId(data, channelId);
                return id === profileId;
            },
            timeoutMs
        );
    }

    public async stopGenerator(channelId: GeneratorChannelId) {
        return this.post(`/sendergroup/${channelId}/stop`, {});
    }

    public async startCapture(settings: ICaptureSettings) {
        return this.post('/capture/capture', settings);
    }

    public makeCaptureAwaiter(captureId: string, timeoutMs: number): Promise<any> {
        return this.makeAwaiter(
            SocketEvent.collectionUpdate,
            (data: any) => {
                if (data.collection !== Collections.captureJobs) {
                    return false;
                }
                const updated = data.updated || [];
                const job = updated.find((u: ICaptureJob) => u.id === captureId);
                if (!job) {
                    return false;
                }
                if (job.state !== CaptureJobStates.Completed) {
                    return false;
                }
                return job;
            },
            timeoutMs
        );
    }

    /////////////////////////////////////////////
    // PRIVATE

    private handleWsError(error: any): void {
        logger.error(`WebSocket error: ${error}`);
    }

    private handleWsConnectError(error: any): void {
        logger.error(`WebSocket connection error: ${error}`);
    }

    private async get(endpoint: string): Promise<any> {
        const response = await get(`${this.baseUrl}/api`, this.token, endpoint);
        validateResponseCode(response);
        return response.content;
    }

    private async post(endpoint: string, data: any): Promise<any> {
        const response = await post(`${this.baseUrl}/api`, this.token, endpoint, data);
        validateResponseCode(response);
        return response.content;
    }

    private async postRaw(endpoint: string, data: any): Promise<any> {
        return await post(`${this.baseUrl}`, this.token, endpoint, data);
    }

    // Returns a promise which resolves to:
    // - the event, if succeeded
    // - undefined, if timeout
    private makeAwaiter(eventName: string, condition: any, timeoutMs: number): Promise<any> {
        return makeAwaiter(this.ws, eventName, condition, timeoutMs);
    }
}
