import * as types from './types';
import { Transport } from './transport';

//////////////////////////////////////////////////////////////////////////////

export class License {
    public constructor(private readonly transport: Transport) {}

    public async upload(path: string): Promise<void> {
        return this.transport.putFile('/license/upload', path, 'file');
    }
}
