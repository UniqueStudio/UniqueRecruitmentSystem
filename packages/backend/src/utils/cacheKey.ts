import { Role } from '@constants/enums';

export const cacheKey = (phone: string, role?: Role.member | Role.candidate) => {
    const key = role === Role.member ? 'member' : role === Role.candidate ? 'candidate' : 'other';
    return `${key}Code:${phone}`;
};
