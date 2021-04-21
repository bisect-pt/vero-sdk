import { IUserInfo } from '@mipw/vero-api';
import { Transport } from '@bisect/bisect-core-ts';
import { resolveResponse } from './utils';

//////////////////////////////////////////////////////////////////////////////

export default class User {
    public constructor(private readonly transport: Transport) {}

    public async getInfo(): Promise<IUserInfo> {
        return resolveResponse(await this.transport.get('/api/user'));
    }

    public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        const data = { oldpwd: oldPassword, password: newPassword };
        return this.transport.post('/api/user/update', data);
    }
}
