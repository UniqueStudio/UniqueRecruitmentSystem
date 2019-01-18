import { Request } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '/tmp/resumes'),
    filename: (req: Request, file, cb) => {
        const filename = `${Date.now()} - ${file.originalname}`;
        cb(null, filename);
    }
});
export const fileHandler = multer({
    storage,
    limits: {
        fileSize: 104857600  // 100MB
    }
});
