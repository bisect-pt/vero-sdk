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

    // public async import(path: string): Promise<void> {
    //     return this.transport.putForm(`/api/senderprofile/import`, [{ name: 'file', value: path }]);
    // }

    public async export(): Promise<void> {
        return this.transport.get(`/api/senderprofile/export`);
    }

    public async get(profileId: string): Promise<any> {
        return this.transport.get(`/api/senderprofile/${profileId}`);
    }

    public async getAll(): Promise<any> {
        return this.transport.get(`/api/senderprofile`);
    }

    public async update(profileId: string, profile: IGeneratorProfile): Promise<IGeneratorProfile> {
        return this.transport.put(`/api/senderprofile/${profileId}`, profile);
    }
}
