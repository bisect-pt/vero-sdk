import { Transport } from '@bisect/bisect-core-ts';
//////////////////////////////////////////////////////////////////////////////

export class Monitor {
    public constructor(private readonly transport: Transport) {}

    private static basePath = '/api/capture';

    public async monitor(): Promise<void> {
        return this.transport.post(`${Monitor.basePath}/monitor`, {});
    }
}
