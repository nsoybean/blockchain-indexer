import { Controller, Get, Query, Param } from '@nestjs/common';
import { BlockIndexer } from './block.indexer';
@Controller('')
export class IndexerController {
  constructor(private readonly blockIndexer: BlockIndexer) {}
  /**
   * APIs to expose JsonBlockchainClient methods
   */
  @Get('client/blocks/count')
  async getTotalBlocks(): Promise<any> {
    return this.blockIndexer.getBlockCount();
  }
  @Get('client/blocks/height')
  async getBlocksAtHeight(@Query('height') height: string): Promise<any> {
    return this.blockIndexer.getBlocksAtHeight(height);
  }
  @Get('client/blocks/hash')
  async getBlockByHash(@Query('hash') hash: string): Promise<any> {
    return this.blockIndexer.getBlockByHash(hash);
  }

  @Get('api/blocks/count')
  async getIndexerTotalBlocks(): Promise<any> {
    return this.blockIndexer.getIndexerBlockCount();
  }

  // TODO @shawbin: assert query param to number
  @Get('/api/blocks')
  async getIndexerBlocks(@Query('maxHeight') maxHeight: string): Promise<any> {
    return this.blockIndexer.getIndexerBlocks(maxHeight);
  }

  @Get('/api/block/height')
  async getIndexerBlockByHeight(@Query('height') height: string): Promise<any> {
    return this.blockIndexer.getIndexerBlockByHeight(height);
  }

  @Get('/api/block/hash')
  async getIndexerBlockByHash(@Query('hash') hash: string): Promise<any> {
    return this.blockIndexer.getIndexerBlockByHash(hash);
  }

  @Get('/api/blocks/:height/transactions')
  async getIndexerTransactionsByBlockHeight(
    @Param('height') height: string,
  ): Promise<any> {
    return this.blockIndexer.getIndexerTransactionsByBlockHeight(height);
  }
}
