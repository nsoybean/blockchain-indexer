import { Controller, Get, Query, Param } from '@nestjs/common';
import { BlockIndexer } from './block.indexer';
import { ApiTags } from '@nestjs/swagger';
@Controller('')
export class IndexerController {
  constructor(private readonly blockIndexer: BlockIndexer) {}
  /**
   * APIs to expose JsonBlockchainClient methods
   */
  @ApiTags('Client')
  @Get('client/blocks/count')
  async getTotalBlocks(): Promise<any> {
    return this.blockIndexer.getBlockCount();
  }
  @ApiTags('Client')
  @Get('client/blocks/height')
  async getBlocksAtHeight(@Query('height') height: string): Promise<any> {
    return this.blockIndexer.getBlocksAtHeight(height);
  }
  @ApiTags('Client')
  @Get('client/blocks/hash')
  async getBlockByHash(@Query('hash') hash: string): Promise<any> {
    return this.blockIndexer.getBlockByHash(hash);
  }

  /**
   * APIs to perform aggregate query
   */
  @ApiTags('Indexer')
  @Get('api/blocks/count')
  async getIndexerTotalBlocks(): Promise<any> {
    return this.blockIndexer.getIndexerBlockCount();
  }

  @ApiTags('Indexer')
  @Get('/api/blocks')
  // TODO @shawbin: assert query param to number
  async getIndexerBlocks(@Query('maxHeight') maxHeight: string): Promise<any> {
    return this.blockIndexer.getIndexerBlocks(maxHeight);
  }

  @ApiTags('Indexer')
  @Get('/api/block/height')
  async getIndexerBlockByHeight(@Query('height') height: string): Promise<any> {
    return this.blockIndexer.getIndexerBlockByHeight(height);
  }

  @ApiTags('Indexer')
  @Get('/api/block/hash')
  async getIndexerBlockByHash(@Query('hash') hash: string): Promise<any> {
    return this.blockIndexer.getIndexerBlockByHash(hash);
  }

  @ApiTags('Indexer')
  @Get('/api/blocks/:height/transactions')
  async getIndexerTransactionsByBlockHeight(
    @Param('height') height: string,
  ): Promise<any> {
    return this.blockIndexer.getIndexerTransactionsByBlockHeight(height);
  }

  @ApiTags('Indexer')
  @Get('/api/addresses/:address/transactions')
  async getIndexerTransactionsByAddress(
    @Param('address') address: string,
  ): Promise<any> {
    return this.blockIndexer.getIndexerTransactionsByAddress(address);
  }
}
