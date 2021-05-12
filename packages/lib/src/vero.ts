import { Unwinder, Transport, RestClient, get, post, WSCLient } from '@bisect/bisect-core-ts';
import { LIST } from '@bisect/ebu-list-sdk';
import { AuthClient, ILoginData, IApiHandler, IGenericResponse, ILoginResponse } from './auth';
import SignalGenerator from './signalGenerator';
import { Capture } from './capture';
import Settings from './settings';
import System from './system';
import User from './user';
import Eula from './eula';
import Logs from './logs';
import BackupRestoreDatabase from './backupRestoreDatabase';
import TokenStorage from './tokenStorage';
import _ from 'lodash';
import DownloadManager from './downloadManager';

//////////////////////////////////////////////////////////////////////////////

const makeApiHandler = (baseUrl: string): IApiHandler => ({
    login: async (data: ILoginData): Promise<IGenericResponse<ILoginResponse>> =>
        post(baseUrl, null, '/auth/login', data),
    revalidateToken: async (token: string): Promise<IGenericResponse<ILoginResponse>> =>
        get(baseUrl, token, '/api/user/revalidate-token'),
});

export class VERO {
    private readonly transport: Transport;

    private readonly authClient: AuthClient;

    private readonly rest: RestClient;

    private ws?: WSCLient = undefined;

    public constructor(private readonly address: string) {
        const unwinder = new Unwinder();

        try {
            const baseUrl = `https://${address}`;
            const apiHandler = makeApiHandler(baseUrl);
            const storage = new TokenStorage();
            this.authClient = new AuthClient(apiHandler, storage);
            unwinder.add(() => this.authClient.close());

            this.rest = new RestClient(baseUrl, this.authClient.getToken.bind(this.authClient));
            const wsGetter = () => {
                if (this.ws === undefined) {
                    throw new Error('Not logged in');
                }
                return this.ws.client;
            };
            this.transport = new Transport(this.rest, wsGetter);

            unwinder.reset();
        } finally {
            unwinder.unwind();
        }
    }

    public async close(): Promise<void> {
        if (this.ws) {
            this.ws.close();
            this.ws = undefined;
        }

        this.authClient.close();
    }

    public async login(username: string, password: string): Promise<void> {
        const loginError = await this.authClient.login(username, password);
        if (loginError) {
            throw loginError;
        }

        this.ws = new WSCLient(`https://${this.address}`, '/socket');
    }

    public async logout(): Promise<void> {
        return this.transport.post('/auth/logout', {});
    }

    public async getList(): Promise<LIST> {
        const list = new LIST(`http://${this.address}:8080`);
        const ebuListToken = await this.user.ebuListToken();
        list.setToken(ebuListToken.token);
        return list;
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

    public get eula() {
        return new Eula(this.transport);
    }

    public get logs() {
        return new Logs(this.transport);
    }

    public get settings() {
        return new Settings(this.transport);
    }

    public get signalGenerator() {
        return new SignalGenerator(this.transport);
    }

    public get downloadManager() {
        return new DownloadManager(this.transport);
    }

    public get backupRestoreDatabase() {
        return new BackupRestoreDatabase(this.transport);
    }

    public get capture() {
        return new Capture(this.transport);
    }
}
