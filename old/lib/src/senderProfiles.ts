import { types } from '@mipw/vero-api';
import { Transport } from './transport';

//////////////////////////////////////////////////////////////////////////////

export class SenderProfiles {
    public constructor(private readonly transport: Transport) {}

    public async create(profile: types.IGeneratorProfile): Promise<void> {
        return this.transport.post('/senderprofile', profile);
    }

    public async delete(profileId: string): Promise<void> {
        return this.transport.delete(`/senderprofile/${profileId}`);
    }
}
