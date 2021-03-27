import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { Env } from '@constants/enums';
import { ErrorFilter } from '@filters/error.filter';
import { RoleGuard } from '@guards/role.guard';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { AuthMiddleWare } from '@middlewares/auth';
import { helmet } from '@middlewares/helmet';
import { rateLimit } from '@middlewares/rateLimit';
import { AuthModule } from '@modules/auth.module';
import { CacheModule } from '@modules/cache.module';
import { CandidatesModule } from '@modules/candidates.module';
import { ChatModule } from '@modules/chat.module';
import { CommentsModule } from '@modules/comments.module';
import { ConfigModule } from '@modules/config.module';
import { RecruitmentsModule } from '@modules/recruitments.module';
import { SMSModule } from '@modules/sms.module';
import { UsersModule } from '@modules/users.module';
import { ConfigService } from '@services/config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid(Env.dev, Env.prod, Env.test, Env.migration).default(Env.dev),
                RESUME_TEMPORARY_PATH: Joi.string().default('/tmp/resumes'),
                RESUME_PERSISTENT_PATH: Joi.string().default('./data/resumes'),
                PORT: Joi.number().default(5000),
                POSTGRES_HOST: Joi.string().default('postgres'),
                POSTGRES_PORT: Joi.number().default(5432),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                JWT_KEY: Joi.string().required(),
                APP_ID: Joi.string().required(),
                AGENT_ID: Joi.string().required(),
                REDIRECT_URI: Joi.string().required(),
                CORP_ID: Joi.string().required(),
                CORP_SECRET: Joi.string().required(),
                SMS_API_TOKEN: Joi.string().required(),
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
                synchronize: conf.isDev,
                autoLoadEntities: true,
            }),
        }),
        AuthModule,
        CandidatesModule,
        CacheModule,
        ChatModule,
        CommentsModule,
        SMSModule,
        RecruitmentsModule,
        UsersModule,
    ],
    providers: [
        ConfigService,
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: ErrorFilter,
        },
    ],
})
export class AppModule implements NestModule {
    constructor(private readonly configService: ConfigService) {
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                rateLimit(60000, 2048),
                helmet({
                    contentSecurityPolicy: this.configService.isDev ? false : undefined,
                }),
                AuthMiddleWare,
            )
            .forRoutes('*');
    }
}
