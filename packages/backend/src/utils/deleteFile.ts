import fs from 'fs';
import { promisify } from 'util';
const unlink = promisify(fs.unlink);

export const deleteFile = async (filename: string) => {
    if (filename && fs.existsSync(filename)) {
        await unlink(filename);
    }
};
