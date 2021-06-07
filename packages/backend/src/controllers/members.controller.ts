import { BadRequestException, Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import { Role } from '@constants/enums';
import { Msg } from '@constants/messages';
import { Member } from '@decorators/member.decorator';
import { AcceptRole } from '@decorators/role.decorator';
import { SetAdminsBody, SetMemberInfoBody } from '@dtos/member.dto';
import { MemberEntity } from '@entities/member.entity';
import { MembersService } from '@services/members.service';

@Controller('members')
@UseGuards(ThrottlerGuard)
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @Get('me')
    @AcceptRole(Role.member)
    getMyInfo(@Member() member: MemberEntity) {
        return member;
    }

    @Put('me')
    @AcceptRole(Role.member)
    async setMyInfo(@Member() member: MemberEntity, @Body() { phone, password, mail }: SetMemberInfoBody) {
        if (password) {
            member.password = await this.membersService.hashPassword(password);
        }
        member.phone = phone;
        member.mail = mail;
        await member.save();
    }

    @Get('group')
    @AcceptRole(Role.member)
    getMyGroup(@Member() member: MemberEntity) {
        return this.membersService.findInGroup(member.group);
    }

    @Put('admin')
    @AcceptRole(Role.admin)
    async setAdmin(@Body() { mids }: SetAdminsBody, @Member() member: MemberEntity) {
        const { group } = member;
        const ids = new Set(mids);
        const newAdmins = (await this.membersService.findInGroup(group)).filter(({ id }) => ids.has(id));

        if (newAdmins.length !== ids.size) {
            throw new BadRequestException(Msg.M_HAS_OTHERS);
        }
        await this.membersService.update([...ids], { isAdmin: true });
        return [...ids];
    }
}
