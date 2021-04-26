import { Transport } from '@bisect/bisect-core-ts';
import veroApi, { SocketEvents, IFullGeneratorStatus } from '@mipw/vero-api';
import { IRxRates, IRateCondition } from './types';
import { makeCaptureCompletePredicate, makeSfpRatePredicate } from './utils';
import { Sources } from './sources';
import { Monitor } from './monitor';

//////////////////////////////////////////////////////////////////////////////

export class Capture {
    public constructor(private readonly transport: Transport) {}

    public get sources() {
        return new Sources(this.transport);
    }

    public get monitor() {
        return new Monitor(this.transport);
    }

    public async start(settings: veroApi.ICaptureSettings): Promise<any> {
        return this.transport.post('/api/capture/capture', settings);
    }

    // Returns the capture job or or undefined in case of timeout
    public makeCaptureAwaiter(captureId: string, timeoutMs: number): Promise<veroApi.ICaptureJob | undefined> {
        return this.transport.makeAwaiter(
            SocketEvents.collectionUpdate,
            makeCaptureCompletePredicate(captureId),
            timeoutMs
        );
    }

    // Returns the capture job or or undefined in case of timeout
    public makeSfpStateAwaiter(conditions: IRateCondition[], timeoutMs: number): Promise<IRxRates | undefined> {
        return this.transport.makeAwaiter(SocketEvents.generatorStatus, makeSfpRatePredicate(conditions), timeoutMs);
    }
}
