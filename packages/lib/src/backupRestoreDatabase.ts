import { Transport } from '@bisect/bisect-core-ts';
import { WsNotifyEventTag, SocketEvents, IBackupDatabaseNotification } from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////

function isIBackupDatabaseNotification(e: unknown): e is IBackupDatabaseNotification {
    return (e as IBackupDatabaseNotification).tag === WsNotifyEventTag.backupDatabaseCompleted;
}

export default class BackupRestoreDatabase {
    public constructor(private readonly transport: Transport) {}

    public async download(correlationId: string): Promise<any> {
        return await this.transport.post(`/api/backuprestore/download`, { correlationId });
    }

    public makeDownloadAwaiter(correlationId: string, timeoutMs: number): Promise<boolean | undefined> {
        return this.transport.makeAwaiter<boolean | undefined>(
            SocketEvents.notify,
            (event: unknown) => {
                if (!isIBackupDatabaseNotification(event)) {
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

    public async upload(path: string): Promise<void> {
        return this.transport.putForm(`/api/backuprestore/upload`, [{ name: 'file', value: path }]);
    }
}
