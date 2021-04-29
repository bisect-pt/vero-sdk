export enum ErrorCodes {
    INTERNAL = 'INTERNAL_ERROR',
    CAPTURE_FAILED = 'CAPTURE_FAILED',
    INVALID_PARAMETERS = 'INVALID_PARAMETERS',
}

export interface IError {
    code: ErrorCodes;
    message: string;
}
