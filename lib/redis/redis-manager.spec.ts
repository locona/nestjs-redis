import { Test, TestingModule } from '@nestjs/testing';
import Redis from 'ioredis';
import { RedisManager } from './redis-manager';
import { RedisClients } from './interfaces';
import { REDIS_CLIENTS, DEFAULT_REDIS_NAMESPACE } from './redis.constants';

jest.mock('ioredis', () => jest.fn(() => ({})));

describe('RedisManager', () => {
    let clients: RedisClients;
    let manager: RedisManager;

    beforeEach(async () => {
        clients = new Map();
        clients.set(DEFAULT_REDIS_NAMESPACE, new Redis());
        clients.set('client1', new Redis());

        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: REDIS_CLIENTS, useValue: clients }, RedisManager]
        }).compile();

        manager = module.get<RedisManager>(RedisManager);
    });

    test('should have 2 members', () => {
        expect(manager.clients.size).toBe(2);
    });

    test('should get a client with namespace', () => {
        const client = manager.getClient('client1');
        expect(client).toBeDefined();
    });

    test('should get default client with namespace', () => {
        const client = manager.getClient(DEFAULT_REDIS_NAMESPACE);
        expect(client).toBeDefined();
    });

    test('should get default client without namespace', () => {
        const client = manager.getClient();
        expect(client).toBeDefined();
    });

    test('should throw an error when getting a client with an unknown namespace', () => {
        expect(() => manager.getClient('')).toThrow();
    });
});
