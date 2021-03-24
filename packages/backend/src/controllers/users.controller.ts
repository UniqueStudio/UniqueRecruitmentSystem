import { BadRequestException, Body, Controller, Get, Put } from '@nestjs/common';

import { Role } from '@constants/enums';
import { AcceptRole } from '@decorators/role.decorator';
import { User } from '@decorators/user.decorator';
import { SetUserInfoDto } from '@dtos/user.dto';
import { UserEntity } from '@entities/user.entity';
import { UsersService } from '@services/users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {
    }

    @Get()
    @AcceptRole(Role.user)
    getInfo(@User() user: UserEntity) {
        return user;
    }

    @Put()
    @AcceptRole(Role.user)
    async setInfo(
        @User() user: UserEntity,
        @Body() { phone, password, mail }: SetUserInfoDto,
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
    async getGroup(@User() user: UserEntity) {
        return await this.usersService.findInGroup(user.group);
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
