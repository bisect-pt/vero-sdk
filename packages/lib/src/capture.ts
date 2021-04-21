import { Transport } from '@bisect/bisect-core-ts';
import veroApi, { SocketEvents, Collections, CaptureJobStates } from '@mipw/vero-api';

//////////////////////////////////////////////////////////////////////////////
export default class Capture {
    public constructor(private readonly transport: Transport) {}

    public async start(settings: veroApi.ICaptureSettings): Promise<any> {
        return this.transport.post('/api/capture/capture', settings);
    }

    // Returns the capture job or or undefined in case of timeout
    public makeCaptureAwaiter(captureId: string, timeoutMs: number): Promise<veroApi.ICaptureJob | undefined> {
        return this.transport.makeAwaiter(
            SocketEvents.collectionUpdate,
            (data: any) => {
                if (data.collection !== Collections.captureJobs) {
                    return false;
                }
                const updated = data.updated || [];
                const job = updated.find((u: veroApi.ICaptureJob) => u.id === captureId);
                if (!job) {
                    return false;
                }
                if (job.state === CaptureJobStates.Completed || job.state === CaptureJobStates.Failed) {
                    return job;
                }
                return false;
            },
            timeoutMs
        );
    }
}
