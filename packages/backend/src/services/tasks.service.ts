import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ConfigService } from '@services/config.service';
import { deleteFile, listDir } from '@utils/fs';

@Injectable()
export class TasksService {
    constructor(
        private readonly configService: ConfigService,
    ) {
    }

    @Cron(CronExpression.EVERY_DAY_AT_4AM)
    async cleanTemps() {
        const directory = this.configService.resumePaths.temporary;
        for (const file of await listDir(directory)) {
            await deleteFile(directory, file);
        }
    }
}
