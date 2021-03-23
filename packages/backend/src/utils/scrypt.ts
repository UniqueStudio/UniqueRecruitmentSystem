import { randomBytes, scrypt } from 'crypto';

interface ScryptResult {
    salt: string;
    hash: string;
}

export const hash = async (password: string) => {
    return new Promise<ScryptResult>((resolve, reject) => {
        const salt = randomBytes(16).toString('hex');

        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            return resolve({
                salt,
                hash: derivedKey.toString('hex'),
            });
        });
    });
};

export const verify = async (hash: string, salt: string, password: string) => {
    return new Promise<boolean>((resolve, reject) => {
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            return resolve(derivedKey.toString('hex') === hash);
        });
    });
};
