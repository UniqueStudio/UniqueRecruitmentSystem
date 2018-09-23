import fs from "fs";

export const deleteFile = (filename: string) => {
    if (filename && fs.existsSync(filename)) {
        fs.unlinkSync(filename);
    }
};
