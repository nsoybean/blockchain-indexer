import { JsonBlockchainClient } from './providers/blockchain/JsonBlockchainClient';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block, IBlock } from './block/block.entity';
import { ConfigService } from '@nestjs/config';

/**
 * TODO: Index the blocks provided by the client and expose via RESTful endpoint
 */

@Injectable()
export class BlockIndexer implements OnApplicationBootstrap {
  private toInitDB: boolean =
    this.configService.get<string>('INIT_INDEXER') === 'true';

  constructor(
    private readonly blockchainClient: JsonBlockchainClient,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private configService: ConfigService,
  ) {}

  ////////////////////////////////////////////////////
  // proxy methods to expose blockchain client methods
  ////////////////////////////////////////////////////
  async getBlockCount(): Promise<any> {
    return this.blockchainClient.getBlockCount();
  }

  async getBlocksAtHeight(height: string): Promise<any> {
    return this.blockchainClient.getBlocksAtHeight(Number(height));
  }

  async getBlockByHash(hash: string): Promise<any> {
    return this.blockchainClient.getBlockByHash(hash);
  }

  ////////////////////////////////////////////////////
  // indexer methods to enable aggregate queries
  ////////////////////////////////////////////////////
  async getIndexerBlockCount(): Promise<any> {
    return this.countBlocks();
  }

  async getIndexerBlocks(maxHeight: string): Promise<any> {
    if (maxHeight) {
      return this.findAllByMaxHeight(Number(maxHeight));
    } else {
      return this.findAll();
    }
  }

  async getIndexerBlockByHeight(height: string): Promise<any> {
    if (!height) {
      throw new BadRequestException();
    }

    return this.findBlockByHeight(Number(height));
  }

  async getIndexerBlockByHash(hash: string): Promise<any> {
    if (!hash) {
      throw new BadRequestException();
    }

    return this.findBlockByHash(hash);
  }

  // main indexing method
  // loads block data in memory and save to database
  async onApplicationBootstrap(): Promise<void> {
    if (!this.toInitDB) {
      console.log(`[BlockIndexer][onApplicationBootstrap] indexing skipped`);
      return;
    }

    console.log(`[BlockIndexer][onApplicationBootstrap] indexing...`);
    const totalBlocks = await this.blockchainClient.getBlockCount();
    console.log(
      `[BlockIndexer][onApplicationBootstrap] Total blocks: ${totalBlocks}`,
    );

    // async call to get all blocks in-memory
    const allPromises = [];
    for (let i = 0; i < totalBlocks; i++) {
      allPromises.push(this.blockchainClient.getBlocksAtHeight(i));
    }
    const blockPromises = await Promise.all(allPromises);

    // loop over each block and persist in db
    for (const blockPromise of blockPromises) {
      for (const block of blockPromise) {
        // peek
        console.log(`🚀 indexed block(s) at height: ${block.height}`);

        // persist current block entity
        const newBlockEntity: IBlock = {
          hash: block.hash,
          height: block.height,
          data: block,
          time: new Date(block.time * 1000).toISOString(), // convert unix in seconds to db timestamp
        };

        this.blockRepository.upsert(newBlockEntity, ['hash']);

        // update 'sucessor' of prev block hash
        if (block.previousblockhash) {
          const prevBlockEntity = {
            hash: block.previousblockhash,
            verified_prev_block_of: block.hash,
          };
          this.blockRepository.upsert(prevBlockEntity, ['hash']);
        }

        // uncomment to limit number of indexin
        // if (block.height === 10) {
        //   return;
        // }
      }
    }
  }

  countBlocks(): Promise<number> {
    return this.blockRepository.count();
  }

  async findAllByMaxHeight(maxHeight: number): Promise<any> {
    const queryResults = await this.blockRepository
      .createQueryBuilder()
      .select('block.data') // col
      .from(Block, 'block') // table (alias)
      .where('block.height <= :height', { height: Number(maxHeight) })
      .getMany();

    if (queryResults.length > 0) {
      const arrayResults = queryResults.map((r) => r.data);
      return arrayResults;
    } else {
      throw new NotFoundException();
    }
  }

  async findAll(): Promise<any> {
    const queryResults = await this.blockRepository
      .createQueryBuilder()
      .select('block.data') // col
      .from(Block, 'block') // table (alias)
      .getMany();

    if (queryResults.length > 0) {
      const arrayResults = queryResults.map((r) => r.data);
      return arrayResults;
    } else {
      throw new NotFoundException();
    }
  }

  async findBlockByHeight(height: number): Promise<any> {
    const queryResults = await this.blockRepository
      .createQueryBuilder()
      .select('block.data') // col
      .from(Block, 'block') // table (alias)
      .where(
        'block.height = :height and block.verified_prev_block_of is not null',
        { height: height },
      )
      .getOne();

    if (queryResults) {
      return queryResults.data;
    } else {
      throw new NotFoundException();
    }
  }

  async findBlockByHash(hash: string): Promise<any> {
    const queryResults = await this.blockRepository
      .createQueryBuilder()
      .select('block.data') // col
      .from(Block, 'block') // table (alias)
      .where(
        'block.hash = :hash and block.verified_prev_block_of is not null',
        { hash: hash },
      )
      .getOne();

    if (queryResults) {
      return queryResults.data;
    } else {
      throw new NotFoundException();
    }
  }
}
