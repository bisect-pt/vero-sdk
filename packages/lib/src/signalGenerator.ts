import { Transport } from './transport';
import { SenderProfiles } from './senderProfiles';

//////////////////////////////////////////////////////////////////////////////

export default class SignalGenerator {
    public constructor(private readonly transport: Transport) {}

    public get profiles(): SenderProfiles {
        return new SenderProfiles(this.transport);
    }
}
