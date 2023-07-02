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
import { Block } from './block/block.entity';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Block],
      synchronize: true, // TypeORM will automatically generate database tables based on the entities
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Block]),
  ],
  controllers: [IndexerController],
  providers: [
    // To keep this assignment simple, we'll provide the JsonBlockchainClient
    // and the path to the 200.json here.
    // In the real world, we'll probably provide an actual blockchain client connector
    // and required configs via ConfigModule.
    JsonBlockchainClient,
    {
      provide: JSON_BLOCKS,
      useValue: resolve(join(__dirname, '..', 'test', 'resources', '200.json')),
    },
    BlockIndexer,
  ],
})
export class IndexerModule {}
