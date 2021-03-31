import { randomBytes, scrypt } from 'crypto';

interface ScryptResult {
    salt: string;
    hash: string;
}

export const hash = (password: string) => new Promise<ScryptResult>((resolve, reject) => {
    const salt = randomBytes(32);
    scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) {
            return reject(err);
        }
        return resolve({
            salt: salt.toString('base64'),
            hash: derivedKey.toString('base64'),
        });
    });
});

// TODO: deprecate it in v4
export const backwardCompatibleVerify = (hash: string, salt: string, password: string) =>
    new Promise<boolean>((resolve, reject) => {
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            return resolve(derivedKey.toString() === hash);
        });
    });

export const verify = (hash: string, salt: string, password: string) => new Promise<boolean>((resolve, reject) => {
    scrypt(password, Buffer.from(salt, 'base64'), 64, (err, derivedKey) => {
        if (err) {
            return reject(err);
        }
        return resolve(derivedKey.toString('base64') === hash);
    });
});
