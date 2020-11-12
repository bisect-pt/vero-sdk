import * as types from './types';
import { Transport } from './transport';

//////////////////////////////////////////////////////////////////////////////

export class User {
    public constructor(private readonly transport: Transport) {}

    public async getInfo(): Promise<types.IUserInfo> {
        return this.transport.get('/user');
    }

    public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        const data = { oldpwd: oldPassword, password: newPassword };
        return this.transport.post('/user/update', data);
    }
}
