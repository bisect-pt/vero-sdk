import { types } from '@mipw/vero-api';
import { Transport } from './transport';
import { License } from './license';

//////////////////////////////////////////////////////////////////////////////

export class System {
    public constructor(private readonly transport: Transport) {}

    public get license(): License {
        return new License(this.transport);
    }

    public async getVersion(): Promise<types.IVersion> {
        return this.transport.get('/version');
    }

    public async resetDatabase(): Promise<void> {
        return this.transport.post('/system/drop', {});
    }

    public async restartServices(): Promise<void> {
        return this.transport.post('/system/restartServices', {});
    }
}
