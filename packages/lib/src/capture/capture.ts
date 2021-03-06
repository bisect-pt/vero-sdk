import { Transport } from '@bisect/bisect-core-ts';
import {
    ICaptureJob,
    ICaptureConfiguration,
    SocketEvents,
    IConnectorPatchRequest,
    ConnectorKind,
} from '@mipw/vero-api';
import { IRxRates, IRateCondition } from './types';
import { makeCaptureCompletePredicate, makeSfpRatePredicate } from './utils';
import { Sources } from './sources';
import { Monitor } from './monitor';
import { Jobs } from './jobs';

//////////////////////////////////////////////////////////////////////////////

export class Capture {
    public constructor(private readonly transport: Transport) {}

    public get sources() {
        return new Sources(this.transport);
    }

    public get monitor() {
        return new Monitor(this.transport);
    }

    public get jobs() {
        return new Jobs(this.transport);
    }

    public async start(settings: ICaptureConfiguration): Promise<any> {
        return this.transport.post('/api/capture/capture', settings);
    }

    public async selectSource(
        connectorKind: ConnectorKind,
        index: number,
        connectorSource: IConnectorPatchRequest
    ): Promise<any> {
        return this.transport.patch(`/api/capture/connectors/${connectorKind}/${index}`, connectorSource);
    }

    // Returns the capture job or or undefined in case of timeout
    public makeCaptureAwaiter(captureId: string, timeoutMs: number): Promise<ICaptureJob | undefined> {
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
