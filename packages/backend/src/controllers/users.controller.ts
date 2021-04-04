import { BadRequestException, Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { Role } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import { SetUserInfoBody } from '@dtos/user.dto';
import { UserEntity } from '@entities/user.entity';
import { UsersService } from '@services/users.service';

@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    @Get('me')
    @AcceptRole(Role.user)
    getMyInfo(@User() user: UserEntity) {
        return user;
    }

    @Put('me')
    @AcceptRole(Role.user)
    async setMyInfo(
        @User() user: UserEntity,
        @Body() { phone, password, mail }: SetUserInfoBody,
    ) {
        if (password) {
            user.password = await this.usersService.hashPassword(password);
        }
        user.phone = phone;
        user.mail = mail;
        await user.save();
    }

    @Get('group')
    @AcceptRole(Role.user)
    getMyGroup(@User() user: UserEntity) {
        return this.usersService.findInGroup(user.group);
    }

    @Put('admin')
    @AcceptRole(Role.admin)
    async setAdmin(@Body() body: string[], @User() user: UserEntity) {
        const { group } = user;
        const uids = new Set(body);
        const newAdmins = (await this.usersService.findInGroup(group)).filter(({ id }) => uids.has(id));

        if (newAdmins.length !== uids.size) {
            throw new BadRequestException('Not all of the requested users are in the group');
        }
        await this.usersService.update(
            [...uids],
            { isAdmin: true },
        );
        return [...uids];
    }
}
