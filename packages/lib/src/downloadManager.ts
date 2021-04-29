import { Transport } from '@bisect/bisect-core-ts';

//////////////////////////////////////////////////////////////////////////////

export default class DownloadManager {
    public constructor(private readonly transport: Transport) {}

    public async downloadFile(id: string, outputLocationFile: string): Promise<any> {
        return await this.transport.downloadFile(`/api/downloadmngr/download/${id}`, outputLocationFile);
    }

    public async download(id: string): Promise<any> {
        return await this.transport.get(`/api/downloadmngr/download/${id}`);
    }
}
