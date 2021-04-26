import { SfpLabel } from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////

export interface IRxRates {
    [SfpLabel.A]: number;
    [SfpLabel.B]: number;
}

export interface IRateCondition {
    kind: 'lessThan' | 'moreThan';
    rates: Partial<IRxRates>;
}
