import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from '@controllers/users.controller';
import { UserEntity } from '@entities/user.entity';
import { AuthModule } from '@modules/auth.module';
import { UsersService } from '@services/users.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), forwardRef(() => AuthModule)],
    providers: [UsersController, UsersService],
    exports: [UsersService],
})
export class UsersModule {}
