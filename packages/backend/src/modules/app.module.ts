import { promises } from 'fs';

import { MiddlewareConsumer, Module, NestModule, OnModuleInit, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { Env } from '@constants/enums';
import { HttpErrorFilter } from '@filters/httpError.filter';
import { HttpRoleGuard } from '@guards/role.guard';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { HttpAuthMiddleware } from '@middlewares/auth';
import { helmet } from '@middlewares/helmet';
import { ApplicationsModule } from '@modules/applications.module';
import { AuthModule } from '@modules/auth.module';
import { CacheModule } from '@modules/cache.module';
import { CandidatesModule } from '@modules/candidates.module';
import { ChatModule } from '@modules/chat.module';
import { CommentsModule } from '@modules/comments.module';
import { ConfigModule } from '@modules/config.module';
import { EmailModule } from '@modules/email.module';
import { MembersModule } from '@modules/members.module';
import { RecruitmentsModule } from '@modules/recruitments.module';
import { SMSModule } from '@modules/sms.module';
import { TasksModule } from '@modules/tasks.module';
import { ConfigService } from '@services/config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                // app config
                NODE_ENV: Joi.string().valid(Env.dev, Env.prod, Env.test, Env.migration).default(Env.dev),
                RESUME_TEMPORARY_PATH: Joi.string().default('/tmp/resumes'),
                RESUME_PERSISTENT_PATH: Joi.string().default('./data/resumes'),
                PORT: Joi.number().default(5000),
                JWT_KEY: Joi.string().required(),
                // db config
                POSTGRES_HOST: Joi.string().default('postgres'),
                POSTGRES_PORT: Joi.number().default(5432),
                POSTGRES_PORT_TEST: Joi.number().default(2345),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_PASSWORD: Joi.string().required(),
                POSTGRES_DB: Joi.string().required(),
                // ali config
                ACM_SECRET_KEY: Joi.string().required(),
                ACM_ACCESS_KEY: Joi.string().required(),
                ACM_DATA_ID: Joi.string().required(),
                ACM_GROUP: Joi.string().required(),
                ACM_NAMESPACE: Joi.string().required(),
                // tencent config
                APP_ID: Joi.string().required(),
                AGENT_ID: Joi.string().required(),
                REDIRECT_URI: Joi.string().required(),
                CORP_SECRET: Joi.string().required(),
                // sms and email config
                SMS_API_TOKEN: Joi.string().required(),
                EMAIL_USER: Joi.string().required(),
                EMAIL_PASS: Joi.string().required(),
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => conf.postgresConfig,
        }),
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot({
            ttl: 1,
            limit: 512,
        }),
        TasksModule,
        AuthModule,
        ApplicationsModule,
        CacheModule,
        CandidatesModule,
        ChatModule,
        CommentsModule,
        SMSModule,
        RecruitmentsModule,
        MembersModule,
        EmailModule,
    ],
    providers: [
        ConfigService,
        {
            provide: APP_GUARD,
            useClass: HttpRoleGuard,
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
            useClass: HttpErrorFilter,
        },
    ],
})
export class AppModule implements NestModule, OnModuleInit {
    constructor(private readonly configService: ConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                helmet({
                    contentSecurityPolicy: this.configService.isNotProd ? false : undefined,
                }),
                HttpAuthMiddleware,
            )
            .forRoutes('*');
    }

    async onModuleInit() {
        await promises.mkdir(this.configService.resumePaths.temporary, { recursive: true });
        await promises.mkdir(this.configService.resumePaths.persistent, { recursive: true });
    }
}
