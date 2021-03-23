import { Test } from '@nestjs/testing';

import { Gender, Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { metadata } from '@modules/app.module';
import { AuthService } from '@services/auth.service';
import { UsersService } from '@services/users.service';

describe('AuthService', () => {
    let usersService: UsersService;
    let authService: AuthService;
    let testUser: UserEntity;

    const password = 'P@ssw0rd';
    beforeAll(async () => {
        const module = await Test.createTestingModule(metadata).compile();
        usersService = module.get<UsersService>(UsersService);
        authService = module.get<AuthService>(AuthService);
        await usersService.clear();
        testUser = await usersService.hashPasswordAndCreate({
            weChatID: 'hanyuu',
            name: 'hanyuu',
            joinTime: 'hanyuu',
            phone: '19876543211',
            mail: 'hanyuu@hinami.zawa',
            gender: Gender.female,
            group: Group.web,
        }, password);
    });

    describe('validate legal user', () => {
        it('should return jwt', async () => {
            expect(await authService.validateUser(testUser.phone, password)).toBe(testUser.id);
        });
    });

    describe('validate illegal user', () => {
        it('should return undefined', async () => {
            expect(await authService.validateUser('fakePhone', password)).toBeUndefined();
            expect(await authService.validateUser(testUser.phone, 'fakePassword')).toBeUndefined();
        });
    });

    describe('verify generated token', () => {
        it('should return the same user', async () => {
            const token = await authService.generateToken(testUser.id);
            const user = await authService.validateToken(token);
            expect(user?.id).toBe(testUser.id);
        });
    });

    describe('verify fake token', () => {
        it('should return undefined', async () => {
            const user = await authService.validateToken('fakeToken');
            expect(user).toBeUndefined();
        });
    });
});
