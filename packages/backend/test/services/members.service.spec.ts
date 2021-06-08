import { INestApplication } from '@nestjs/common';

import { Gender, Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { MembersService } from '@services/members.service';
import { init } from '@test/utils/init';

describe('UsersService', () => {
    let app: INestApplication;
    let membersService: MembersService;
    beforeAll(async () => {
        const services = await init();
        ({ app, membersService } = services);
    });

    const password = 'P@ssw0rd';

    let testUser: UserEntity;

    describe('create legal user', () => {
        it('should succeed', async () => {
            testUser = await membersService.hashPasswordAndCreate(
                {
                    weChatID: 'rika',
                    name: 'rika',
                    joinTime: '2020C',
                    phone: '19876543210',
                    mail: 'rika@hinami.zawa',
                    gender: Gender.female,
                    group: Group.web,
                },
                password,
            );
            expect(testUser).toBeDefined();
        });
    });

    describe('find by phone and return id and password', () => {
        it('should return an object with password', async () => {
            const user = await membersService.findByPhoneWithPassword('19876543210');
            expect(user?.password).toHaveProperty('salt');
            expect(user?.password).toHaveProperty('hash');
        });
    });

    describe('find by id and return data without password', () => {
        it('should return an object without password', async () => {
            const user = await membersService.findOneById(testUser.id);
            expect(user.password).toBeUndefined();
        });
    });

    describe('create user which violates table constraints', () => {
        it('should fail', async () => {
            await expect(async () => {
                await membersService.hashPasswordAndCreate(
                    {
                        weChatID: 'rika',
                        name: 'rikaWithNonUniqueFields',
                        joinTime: '2020C',
                        phone: '19876543210',
                        mail: 'rika@hinami.zawa',
                        gender: Gender.female,
                        group: Group.web,
                    },
                    password,
                );
            }).rejects.toThrow(/violates unique constraint/);
        });
    });

    describe('create user which has invalid fields', () => {
        it('should fail', async () => {
            await expect(async () => {
                await membersService.hashPasswordAndCreate(
                    {
                        weChatID: 'rika',
                        name: 'rika',
                        joinTime: 'rika',
                        phone: 'invalid',
                        mail: 'invalid',
                        gender: 0.5,
                        group: -1 as unknown as Group,
                    },
                    password,
                );
            }).rejects.toThrow();
        });
    });

    afterAll(() => app.close());
});
