import { IGeneratorProfile } from './api/senderProfiles';
import { Transport } from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export class SenderProfiles {
    public constructor(private readonly transport: Transport) {}

    public async create(profile: IGeneratorProfile): Promise<void> {
        return this.transport.post('/api/senderprofile', profile);
    }

    public async delete(profileId: string): Promise<void> {
        return this.transport.del(`/api/senderprofile/${profileId}`);
    }
}
