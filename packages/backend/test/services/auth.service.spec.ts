import { INestApplication } from '@nestjs/common';

import { Gender, Group, Role } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { AuthService } from '@services/auth.service';
import { MembersService } from '@services/members.service';
import { init } from '@test/utils/init';

describe('AuthService', () => {
    let app: INestApplication;
    let membersService: MembersService;
    let authService: AuthService;
    let testUser: UserEntity;

    const password = 'P@ssw0rd';
    beforeAll(async () => {
        const services = await init();
        ({ app, membersService, authService } = services);
        testUser = await membersService.hashPasswordAndCreate(
            {
                weChatID: 'hanyuu',
                name: 'hanyuu',
                joinTime: '2020C',
                phone: '19876543211',
                mail: 'hanyuu@hinami.zawa',
                gender: Gender.female,
                group: Group.web,
            },
            password,
        );
    });

    describe('validate legal user', () => {
        it('should return jwt', async () => {
            expect(await authService.validateMember(testUser.phone, password)).toBe(testUser.id);
        });
    });

    describe('validate illegal user', () => {
        it('should return undefined', async () => {
            expect(await authService.validateMember('fakePhone', password)).toBeUndefined();
            expect(await authService.validateMember(testUser.phone, 'fakePassword')).toBeUndefined();
        });
    });

    describe('verify generated token', () => {
        it('should return the same user', async () => {
            const token = await authService.generateToken(testUser.id, Role.member);
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

    afterAll(() => app.close());
});
