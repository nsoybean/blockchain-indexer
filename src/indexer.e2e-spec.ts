import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IndexerModule } from './indexer.module';
let app: INestApplication;
import * as e2e_001_data from '../test/resources/e2e_001.json';

describe('Indexer e2e', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IndexerModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // instantiate full nest runtime env
    await app.init();

    console.log('🚀 waiting...');

    await new Promise((r) => setTimeout(r, 5000));
  });

  it('should get 201 total blocks (raw)', () => {
    return request(app.getHttpServer())
      .get('/api/blocks/count')
      .expect(200)
      .expect('201');
  });

  it('should get two specific block. testID: e2e_001', () => {
    return request(app.getHttpServer())
      .get('/api/blocks?maxHeight=2')
      .expect(200)
      .expect(e2e_001_data);
  });

  it("should get 'FORKEDBLOCK' block at height 198. testID: e2e_002", async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/block/height?height=198',
    );
    expect(response.body).toHaveProperty(
      'hash',
      'ef61aaf7f6f742ed825922b10ec504ee74cfcb9c71037706dd8a8FORKEDBLOCK',
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
