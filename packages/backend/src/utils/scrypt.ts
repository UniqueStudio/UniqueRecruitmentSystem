import { randomBytes, scrypt } from 'crypto';

interface ScryptResult {
    salt: string;
    hash: string;
}

export const hash = async (password: string) => {
    return new Promise<ScryptResult>((resolve, reject) => {
        /*
         * As the matter of fact, if `salt` is base64-encoded before it's passed to `scrypt`,
         * `scrypt` will treat it as a (UTF-8) string and convert it to a buffer whose length is longer than 16.
         * It works, although not as intended.
         * The correct implementation is:
         * ```js
         * // hash
         * const salt = randomBytes(16);
         * scrypt(password, salt, 64, (err, derivedKey) => {
         *     // ...
         *     return resolve({
         *         salt: salt.toString('base64');
         *         hash: derivedKey.toString('base64'),
         *     });
         * }
         * // verify
         * scrypt(password, Buffer.from(salt, 'base64'), 64, (err, derivedKey) => {
         *     // ...
         * }
         * ```
         * For backward compatibility, we have to adapt to the mistake.
         */
        const salt = randomBytes(16).toString('base64');

        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
                return reject(err);
            }
            return resolve({
                salt,
                hash: derivedKey.toString('base64'),
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
            return resolve(derivedKey.toString('base64') === hash);
        });
    });
};
