import { ISenderMulticastAddresses } from './generator';
import { IGenlockSettings } from './genlock';
import { INmosSettings } from './nmos';
import { IPtpSettings } from './ptp';
import { INtpSettings } from './ntp';
import { IManagementInterfaceSettings, ISfpInterfaceSettings } from './interfaces';
import { IIGMPSettings } from './igmp';

export interface ISystemSettings {
    ptp: IPtpSettings;
    sfps: ISfpInterfaceSettings[];
    genlock: IGenlockSettings;
    igmp: IIGMPSettings;
}

export interface ISettings extends ISystemSettings {
    sendernetwork: ISenderMulticastAddresses;
    nmos: INmosSettings;
    ntp: INtpSettings;
    mgmt: IManagementInterfaceSettings[];
}
