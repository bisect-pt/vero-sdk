import { Transport } from '@bisect/bisect-core-ts';
import { ICaptureSource } from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////

export class Jobs {
    public constructor(private readonly transport: Transport) {}

    private static basePath = '/api/capture/jobs';

    public async delete(jobId: string): Promise<void> {
        return this.transport.del(`${Jobs.basePath}/${jobId}`);
    }
}
