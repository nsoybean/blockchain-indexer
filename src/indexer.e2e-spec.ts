import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IndexerModule } from './indexer.module';
let app: INestApplication;
import * as e2e_001_data from '../test/resources/e2e_001.json';
import * as e2e_002_data from '../test/resources/e2e_002.json';
import * as e2e_003_data from '../test/resources/e2e_003.json';
import * as e2e_004_data from '../test/resources/e2e_004.json';

describe('Indexer e2e', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [IndexerModule],
    }).compile();

    app = moduleFixture.createNestApplication(); // instantiate full nest runtime env
    await app.init();

    console.log(
      '🚀 waiting for fixed 5s for blockchain indexing to complete...',
    );
    await new Promise((r) => setTimeout(r, 5000));
  });

  it('should get 201 total blocks (raw)', () => {
    return request(app.getHttpServer())
      .get('/api/blocks/count')
      .expect(200)
      .expect('201');
  });

  it('should get two specific block. testID: e2e_001', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/blocks?maxHeight=1',
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toContainEqual(e2e_001_data[0]);
    expect(response.body).toContainEqual(e2e_001_data[1]);
  });

  it("should get 1 block of hash:'FORKEDBLOCK' at height 198", async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/block/height?height=198',
    );
    expect(response.body).toHaveProperty(
      'hash',
      'ef61aaf7f6f742ed825922b10ec504ee74cfcb9c71037706dd8a8FORKEDBLOCK',
    );
  });

  it('should get status 404 when height exceeded max height', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/block/height?height=200',
    );
    expect(response.status).toBe(404);
  });

  it('should get specfic block by hash. testID: e2e_002 ', async () => {
    const blockHash =
      'd744db74fb70ed42767ae028a129365fb4d7de54ba1b6575fb047490554f8a7b';
    const response = await request(app.getHttpServer()).get(
      `/api/block/hash?hash=${blockHash}`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(e2e_002_data);
  });

  it('get all transactions of a block at specific height. testID: e2e_003 ', async () => {
    const height = 1;
    const response = await request(app.getHttpServer()).get(
      `/api/blocks/${height}/transactions`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(e2e_003_data);
  });

  it('get all transactions of a specific address. testID: e2e_003 ', async () => {
    const address = 'msER9bmJjyEemRpQoS8YYVL21VyZZrSgQ7';
    const response = await request(app.getHttpServer()).get(
      `/api/addresses/${address}/transactions`,
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(e2e_004_data);
  });

  afterAll(async () => {
    await app.close();
  });
});
