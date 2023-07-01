import { JsonBlockchainClient } from './providers/blockchain/JsonBlockchainClient';
import { Injectable } from '@nestjs/common';

/**
 * TODO: Index the blocks provided by the client and expose via RESTful endpoint
 */

@Injectable()
export class BlockIndexer {
  constructor(private readonly blockchainClient: JsonBlockchainClient) {}

  async getBlockCount(): Promise<any> {
    return this.blockchainClient.getBlockCount();
  }

  async getBlocksAtHeight(height: string): Promise<any> {
    return this.blockchainClient.getBlocksAtHeight(Number(height));
  }

  async getBlockByHash(hash: string): Promise<any> {
    return this.blockchainClient.getBlockByHash(hash);
  }
}
