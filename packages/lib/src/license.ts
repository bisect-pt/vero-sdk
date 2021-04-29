import { Transport } from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export class License {
    public constructor(private readonly transport: Transport) {}

    public async upload(value: any): Promise<void> {
        return this.transport.putForm('/api/license/upload', [{ name: 'file', value: value }]);
    }

    public async get(): Promise<any> {
        return this.transport.get('/api/license/info');
    }

    public async export(outputLocationFile: string): Promise<any> {
        return this.transport.downloadFile('/api/license/export', outputLocationFile);
    }
}
