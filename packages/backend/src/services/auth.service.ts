import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '@services/users.service';
import { verify } from '@utils/scrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async validateUser(phone: string, password: string) {
        const user = await this.usersService.findIdentityByPhone(phone);
        if (user) {
            const {
                password: { hash, salt },
                id,
            } = user;
            if (await verify(hash, salt, password)) {
                return id;
            }
        }
        return;
    }

    async generateToken(id: string) {
        return await this.jwtService.signAsync({ id });
    }

    async validateToken(token: string) {
        try {
            const { id } = await this.jwtService.verifyAsync<{ id: string }>(token);
            return await this.usersService.findOneById(id);
        } catch {}
        return;
    }
}
