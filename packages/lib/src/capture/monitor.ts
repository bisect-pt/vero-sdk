import { Transport } from '@bisect/bisect-core-ts';
import { ISubscribeMessage, IUnsubscribeMessage } from '@mipw/vero-api';
//////////////////////////////////////////////////////////////////////////////

export class Monitor {
    public constructor(private readonly transport: Transport) {}

    private static basePath = '/api/capture';

    public async monitor(): Promise<void> {
        return this.transport.post(`${Monitor.basePath}/monitor`, {});
    }

    public async subscribe(subscribeMessage: ISubscribeMessage): Promise<void> {
        return this.transport.post(`${Monitor.basePath}/subscribe`, subscribeMessage);
    }
    public async unsubscribe(unsubscribeMessage: IUnsubscribeMessage): Promise<void> {
        return this.transport.post(`${Monitor.basePath}/unsubscribe`, unsubscribeMessage);
    }
}
