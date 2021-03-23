import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { Env, Gender, Group } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { AuthModule } from '@modules/auth.module';
import { UsersModule } from '@modules/users.module';
import { AppConfigService } from '@services/config.service';
import { UsersService } from '@services/users.service';

describe('UsersService', () => {
    let usersService: UsersService;
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    validationSchema: Joi.object({
                        NODE_ENV: Joi.string().valid(Env.dev, Env.prod, Env.test).default(Env.dev),
                        PORT: Joi.number().default(5000),
                        POSTGRES_HOST: Joi.string().default('postgres'),
                        POSTGRES_PORT: Joi.number().default(5432),
                        POSTGRES_USER: Joi.string().required(),
                        POSTGRES_PASSWORD: Joi.string().required(),
                        POSTGRES_DB: Joi.string().required(),
                        JWT_KEY: Joi.string().required(),
                    }),
                }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (conf: ConfigService) => ({
                        type: 'postgres',
                        host: conf.get('POSTGRES_HOST'),
                        port: conf.get('POSTGRES_PORT'),
                        username: conf.get('POSTGRES_USER'),
                        password: conf.get('POSTGRES_PASSWORD'),
                        database: conf.get('POSTGRES_DB'),
                        synchronize: true,
                        autoLoadEntities: true,
                        useUnifiedTopology: true,
                    }),
                }),
                AuthModule,
                UsersModule,
            ],
            providers: [AppConfigService],
        }).compile();
        usersService = module.get<UsersService>(UsersService);
        await usersService.clear();
    });

    const password = 'P@ssw0rd';

    let testUser: UserEntity;

    describe('create legal user', () => {
        it('should succeed', async () => {
            testUser = await usersService.hashPasswordAndCreate({
                weChatID: 'rika',
                name: 'rika',
                joinTime: 'rika',
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
            expect(user?.password).toBeUndefined();
        });
    });

    describe('create user which violates table constraints', () => {
        it('should fail', async () => {
            await expect(async () => {
                await usersService.hashPasswordAndCreate({
                    weChatID: 'rika',
                    name: 'rikaWithNonUniqueFields',
                    joinTime: 'rika',
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
                console.log(await usersService.hashPasswordAndCreate({
                    weChatID: 'rika',
                    name: 'rika',
                    joinTime: 'rika',
                    phone: 'invalid',
                    mail: 'invalid',
                    gender: 0.5,
                    group: -1 as unknown as Group,
                }, password));
            }).rejects.toThrow(/failed the validation/);
        });
    });
});
