import fs from "fs";

export const deleteFile = (filename: string) => {
    filename && fs.unlink(filename, err => {
        if (err) throw err;
    });
};
