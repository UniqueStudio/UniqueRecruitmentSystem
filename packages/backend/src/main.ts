import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@modules/app.module';

void (async () => {
    const app = await NestFactory.create(AppModule, { cors: true });
    await app.listen(app.get(ConfigService).get('PORT')!);
})();
