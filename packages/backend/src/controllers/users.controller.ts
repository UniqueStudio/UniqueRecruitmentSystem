import {
    BadRequestException,
    Controller,
    ForbiddenException,
    Get,
    ImATeapotException,
    InternalServerErrorException,
    Post,
    Put,
    Req,
    RequestTimeoutException,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import got from 'got';

import { ZHANG_XIAO_LONG } from '@constants/consts';
import { User } from '@decorators/user.decorator';
import { UserEntity } from '@entities/user.entity';
import { JwtAuthGuard } from '@guards/jwtAuth.guard';
import { RequestWithBody } from '@interfaces/request.interface';
import { AuthService } from '@services/auth.service';
import { AppConfigService } from '@services/config.service';
import { UsersService } from '@services/users.service';
import { parseWeChatData } from '@utils/parseWeChatData';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly configService: AppConfigService,
    ) {}

    @Get('qrCode')
    async handleQR() {
        const key = /(?<=key ?: ?")\w+/.exec(await got(this.configService.qrCodeURL).text())?.[0];
        if (!key) {
            throw new InternalServerErrorException('Failed to fetch key of QR Code');
        }
        return {
            type: 'success',
            payload: key,
        };
    }

    @Get('qrCode/:key')
    async loginViaWeChat(@Req() req: Request<{ key: string }>) {
        while (!ZHANG_XIAO_LONG.has('mother')) {
            const scanResponse = await got(this.configService.scanningURL(req.params.key)).text();
            const { status, auth_code } = JSON.parse(/{.+}/.exec(scanResponse)![0]) as Record<string, string>;
            switch (status) {
                case 'QRCODE_SCAN_SUCC': {
                    const { accessToken } = await got(this.configService.accessTokenURL).json();
                    const { userID } = await got(this.configService.uidURL(accessToken, auth_code)).json();
                    const data = parseWeChatData(await got(this.configService.userInfoURL(accessToken, userID)).json());
                    const user =
                        (await this.usersService.findOne({ weChatID: data.weChatID })) ??
                        (await this.usersService.hashPasswordAndCreate(data));
                    if (data.isCaptain !== user.isCaptain) {
                        await this.usersService.update(user.id, { isCaptain: data.isCaptain, isAdmin: data.isCaptain });
                    }
                    const token = this.authService.generateToken(user.id);
                    return {
                        type: 'success',
                        payload: token,
                    };
                }
                case 'QRCODE_SCAN_NEVER':
                case 'QRCODE_SCAN_ING':
                    continue;
                case 'QRCODE_SCAN_FAIL':
                    throw new UnauthorizedException('User canceled, please login again');
                case 'QRCODE_SCAN_ERR':
                    throw new RequestTimeoutException('Time out, please login again');
                default:
                    throw new InternalServerErrorException(`Unknown error ${status}`);
            }
        }
        throw new ImATeapotException('NO HE DOESN\'T');
    }

    @Post('login')
    async loginViaPassword(@Req() req: RequestWithBody<{ phone: string; password: string }>) {
        const { phone, password } = req.body;
        const id = await this.authService.validateUser(phone, password);
        if (!id) {
            throw new UnauthorizedException('Failed to login');
        }
        const token = this.authService.generateToken(id);
        return {
            type: 'success',
            payload: token,
        };
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getInfo(@User() user: UserEntity) {
        return user;
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    async setInfo(
        @User() user: UserEntity,
        @Req() req: RequestWithBody<{ phone: string; mail: string; password: string }>,
    ) {
        const { phone, mail, password } = req.body;
        if (password) {
            user.password = await this.usersService.hashPassword(password);
        }
        user.phone = phone;
        user.mail = mail;
        await user.save();
        return {
            type: 'success',
        };
    }

    @Get('group')
    @UseGuards(JwtAuthGuard)
    async getGroup(@User() user: UserEntity) {
        return {
            type: 'success',
            payload: await this.usersService.findInGroup(user.group),
        };
    }

    @Put('admin')
    @UseGuards(JwtAuthGuard)
    async setAdmin(@Req() req: RequestWithBody<{ who: string[] }>, @User() user: UserEntity) {
        if (!user.isAdmin && !user.isCaptain) {
            throw new ForbiddenException('User has no permission');
        }
        const { group } = user;
        const phones = new Set(req.body.who);
        const newAdmins = (await this.usersService.findInGroup(group)).filter(({ phone }) => phones.has(phone));

        if (newAdmins.length !== phones.size) {
            throw new BadRequestException('Not all of the requested users are in the group');
        }
        await this.usersService.update(
            newAdmins.map(({ id }) => id),
            { isAdmin: true },
        );
        return {
            type: 'success',
            payload: [...phones],
        };
    }
}
