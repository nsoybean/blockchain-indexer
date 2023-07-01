import { Controller, Get, Query } from '@nestjs/common';
import { BlockIndexer } from './block.indexer';
@Controller('blocks')
export class IndexerController {
  constructor(private readonly blockIndexer: BlockIndexer) {}
  /**
   * APIs to expose JsonBlockchainClient methods
   */
  @Get('/count')
  async getTotalBlocks(): Promise<any> {
    return this.blockIndexer.getBlockCount();
  }
  @Get('')
  async getBlocksAtHeight(@Query('height') height: string): Promise<any> {
    return this.blockIndexer.getBlocksAtHeight(height);
  }
  @Get('')
  async getBlockByHash(@Query('hash') hash: string): Promise<any> {
    return this.blockIndexer.getBlockByHash(hash);
  }
}
