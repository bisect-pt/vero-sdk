import _ from 'lodash';
import {
    ISettings,
    IGenlockSettings,
    GenlockFamily,
    IGenlockStatus,
    INmosSettings,
    IPtpSettings,
    SocketEvents,
    IFullGeneratorStatus,
    ISfpInterfaceSettings,
} from '@mipw/vero-api';
import { Transport } from '@bisect/bisect-core-ts';
import { resolveResponse } from './utils';

//////////////////////////////////////////////////////////////////////////////

export default class Settings {
    public constructor(private readonly transport: Transport) {}

    public async getAll(): Promise<ISettings> {
        return resolveResponse(await this.transport.get('/api/settings'));
    }

    public async setGenlock(settings: IGenlockSettings): Promise<void> {
        return resolveResponse(await this.transport.post('/api/settings/genlock', settings));
    }

    public makeGenlockAwaiter(family: GenlockFamily, timeoutMs: number): Promise<IGenlockStatus | undefined> {
        return this.transport.makeAwaiter<IGenlockStatus>(
            SocketEvents.generatorStatus,
            (data: IFullGeneratorStatus): IGenlockStatus | undefined => {
                const current = data?.[0]?.genlock;
                if (current === undefined) {
                    return undefined;
                }
                if (!current.locked) {
                    return undefined;
                }
                if (current.family !== family) {
                    return undefined;
                }

                return current;
            },
            timeoutMs
        );
    }

    public async setGenlockSync(settings: IGenlockSettings, timeoutMs: number): Promise<IGenlockStatus | undefined> {
        await this.setGenlock(settings);
        return await this.makeGenlockAwaiter(settings.family, timeoutMs);
    }

    public async setNmos(settings: Partial<INmosSettings>): Promise<void> {
        return resolveResponse(await this.transport.post('/api/settings/nmos', settings));
    }

    public async setPtp(settings: Partial<IPtpSettings>): Promise<void> {
        return resolveResponse(await this.transport.post('/api/settings/ptp', settings));
    }

    public async setIgmp(settings: Partial<any>): Promise<void> {
        return resolveResponse(await this.transport.post('/api/settings/igmp', settings));
    }

    public async setSfpsA(settings: Partial<ISfpInterfaceSettings>): Promise<void> {
        return resolveResponse(await this.transport.post('/api/settings/sfps/A', settings));
    }

    public async setSfpsB(settings: Partial<ISfpInterfaceSettings>): Promise<void> {
        return resolveResponse(await this.transport.post('/api/settings/sfps/B', settings));
    }
}
