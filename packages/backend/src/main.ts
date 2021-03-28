import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@modules/app.module';
import { ConfigService } from '@services/config.service';
import { migrate } from '@utils/migrate';

void (async () => {
    const app = await NestFactory.create(AppModule, { cors: true });
    if (app.get(ConfigService).isMigration) {
        await migrate(app);
        await app.close();
        return;
    }
    app.setGlobalPrefix('v3');
    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, new DocumentBuilder().setVersion('3.0').build()));
    await app.listen(app.get(ConfigService).port);
})();
