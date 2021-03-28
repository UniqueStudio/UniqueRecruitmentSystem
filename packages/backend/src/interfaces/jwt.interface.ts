import { Role } from '@constants/enums';

export interface JwtPayload {
    id: string;
    role: Role.candidate | Role.user;
}
