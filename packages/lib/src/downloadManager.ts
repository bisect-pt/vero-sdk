import { Transport } from '@bisect/bisect-core-ts';
import fs from 'fs';

//////////////////////////////////////////////////////////////////////////////

export default class DownloadManager {
    public constructor(private readonly transport: Transport) {}

    public async downloadFile(id: string, outputLocationFile: string): Promise<any> {
        const outputStream = fs.createWriteStream(outputLocationFile);
        return await this.transport.downloadFile(`/api/downloadmngr/download/${id}`, outputStream);
    }

    public async download(id: string): Promise<any> {
        return await this.transport.get(`/api/downloadmngr/download/${id}`);
    }
}
