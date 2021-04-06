import { Transport} from '@bisect/bisect-core-ts';
import { SenderProfiles } from './senderProfiles';

//////////////////////////////////////////////////////////////////////////////

export default class SignalGenerator {
    public constructor(private readonly transport: Transport) {}

    public get profiles(): SenderProfiles {
        return new SenderProfiles(this.transport);
    }
}
