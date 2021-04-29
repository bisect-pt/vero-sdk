import { Transport } from '@bisect/bisect-core-ts';
import { WsNotifyEventTag, SocketEvents, ILogsExportNotification } from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////

function isILogsExportNotification(e: unknown): e is ILogsExportNotification {
    return (e as ILogsExportNotification).tag === WsNotifyEventTag.logsExportCompleted;
}

export default class Logs {
    public constructor(private readonly transport: Transport) {}

    public makeExportAwaiter(correlationId: string, timeoutMs: number): Promise<boolean | undefined> {
        return this.transport.makeAwaiter<boolean | undefined>(
            SocketEvents.notify,
            (event: unknown) => {
                if (!isILogsExportNotification(event)) {
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

    public async export(correlationId: string): Promise<any> {
        return await this.transport.post('/api/logs/export', { correlationId });
    }
}
