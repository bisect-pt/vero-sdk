import { Transport } from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export default class Eula {
    public constructor(private readonly transport: Transport) {}

    public async get(): Promise<any> {
        return await this.transport.get('/api/eula');
    }

    public async accept(): Promise<any> {
        return this.transport.post('/api/eula', {});
    }
}
