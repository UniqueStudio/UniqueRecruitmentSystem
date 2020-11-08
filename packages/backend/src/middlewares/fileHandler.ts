import multer, { diskStorage } from 'multer';

const storage = diskStorage({
    destination: (req, file, cb) => cb(null, '/tmp/resumes'),
    filename: (req, file, cb) => {
        const filename = `${Date.now()} - ${file.originalname}`;
        cb(null, filename);
    },
});

export const fileHandler = multer({
    storage,
    limits: {
        fileSize: 104857600,  // 100MB
    },
});
