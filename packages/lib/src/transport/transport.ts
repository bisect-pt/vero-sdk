import { IPutEntry, UploadProgressCallback } from './common';
import { RestClient } from './restClient';

export class Transport {
    public constructor(public readonly rest: RestClient) {}

    public async get(endpoint: string) {
        return this.rest.get(endpoint);
    }

    public async getText(endpoint: string) {
        return this.rest.getText(endpoint);
    }

    public async post(endpoint: string, data: object) {
        return this.rest.post(endpoint, data);
    }

    public async putForm(endpoint: string, entries: IPutEntry[], callback: UploadProgressCallback): Promise<any> {
        return this.rest.putForm(endpoint, entries, callback);
    }

    public async del(endpoint: string) {
        return this.rest.del(endpoint);
    }
}
