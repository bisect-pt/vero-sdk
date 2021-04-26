import { Transport } from '@bisect/bisect-core-ts';
import { SenderProfiles } from './senderProfiles';
import {
    GeneratorChannelId,
    IGeneratorProfile,
    IFullGeneratorStatus,
    StateMachine,
    SocketEvents,
} from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////

const getCurrentProfileId = (data: IFullGeneratorStatus, channelId: GeneratorChannelId): string | undefined => {
    const senders = data['0']?.generator?.senders;

    if (!senders) {
        return undefined;
    }
    const sender = senders.find((s: any) => s.group_id === channelId);
    if (!sender) {
        return undefined;
    }
    const generatorProfileId = sender.generator_profile_id;
    const status = sender.status;

    if (status !== StateMachine.Started) {
        return undefined;
    }
    return generatorProfileId;
};

export default class SignalGenerator {
    public constructor(private readonly transport: Transport) {}

    public get profiles(): SenderProfiles {
        return new SenderProfiles(this.transport);
    }

    public async start(channelId: GeneratorChannelId, profile: IGeneratorProfile): Promise<any> {
        return this.transport.post(`/api/sendergroup/${channelId}/start`, { profile });
    }

    public makeAwaiter(channelId: GeneratorChannelId, profileId: string, timeoutMs: number): Promise<any> {
        return this.transport.makeAwaiter(
            SocketEvents.generatorStatus,
            (data: IFullGeneratorStatus): true | undefined => {
                const id = getCurrentProfileId(data, channelId);
                return id === profileId ? true : undefined;
            },
            timeoutMs
        );
    }

    public async stop(channelId: GeneratorChannelId): Promise<any> {
        return this.transport.post(`/api/sendergroup/${channelId}/stop`, {});
    }
}
