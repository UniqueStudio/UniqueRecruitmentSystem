import {
    Body,
    Controller,
    Get,
    ImATeapotException,
    InternalServerErrorException,
    Param,
    Post,
    RequestTimeoutException,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import got from 'got';

import { ZHANG_XIAO_LONG } from '@constants/consts';
import { Role } from '@constants/enums';
import { Msg } from '@constants/messages';
import { AuthByPasswordBody, AuthMemberByQRCodeParams } from '@dtos/auth.dto';
import { AuthService } from '@services/auth.service';
import { ConfigService } from '@services/config.service';
import { MembersService } from '@services/members.service';
import { parseWeChatData } from '@utils/parseWeChatData';

@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
    constructor(
        private readonly membersService: MembersService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @Get('member/qrCode')
    async getQRCode() {
        const key = /(?<=key ?: ?")\w+/.exec(await got(this.configService.qrInitURL).text())?.[0];
        if (!key) {
            throw new InternalServerErrorException(Msg.$_FAILED('fetch QR Code'));
        }
        return this.configService.qrImgURL(key);
    }

    @Get('member/qrCode/:key')
    async authMemberByQRCode(@Param() { key }: AuthMemberByQRCodeParams) {
        type Response = Record<string, string>;
        while (!ZHANG_XIAO_LONG.has('mother')) {
            const scanResponse = await got(this.configService.scanningURL(key)).text();
            const { status, auth_code } = JSON.parse(/{.+}/.exec(scanResponse)![0]) as Response;
            switch (status) {
                case 'QRCODE_SCAN_SUCC': {
                    const { access_token: token } = await got(this.configService.accessTokenURL).json<Response>();
                    const { UserId: uid } = await got(this.configService.uidURL(token, auth_code)).json<Response>();
                    const data = parseWeChatData(await got(this.configService.userInfoURL(token, uid)).json());
                    const { id, isCaptain } = await this.membersService.findOrCreate(data);
                    if (data.isCaptain !== isCaptain) {
                        await this.membersService.update(id, { isCaptain: !isCaptain, isAdmin: !isCaptain });
                    }
                    return this.authService.generateToken(id, Role.member);
                }
                case 'QRCODE_SCAN_NEVER':
                case 'QRCODE_SCAN_ING':
                    continue;
                case 'QRCODE_SCAN_FAIL':
                    throw new UnauthorizedException(Msg.$_AGAIN('User canceled'));
                case 'QRCODE_SCAN_ERR':
                    throw new RequestTimeoutException(Msg.$_AGAIN('Time out'));
                default:
                    throw new InternalServerErrorException(Msg.$_OOPS(`unknown status ${status}`));
            }
        }
        throw new ImATeapotException(Msg.$$ONLY_MONEY_MATTERS$$);
    }

    @Post('member/login')
    async authMemberByPassword(@Body() { phone, password }: AuthByPasswordBody) {
        const id = await this.authService.validateMember(phone, password);
        if (!id) {
            throw new UnauthorizedException(Msg.$_FAILED('login'));
        }
        return this.authService.generateToken(id, Role.member);
    }

    @Post('candidate/login')
    async authCandidateByPassword(@Body() { phone, password }: AuthByPasswordBody) {
        const id = await this.authService.validateCandidate(phone, password);
        if (!id) {
            throw new UnauthorizedException(Msg.$_FAILED('login'));
        }
        return this.authService.generateToken(id, Role.candidate);
    }
}
