import { Test } from '@nestjs/testing';

import { Gender, Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { AppModule } from '@modules/app.module';
import { CandidatesService } from '@services/candidates.service';
import { CommentsService } from '@services/comments.service';
import { InterviewsService } from '@services/interviews.service';
import { RecruitmentsService } from '@services/recruitments.service';
import { UsersService } from '@services/users.service';

describe('UsersService', () => {
    let usersService: UsersService;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
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
    });

    const password = 'P@ssw0rd';

    let testUser: UserEntity;

    describe('create legal user', () => {
        it('should succeed', async () => {
            testUser = await usersService.hashPasswordAndCreate({
                weChatID: 'rika',
                name: 'rika',
                joinTime: '2020C',
                phone: '19876543210',
                mail: 'rika@hinami.zawa',
                gender: Gender.female,
                group: Group.web,
            }, password);
            expect(testUser).toBeDefined();
        });
    });

    describe('find by phone and return id and password', () => {
        it('should return an object with password', async () => {
            const user = await usersService.findIdentityByPhone('19876543210');
            expect(user?.password).toHaveProperty('salt');
            expect(user?.password).toHaveProperty('hash');
        });
    });

    describe('find by id and return data without password', () => {
        it('should return an object without password', async () => {
            const user = await usersService.findOneById(testUser.id);
            expect(user.password).toBeUndefined();
        });
    });

    describe('create user which violates table constraints', () => {
        it('should fail', async () => {
            await expect(async () => {
                await usersService.hashPasswordAndCreate({
                    weChatID: 'rika',
                    name: 'rikaWithNonUniqueFields',
                    joinTime: '2020C',
                    phone: '19876543210',
                    mail: 'rika@hinami.zawa',
                    gender: Gender.female,
                    group: Group.web,
                }, password);
            }).rejects.toThrow(/violates unique constraint/);
        });
    });

    describe('create user which has invalid fields', () => {
        it('should fail', async () => {
            await expect(async () => {
                await usersService.hashPasswordAndCreate({
                    weChatID: 'rika',
                    name: 'rika',
                    joinTime: 'rika',
                    phone: 'invalid',
                    mail: 'invalid',
                    gender: 0.5,
                    group: -1 as unknown as Group,
                }, password);
            }).rejects.toThrow();
        });
    });

    afterAll(async () => {
        await usersService.clear();
    });
});
