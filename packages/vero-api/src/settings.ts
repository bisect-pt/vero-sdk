import { ISenderMulticastAddresses } from './generator';
import { IGenlockSettings } from './genlock';
import { INmosSettings } from './nmos';
import { IPtpSettings } from './ptp';
import { IManagementInterfaceSettings, ISfpInterfaceSettings } from './interfaces';
import { IIGMPSettings } from './igmp';

export interface ISettings {
    sendernetwork: ISenderMulticastAddresses;
    genlock: IGenlockSettings;
    nmos: INmosSettings;
    ptp: IPtpSettings;
    sfps: Array<ISfpInterfaceSettings>;
    mgmt: Array<IManagementInterfaceSettings>;
    igmp: IIGMPSettings;
}

export interface ISystemSettings {
    ptp: IPtpSettings;
    sfps: ISfpInterfaceSettings[];
    genlock: IGenlockSettings;
    igmp: IIGMPSettings;
}
