import { ISubscribeMessage, IUnsubscribeMessage } from './capture';

export function isSubscribeMessage(message: any): message is ISubscribeMessage {
    if (typeof message !== 'object') {
        return false;
    }

    const { sessionId, sources } = message;
    if (typeof sessionId !== 'string') {
        return false;
    }

    if (!Array.isArray(sources)) {
        return false;
    }

    return true;
}

export function isUnsubscribeMessage(message: any): message is IUnsubscribeMessage {
    if (typeof message !== 'object') {
        return false;
    }

    const { sessionId, sourceIds } = message;
    if (typeof sessionId !== 'string') {
        return false;
    }

    if (!Array.isArray(sourceIds)) {
        return false;
    }

    return true;
}
