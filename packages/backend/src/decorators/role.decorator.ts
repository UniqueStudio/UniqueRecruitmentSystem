import { SetMetadata } from '@nestjs/common';

export const AcceptRole = (role: number) => SetMetadata('role', role);
