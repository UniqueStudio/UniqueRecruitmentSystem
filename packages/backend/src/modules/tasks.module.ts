import { Module } from '@nestjs/common';

import { TasksService } from '@services/tasks.service';

@Module({
    providers: [TasksService],
})
export class TasksModule {
}
