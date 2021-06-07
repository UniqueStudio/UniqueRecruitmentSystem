import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Role } from '@constants/enums';
import { UserEntity } from '@entities/user.entity';
import { JwtPayload } from '@interfaces/jwt.interface';
import { CandidatesService } from '@services/candidates.service';
import { MembersService } from '@services/members.service';
import { backwardCompatibleVerify, verify } from '@utils/scrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly membersService: MembersService,
        private readonly candidatesService: CandidatesService,
        private readonly jwtService: JwtService,
    ) {}

    async validateMember(phone: string, password: string) {
        return this.validateUser(await this.membersService.findByPhoneWithPassword(phone), password);
    }

    async validateCandidate(phone: string, password: string) {
        return this.validateUser(await this.candidatesService.findByPhoneWithPassword(phone), password);
    }

    private async validateUser(user: UserEntity | undefined, password: string) {
        if (!user) {
            return;
        }
        const {
            id,
            password: { hash, salt },
        } = user;
        if (Buffer.from(salt, 'base64').length === 16) {
            if (await backwardCompatibleVerify(Buffer.from(hash, 'base64').toString(), salt, password)) {
                user.password = await this.membersService.hashPassword(password);
                await user.save();
                return id;
            }
        } else if (await verify(hash, salt, password)) {
            return id;
        }
        return;
    }

    async generateToken(id: string, role: Role.member | Role.candidate) {
        return await this.jwtService.signAsync({ id, role } as JwtPayload);
    }

    async validateToken(token: string) {
        try {
            const { id, role } = await this.jwtService.verifyAsync<JwtPayload>(token);
            switch (role) {
                case Role.member:
                    return await this.membersService.findOneById(id);
                case Role.candidate:
                    return await this.candidatesService.findOneById(id);
            }
        } catch {
            return;
        }
    }
}
