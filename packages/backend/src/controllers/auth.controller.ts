import {
    BadRequestException,
    Body,
    Controller,
    Get,
    ImATeapotException,
    InternalServerErrorException,
    NotImplementedException,
    Param,
    Post,
    RequestTimeoutException,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import got from 'got';

import { ZHANG_XIAO_LONG } from '@constants/consts';
import { Role } from '@constants/enums';
import { AuthByCodeBody, AuthUserByPasswordBody } from '@dtos/auth.dto';
import { CodeGuard } from '@guards/code.guard';
import { AuthService } from '@services/auth.service';
import { CandidatesService } from '@services/candidates.service';
import { ConfigService } from '@services/config.service';
import { UsersService } from '@services/users.service';
import { parseWeChatData } from '@utils/parseWeChatData';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly candidatesService: CandidatesService,
    ) {
    }

    @Get('user/qrCode')
    async getQRCode() {
        const key = /(?<=key ?: ?")\w+/.exec(await got(this.configService.qrInitURL).text())?.[0];
        if (!key) {
            throw new InternalServerErrorException('Failed to fetch key of QR Code');
        }
        return this.configService.qrImgURL(key);
    }

    @Get('user/qrCode/:key')
    async authUserByQRCode(@Param('key') key: string) {
        while (!ZHANG_XIAO_LONG.has('mother')) {
            const scanResponse = await got(this.configService.scanningURL(key)).text();
            const { status, auth_code } = JSON.parse(/{.+}/.exec(scanResponse)![0]) as Record<string, string>;
            switch (status) {
                case 'QRCODE_SCAN_SUCC': {
                    const { accessToken } = await got(this.configService.accessTokenURL).json();
                    const { userID } = await got(this.configService.uidURL(accessToken, auth_code)).json();
                    const data = parseWeChatData(await got(this.configService.userInfoURL(accessToken, userID)).json());
                    const { id, isCaptain } = await this.usersService.findOrCreate(data);
                    if (data.isCaptain !== isCaptain) {
                        await this.usersService.update(id, { isCaptain: !isCaptain, isAdmin: !isCaptain });
                    }
                    return this.authService.generateToken(id, Role.user);
                }
                case 'QRCODE_SCAN_NEVER':
                case 'QRCODE_SCAN_ING':
                    continue;
                case 'QRCODE_SCAN_FAIL':
                    throw new UnauthorizedException('User canceled, please login again');
                case 'QRCODE_SCAN_ERR':
                    throw new RequestTimeoutException('Time out, please login again');
                default:
                    throw new InternalServerErrorException(`Unknown status ${status}`);
            }
        }
        throw new ImATeapotException('NO HE DOESN\'T');
    }

    @Post('user/login')
    async authUserByPassword(@Body() { phone, password }: AuthUserByPasswordBody) {
        const id = await this.authService.validateUser(phone, password);
        if (!id) {
            throw new UnauthorizedException('Failed to login');
        }
        return this.authService.generateToken(id, Role.user);
    }

    @Post('candidate/login')
    @UseGuards(CodeGuard)
    async authCandidateByCode(@Body() { phone }: AuthByCodeBody) {
        const candidates = await this.candidatesService.findInPendingRecruitments(phone);
        if (!candidates.length) {
            throw new BadRequestException(`Candidate with phone ${phone} doesn't exist`);
        }
        if (candidates.length > 1) {
            throw new NotImplementedException('multiple candidates in pending recruitment(s) are not supported');
        }
        const { id } = candidates[0];
        return this.authService.generateToken(id, Role.candidate);
    }
}
