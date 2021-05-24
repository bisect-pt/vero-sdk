import { IMonitoredCaptureSource, IConnectorsGroupsStatus } from './capture';
import { INtpStatus } from './ntp';
import { IError } from './types';

export enum SocketEvents {
    /*
    Collection update
    Payload: {
        collection : string - one of the identifiers in collections below
        added : undefined | [an array of added objects]
        deletedIDs : undefined | [an array of IDs of deleted objects]
        updated : undefined | [an array of updated objects]
    }
    */
    collectionUpdate = 'COLLECTION_UPDATE',
    notify = 'NOTIFY',
    systemStatus = 'SYSTEM_STATUS',
    interruptSystem = 'INTERRUPT_SYSTEM',
    systemUpdate = 'SYSTEM_UPDATE',
    downloadManagerUpdate = 'DOWNLOAD_MANAGER_UPDATE',
    generatorStatus = 'GENERATOR_STATUS',
    captureStatus = 'CAPTURE_STATUS',
    captureMonitorStatus = 'CAPTURE_MONITOR_STATUS', // ICaptureMonitorStatusEvent
    dockerImageUpdate = 'DOCKER_IMAGE_UPDATE',
}

export enum Collections {
    captureJobs = 'captureJobs',
    captureSources = 'captureSources',
    senderProfiles = 'senderProfiles',
}

export interface IWsNotifyEvent {
    tag: string;
    success: boolean;
    desc?: string;
}

export enum WsNotifyEventTag {
    senderProfileExportCompleted = 'senderprofiles.export.finish',
    backupDatabaseCompleted = 'backup.finished',
    logsExportCompleted = 'logs.exporter.finish',
}

export interface ISenderProfileExportNotification extends IWsNotifyEvent {
    tag: WsNotifyEventTag.senderProfileExportCompleted;
    data: {
        correlationId: string;
    };
}

export interface IBackupDatabaseNotification extends IWsNotifyEvent {
    tag: WsNotifyEventTag.backupDatabaseCompleted;
    data: {
        correlationId: string;
    };
}

export interface ILogsExportNotification extends IWsNotifyEvent {
    tag: WsNotifyEventTag.logsExportCompleted;
    data: {
        correlationId: string;
    };
}

export interface ICaptureMonitorStatusEvent {
    sources: IMonitoredCaptureSource[];
    connectors?: IConnectorsGroupsStatus;
}

export interface ICaptureStatusEvent {
    connectors: IConnectorsGroupsStatus;
}

export function isCaptureStatusEvent(v: unknown): v is ICaptureStatusEvent {
    if (!(v as ICaptureStatusEvent).connectors) return false;

    return true;
}
export interface ISystemStatusEvent {
    systemTime: Date;
    ntp: INtpStatus;
    errors: IError[];
    warnings: IError[];
}
