import { randomBytes, scryptSync } from 'crypto';

import { UserRepo } from '@database/model';
import { isDev } from '@utils/environment';

// dev-only backdoor
export const backdoor = async () => {
    if (isDev) {
        if (!await UserRepo.count({ weChatID: 'foo' })) {
            const salt = randomBytes(16).toString('base64');
            const hash = scryptSync('P@ssw0rd', salt, 64).toString();
            await UserRepo.createAndInsert({
                weChatID: 'foo',
                username: 'w1nd3r1c4',
                joinTime: '2020C',
                phone: '19876543210',
                avatar: '',
                mail: 'foo@bar.com',
                isCaptain: true,
                isAdmin: true,
                gender: 0,
                group: 'web',
                password: {
                    salt,
                    hash,
                },
            });
        }
    }
};
