import _ from 'lodash';
import { types } from '@mipw/vero-api';
import { login } from './auth';
import { createWebSocketClient } from './common';
import { Transport } from './transport';
import { User } from './user';
import { Settings } from './settings';
import { SignalGenerator } from './signalGenerator';
import { System } from './system';

//////////////////////////////////////////////////////////////////////////////

interface ICaptureJob {
    id: string;
}

// Extracts the current profile Id of the channel with id 'channelId'
// If the channel is not active, returns undefined
// TODO: proper types
const getCurrentProfileId = (data: types.IGeneratorStatus, channelId: types.GeneratorChannelId): string | undefined => {
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

    if (status !== types.StateMachine.Started) {
        return undefined;
    }
    return generatorProfileId;
};

export class Vero {
    public static async connect(baseUrl: string, userName: string, password: string): Promise<Vero> {
        const token = await login(baseUrl, userName, password);

        const ws = createWebSocketClient(baseUrl, '/socket');

        return new Vero(baseUrl, token, ws);
    }

    private transport: Transport;

    private constructor(baseUrl: string, token: string, ws: SocketIOClient.Socket) {
        this.transport = new Transport(baseUrl, token, ws);
    }

    public close(): void {
        this.transport.close();
    }

    public async logout(): Promise<void> {
        return this.transport.postRaw('/auth/logout', {});
    }

    public get system(): System {
        return new System(this.transport);
    }

    public get user(): User {
        return new User(this.transport);
    }

    public get settings(): Settings {
        return new Settings(this.transport);
    }

    public get signalGenerator(): SignalGenerator {
        return new SignalGenerator(this.transport);
    }

    public async startGenerator(channelId: types.GeneratorChannelId, profile: types.IGeneratorProfile): Promise<any> {
        return this.transport.post(`/sendergroup/${channelId}/start`, { profile });
    }

    public makeGeneratorAwaiter(channelId: types.GeneratorChannelId, profileId: string, timeoutMs: number): Promise<any> {
        return this.transport.makeAwaiter(
            types.SocketEvent.generatorStatus,
            (data: types.IGeneratorStatus) => {
                const id = getCurrentProfileId(data, channelId);
                return id === profileId;
            },
            timeoutMs
        );
    }

    public async stopGenerator(channelId: types.GeneratorChannelId): Promise<any> {
        return this.transport.post(`/sendergroup/${channelId}/stop`, {});
    }

    public async startCapture(settings: types.ICaptureSettings): Promise<any> {
        return this.transport.post('/capture/capture', settings);
    }

    public makeCaptureAwaiter(captureId: string, timeoutMs: number): Promise<any> {
        return this.transport.makeAwaiter(
            types.SocketEvent.collectionUpdate,
            (data: any) => {
                if (data.collection !== types.Collections.captureJobs) {
                    return false;
                }
                const updated = data.updated || [];
                const job = updated.find((u: ICaptureJob) => u.id === captureId);
                if (!job) {
                    return false;
                }
                if (job.state !== types.CaptureJobStates.Completed) {
                    return false;
                }
                return job;
            },
            timeoutMs
        );
    }
}
