import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsController } from '@controllers/applications.controller';
import { ApplicationEntity } from '@entities/application.entity';
import { ApplicationsGateway } from '@gateways/applications.gateway';
import { AuthModule } from '@modules/auth.module';
import { EmailModule } from '@modules/email.module';
import { RecruitmentsModule } from '@modules/recruitments.module';
import { SMSModule } from '@modules/sms.module';
import { ApplicationsService } from '@services/applications.service';
import { ConfigService } from '@services/config.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ApplicationEntity]),
        MulterModule.registerAsync({
            inject: [ConfigService],
            useFactory: (conf: ConfigService) => conf.multerConfig,
        }),
        SMSModule,
        EmailModule,
        RecruitmentsModule,
        AuthModule,
    ],
    controllers: [ApplicationsController],
    providers: [ApplicationsService, ApplicationsGateway],
    exports: [ApplicationsService, ApplicationsGateway],
})
export class ApplicationsModule {}
