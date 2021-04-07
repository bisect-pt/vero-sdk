import { VERO } from '../../../../lib/dist';
import { IArgs } from '../../types';

export const run = async (args: IArgs) => {
    const vero = new VERO(args.baseUrl);
    await vero.login(args.username, args.password);
    try {
        console.log('Connected');
        const version = await vero.system.getVersion();
        console.log(JSON.stringify(version));
    } catch (e) {
        console.log(`Error: ${JSON.stringify(e)}`);
    } finally {
        await vero.close();
    }
};
