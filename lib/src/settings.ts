import _ from 'lodash';
import * as types from './types';
import { Transport } from './transport';
import { SocketEvent } from './enums';

//////////////////////////////////////////////////////////////////////////////

export class Settings {
    public constructor(private readonly transport: Transport) {}

    public async getAll(): Promise<types.ISettings> {
        return this.transport.get('/settings');
    }

    public async setGenlock(settings: types.IGenlockSettings): Promise<void> {
        return this.transport.post('/settings/genlock', settings);
    }

    public makeGenlockAwaiter(family: types.GenlockFamily, timeoutMs: number): Promise<types.IGenlockStatus | undefined> {
        return this.transport.makeAwaiter<types.IGenlockStatus>(
            SocketEvent.generatorStatus,
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

    public async setGenlockSync(settings: types.IGenlockSettings, timeoutMs: number): Promise<types.IGenlockStatus | undefined> {
        await this.setGenlock(settings);
        const awaiter = this.makeGenlockAwaiter(settings.family, timeoutMs);
        return await awaiter;
    }

    public async setNmos(settings: Partial<types.INmosSettings>): Promise<void> {
        return this.transport.post('/settings/nmos', settings);
    }

    public async setPtp(settings: Partial<types.IPtpSettings>): Promise<void> {
        return this.transport.post('/settings/ptp', settings);
    }
}
