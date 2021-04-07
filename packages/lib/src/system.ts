import { IVersion } from './api/system';
import { Transport} from '@bisect/bisect-core-ts';
import { License } from './license';

//////////////////////////////////////////////////////////////////////////////

export default class System {
    public constructor(private readonly transport: Transport) {}

    public get license(): License {
        return new License(this.transport);
    }

    public async getVersion(): Promise<IVersion> {
       return await this.transport.get('/api/version');
    }

    public async resetDatabase(): Promise<void> {
        return await this.transport.post('/api/system/drop', {});
    }

    public async restartServices(): Promise<void> {
        return await this.transport.post('/api/system/restartServices', {});
    }
}