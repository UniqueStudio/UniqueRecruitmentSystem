import { SetMetadata } from '@nestjs/common';

import { Role } from '@constants/enums';

export const AcceptRole = (role: Role) => SetMetadata('role', role);
