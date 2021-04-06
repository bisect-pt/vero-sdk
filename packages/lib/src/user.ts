import { IUserInfo } from './api/user';
import { Transport} from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export default class User {
    public constructor(private readonly transport: Transport) {}

    public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
        const data = { oldpwd: oldPassword, password: newPassword };
        return this.transport.post('/api/user/update', data);
    }
}
