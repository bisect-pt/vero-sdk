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

    public async revalidateToken(): Promise<any> {
        return resolveResponse(await this.transport.get('/api/user/revalidate-token'));
    }

    public async ebuListToken(): Promise<any> {
        return resolveResponse(await this.transport.get('/api/user/ebu-list-token'));
    }
}
