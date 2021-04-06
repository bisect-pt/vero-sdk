import { Transport} from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export class License {
    public constructor(private readonly transport: Transport) {}

    public async upload(path: string): Promise<void> {
        return this.transport.putForm('/api/license/upload',[
            { name: 'file', value: path }]);
    }
}
