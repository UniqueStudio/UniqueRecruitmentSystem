import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MembersController } from '@controllers/members.controller';
import { MemberEntity } from '@entities/member.entity';
import { MembersService } from '@services/members.service';

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity])],
    controllers: [MembersController],
    providers: [MembersService],
    exports: [MembersService],
})
export class MembersModule {}
