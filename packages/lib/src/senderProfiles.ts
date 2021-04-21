import { Transport } from '@bisect/bisect-core-ts';
import { IGeneratorProfile } from '@mipw/vero-api';

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
