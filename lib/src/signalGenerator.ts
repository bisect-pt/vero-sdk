import { Transport } from './transport';
import { SenderProfiles } from './senderProfiles';

//////////////////////////////////////////////////////////////////////////////

export class SignalGenerator {
    public constructor(private readonly transport: Transport) {}

    public get profiles(): SenderProfiles {
        return new SenderProfiles(this.transport);
    }
}
