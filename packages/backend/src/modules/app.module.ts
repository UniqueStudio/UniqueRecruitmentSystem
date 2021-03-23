import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { Env } from '@constants/enums';
import { AuthMiddleWare } from '@middlewares/auth';
import { helmet } from '@middlewares/helmet';
import { rateLimit } from '@middlewares/rateLimit';
import { AuthModule } from '@modules/auth.module';
import { UsersModule } from '@modules/users.module';
import { AppConfigService } from '@services/config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid(Env.dev, Env.prod).default(Env.dev),
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
})
export class AppModule implements NestModule {
    constructor(private configService: AppConfigService) {}

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(
                rateLimit(60000, 2048),
                helmet({
                    contentSecurityPolicy: this.configService.isDev ? false : undefined,
                }),
                AuthMiddleWare
            )
            .forRoutes('*');
    }
}
