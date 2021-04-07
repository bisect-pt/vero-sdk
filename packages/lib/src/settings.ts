import _ from 'lodash';
import { ISettings, IGenlockSettings, GenlockFamily, IGenlockStatus,INmosSettings, IPtpSettings } from './api/settings';
import { SocketEvents } from './api/wsEvents'
import { Transport} from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export default class Settings {
    public constructor(private readonly transport: Transport) {}

    public async getAll(): Promise<ISettings> {
        return await this.transport.get('/api/settings');
    }

    public async setGenlock(settings: IGenlockSettings): Promise<void> {
        return await this.transport.post('/api/settings/genlock', settings);
    }

    public makeGenlockAwaiter(family: GenlockFamily, timeoutMs: number): Promise<IGenlockStatus | undefined> {
        return this.transport.makeAwaiter<IGenlockStatus>(
            SocketEvents.generatorStatus,
            (data: any) => {
                console.log(`************************************ response: ${JSON.stringify(data)}`);
                console.log(`************************************ response: ${JSON.stringify(data)}`);
            
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

    public async setGenlockSync(settings: IGenlockSettings, timeoutMs: number): Promise<IGenlockStatus | undefined> {
        await this.setGenlock(settings);
        const awaiter = this.makeGenlockAwaiter(settings.family, timeoutMs);
        return await awaiter;
    }

    public async setNmos(settings: Partial<INmosSettings>): Promise<void> {
        return await this.transport.post('/api/settings/nmos', settings);
    }

    public async setPtp(settings: Partial<IPtpSettings>): Promise<void> {
        return await this.transport.post('/api/settings/ptp', settings);
    }
}