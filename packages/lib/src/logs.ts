import { IUserInfo } from '@mipw/vero-api';
import { Transport } from '@bisect/bisect-core-ts';
import { resolveResponse } from './utils';

//////////////////////////////////////////////////////////////////////////////

export default class Logs {
    public constructor(private readonly transport: Transport) {}

    public async getAllLogs(): Promise<any> {
        return await this.transport.get('/api/logs/export');
    }
}
