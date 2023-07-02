import { NestFactory } from '@nestjs/core';
import { IndexerModule } from './indexer.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(IndexerModule);

  const config = new DocumentBuilder()
    .setTitle('BlockChain Indexer')
    .setDescription(`Endpoints to perform aggregate query`)
    .addTag(
      'Client',
      'Client endpoints call the provided blockchain client methods directly, they are exposed simply for debugging purposes.',
    )
    .addTag(
      'Indexer',
      'API endpoints call the blockchain indexer, which enable performant aggregate queries.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
