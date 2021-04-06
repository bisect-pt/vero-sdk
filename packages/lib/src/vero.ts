import { Unwinder, Transport, RestClient, get, post, WSCLient} from '@bisect/bisect-core-ts';
import * as apiTypes from './api';
import { AuthClient, ILoginData, IApiHandler, IGenericResponse, ILoginResponse } from './auth';
import SignalGenerator from './signalGenerator'
import Settings from './settings';
import System from './system';
import User from './user';
// import { Transport } from './transport';
// import { RestClient } from './transport/restClient';
// import { get, post } from './transport/common';
// import WSCLient from './transport/wsClient';
import TokenStorage from './tokenStorage';
import _ from 'lodash';
import { GeneratorChannelId, IGeneratorProfile, ICaptureSettings, ICaptureJob, IGeneratorStatus, StateMachine } from './api/generator'
import { SocketEvents, CaptureJobStates, Collections } from './api/wsEvents'
//////////////////////////////////////////////////////////////////////////////

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

const makeApiHandler = (baseUrl: string): IApiHandler => ({
    login: async (data: ILoginData): Promise<IGenericResponse<ILoginResponse>> =>
        post(baseUrl, null, '/auth/login', data),
    revalidateToken: async (token: string): Promise<IGenericResponse<ILoginResponse>> =>
        get(baseUrl, token, '/api/user/revalidate-token'),
});

export default class VERO {
    private readonly transport: Transport;

    private readonly authClient: AuthClient;

    private readonly rest: RestClient;

    private ws?: WSCLient = undefined;

    public constructor(private readonly baseUrl: string) {
        const unwinder = new Unwinder();

        try {
            const apiHandler = makeApiHandler(baseUrl);
            const storage = new TokenStorage();
            this.authClient = new AuthClient(apiHandler, storage);
            unwinder.add(() => this.authClient.close());

            this.rest = new RestClient(baseUrl, this.authClient.getToken.bind(this.authClient));
            const wsGetter = () => {
                if(this.ws === undefined){
                    throw new Error("Not logged in");
                } 
                return this.ws.client;
        }
            this.transport = new Transport(this.rest, wsGetter);

            unwinder.reset();
        } finally {
            unwinder.unwind();
        }
    }

    public async login(username: string, password: string): Promise<void> {
        const loginError = await this.authClient.login(username, password);
        if (loginError) {
            throw loginError;
        }
        const user: apiTypes.user.IUserInfo = (await this.rest.get('/api/user')) as apiTypes.user.IUserInfo;
        this.ws = new WSCLient(this.baseUrl, '/socket');
    }

    public async close(): Promise<void> {
        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
        }

        this.authClient.close();
    }

    public get wsClient(): SocketIOClient.Socket | undefined {
        return this.ws?.client;
    }

    public get system() {
        return new System(this.transport);
    }

    public get user() {
        return new User(this.transport);
    }

    public get settings() {
        return new Settings(this.transport);
    }

    public get signalGenerator() {
        return new SignalGenerator(this.transport);
    }

    public async logout(): Promise<void> {
        return this.transport.post('/auth/logout', {});
    }

    public async startGenerator(channelId: GeneratorChannelId, profile: IGeneratorProfile): Promise<any> {
        return this.transport.post(`/api/sendergroup/${channelId}/start`, { profile });
    }

    public makeGeneratorAwaiter(channelId: GeneratorChannelId, profileId: string, timeoutMs: number): Promise<any> {
        return this.transport.makeAwaiter(
            SocketEvents.generatorStatus,
            (data: IGeneratorStatus) => {
                const id = getCurrentProfileId(data, channelId);
                return id === profileId;
            },
            timeoutMs
        );
    }

    public async stopGenerator(channelId: GeneratorChannelId): Promise<any> {
        return this.transport.post(`/api/sendergroup/${channelId}/stop`, {});
    }

    public async startCapture(settings: ICaptureSettings): Promise<any> {
        return this.transport.post('/api/capture/capture', settings);
    }

    public makeCaptureAwaiter(captureId: string, timeoutMs: number): Promise<any> {
        return this.transport.makeAwaiter(
            SocketEvents.collectionUpdate,
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

}
