import { ICaptureJob, IFullGeneratorStatus, Collections, CaptureJobStates, SfpLabel } from '@mipw/vero-api';
import { IRxRates, IRateCondition } from './types';

export function getRxRates(status: IFullGeneratorStatus): IRxRates | undefined {
    const telemetry = status?.[0]?.sfps_telemetry;
    if (!telemetry) {
        return;
    }

    return {
        [SfpLabel.A]: telemetry[0]?.rx_rate ?? 0,
        [SfpLabel.B]: telemetry[1]?.rx_rate ?? 0,
    };
}

function isMoreThan(wantedRate: number | undefined, actualRate: number | undefined): boolean {
    if (wantedRate === undefined) {
        return true;
    }

    if (actualRate === undefined) {
        return false;
    }

    return actualRate > wantedRate;
}

function isLessThan(wantedRate: number | undefined, actualRate: number | undefined): boolean {
    if (wantedRate === undefined) {
        return true;
    }

    if (actualRate === undefined) {
        return false;
    }

    return actualRate < wantedRate;
}

function isConditionFulfilled(rates: IRxRates, condition: IRateCondition): boolean {
    switch (condition.kind) {
        case 'moreThan': {
            return [SfpLabel.A, SfpLabel.B].every((label) => isMoreThan(condition.rates[label], rates[label]));
        }
        case 'lessThan': {
            return [SfpLabel.A, SfpLabel.B].every((label) => isLessThan(condition.rates[label], rates[label]));
        }
    }
}

export const areConditionsFulfilled = (rates: IRxRates, conditions: IRateCondition[]): boolean =>
    conditions.every((condition) => isConditionFulfilled(rates, condition));

export const makeCaptureCompletePredicate = (captureId: string) => (data: any): ICaptureJob | undefined => {
    if (data.collection !== Collections.captureJobs) {
        return undefined;
    }
    const updated = data.updated || [];
    const job = updated.find((u: ICaptureJob) => u.id === captureId);
    if (!job) {
        return undefined;
    }
    if (job.state === CaptureJobStates.Completed || job.state === CaptureJobStates.Failed) {
        return job;
    }
    return undefined;
};

export const makeSfpRatePredicate = (conditions: IRateCondition[]) => (
    data: IFullGeneratorStatus
): IRxRates | undefined => {
    const rates = getRxRates(data);
    if (rates !== undefined && areConditionsFulfilled(rates, conditions)) {
        return rates;
    }

    return undefined;
};
