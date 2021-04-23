import { ISenderMulticastAddresses } from './generator';
import { IGenlockSettings } from './genlock';
import { INmosSettings } from './nmos';
import { IPtpSettings } from './ptp';
import { IManagementInterfaceSettings, ISfpInterfaceSettings } from './interfaces';
import { IIgmpSettings } from './igmp';

export interface ISettings {
    sendernetwork: ISenderMulticastAddresses;
    genlock: IGenlockSettings;
    nmos: INmosSettings;
    ptp: IPtpSettings;
    sfps: Array<ISfpInterfaceSettings>;
    mgmt: Array<IManagementInterfaceSettings>;
    igmp: IIgmpSettings;
}
