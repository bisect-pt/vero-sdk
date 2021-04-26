import { Transport } from '@bisect/bisect-core-ts';
import { ICaptureSource } from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////

export class Sources {
    public constructor(private readonly transport: Transport) {}

    private static basePath = '/api/capture';

    public async create(source: ICaptureSource): Promise<string> {
        return this.transport.post(Sources.basePath, source);
    }

    public async get(id: string): Promise<ICaptureSource> {
        return this.transport.get(`${Sources.basePath}/${id}`);
    }

    public async update(source: ICaptureSource): Promise<ICaptureSource> {
        return this.transport.put(`${Sources.basePath}/${source.id}`, source);
    }

    public async delete(id: string): Promise<void> {
        return this.transport.del(`${Sources.basePath}/${id}`);
    }
}
