import { Transport } from '@bisect/bisect-core-ts';
import { IGeneratorProfile, SocketEvents, ISenderProfileExportNotification, WsNotifyEventTag } from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////

function isISenderProfileExportNotification(e: unknown): e is ISenderProfileExportNotification {
    return (e as ISenderProfileExportNotification).tag === WsNotifyEventTag.senderProfileExportCompleted;
}

export class SenderProfiles {
    public constructor(private readonly transport: Transport) {}

    public async create(profile: IGeneratorProfile): Promise<void> {
        return this.transport.post('/api/senderprofile', profile);
    }

    public async delete(profileId: string): Promise<void> {
        return this.transport.del(`/api/senderprofile/${profileId}`);
    }

    public async import(path: string, value: any): Promise<void> {
        return this.transport.putForm(`/api/senderprofile/import`, [{ name: path, value: value }]);
    }

    public async export(correlationId: string): Promise<any> {
        return this.transport.post(`/api/senderprofile/export`, { correlationId });
    }

    public makeExportAwaiter(correlationId: string, timeoutMs: number): Promise<boolean | undefined> {
        return this.transport.makeAwaiter<boolean | undefined>(
            SocketEvents.notify,
            (event: unknown) => {
                if (!isISenderProfileExportNotification(event)) {
                    return undefined;
                }
                if (event.data.correlationId !== correlationId) {
                    return undefined;
                }
                return event.success;
            },
            timeoutMs
        );
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
