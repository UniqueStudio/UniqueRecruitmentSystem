import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@modules/app.module';

const config = new DocumentBuilder().setVersion('3.0').build();

void (async () => {
    const app = await NestFactory.create(AppModule, { cors: true });
    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
    await app.listen(app.get(ConfigService).get('PORT')!);
})();
