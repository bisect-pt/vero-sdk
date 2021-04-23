import { IUserInfo } from '@mipw/vero-api';
import { Transport } from '@bisect/bisect-core-ts';
import { resolveResponse } from './utils';

//////////////////////////////////////////////////////////////////////////////

export default class Eula {
    public constructor(private readonly transport: Transport) {}

    public async getEula(): Promise<any> {
        return await this.transport.get('/api/eula');
    }

    public async acceptEula(): Promise<any> {
        return this.transport.post('/api/eula', {});
    }
}
