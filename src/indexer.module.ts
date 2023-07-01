import { Module } from '@nestjs/common';
import { resolve, join } from 'path';
import { IndexerController } from './indexer.controller';
import {
  JSON_BLOCKS,
  JsonBlockchainClient,
} from './providers/blockchain/JsonBlockchainClient';
import { BlockIndexer } from './block.indexer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [],
      synchronize: true, // TypeORM will automatically generate database tables based on the entities
      autoLoadEntities: true,
    }),
  ],
  controllers: [IndexerController],
  providers: [
    BlockIndexer,

    // To keep this assignment simple, we'll provide the JsonBlockchainClient
    // and the path to the 200.json here.
    // In the real world, we'll probably provide an actual blockchain client connector
    // and required configs via ConfigModule.
    JsonBlockchainClient,
    {
      provide: JSON_BLOCKS,
      useValue: resolve(join(__dirname, '..', 'test', 'resources', '200.json')),
    },
  ],
})
export class IndexerModule {}
