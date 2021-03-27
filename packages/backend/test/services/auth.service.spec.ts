import { Test } from '@nestjs/testing';

import { Gender, Group, Role } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { AuthService } from '@services/auth.service';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('AuthService', () => {
    let usersService: UsersService;
    let authService: AuthService;
    let testUser: UserEntity;

    const password = 'P@ssw0rd';
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        authService = module.get(AuthService);
        usersService = module.get(UsersService);
        const recruitmentsService = module.get(RecruitmentsService);
        const candidatesService = module.get(CandidatesService);
        const interviewsService = module.get(InterviewsService);
        const commentsService = module.get(CommentsService);
        await commentsService.clear();
        await candidatesService.clear();
        await interviewsService.clear();
        await recruitmentsService.clear();
        await usersService.clear();
        testUser = await usersService.hashPasswordAndCreate({
            weChatID: 'hanyuu',
            name: 'hanyuu',
            joinTime: '2020C',
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
            const token = await authService.generateToken(testUser.id, Role.user);
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

    afterAll(async () => {
        await usersService.clear();
    });
});
