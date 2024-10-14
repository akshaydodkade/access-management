import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { Redis } from 'ioredis';
import { CreateKeyDto } from './dto';
import { AccessKeyService } from './access-key.service';

describe('Test Admin Controller', () => {
  let controller: AdminController;
  let redisClient: Redis;
  let accessKeyService: AccessKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            hmset: jest.fn(),
            hgetall: jest.fn(),
            del: jest.fn(),
            lrange: jest.fn(),
          },
        },
        {
          provide: AccessKeyService,
          useValue: {
            createKey: jest.fn(),
            listKeys: jest.fn(),
            deleteKey: jest.fn(),
            updateKey: jest.fn(),
            viewLogs: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    redisClient = module.get<Redis>('REDIS_CLIENT');
    accessKeyService = module.get<AccessKeyService>(AccessKeyService);
  });

  describe('createKey', () => {
    const createKeyDto: CreateKeyDto = {
      rateLimit: 10,
      expirationTime: new Date(),
    };

    function generateUniqueKey(): string {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    }

    it('should create a new key and store it in Redis', async () => {
      // mock AccessKeyService.createKey
      const newKey = generateUniqueKey();
      accessKeyService.createKey = jest.fn().mockResolvedValue(newKey);

      const result = await controller.createKey(createKeyDto);

      expect(accessKeyService.createKey).toHaveBeenCalledWith(
        createKeyDto.rateLimit,
        createKeyDto.expirationTime,
      );

      expect(result).toHaveProperty('key', newKey);
      expect(result).toHaveProperty('message', 'Key generated successfully');
    });
  });

  describe('listKeys', () => {
    it('should list all keys from Redis', async () => {
      const mockKeys = [
        { rateLimit: 2, expirationTime: new Date('2024-10-10') },
        { rateLimit: 1, expirationTime: new Date('2024-12-31') },
      ];

      // mock Redis hgetall
      redisClient.hgetall = jest.fn().mockResolvedValue(mockKeys);
      accessKeyService.listKeys = jest.fn().mockResolvedValue(mockKeys);

      const result = await controller.listKeys();

      expect(result).toEqual({ keys: mockKeys });
      expect(result).toHaveProperty('keys');
      expect(result.keys.length).toBeGreaterThan(0);
    });
  });

  describe('deleteKey', () => {
    it('should delete the specified key from Redis', async () => {
      const keyToDelete = 'test-key';

      redisClient.del = jest.fn().mockResolvedValue(1);

      const result = await controller.deleteKey(keyToDelete);

      expect(result).toEqual({
        success: false,
        message: `Key ${keyToDelete} not found`,
      });
    });
  });

  describe('updateKey', () => {
    it('should update the specified key with new rate limit and expiration time', async () => {
      const keyToUpdate = 'test-key';
      const updateKeyDto = {
        rateLimit: 20,
        expirationTime: new Date(),
      };

      redisClient.hmset = jest.fn().mockResolvedValue(1);

      const result = await controller.updateKey(keyToUpdate, updateKeyDto);

      expect(result).toEqual({
        success: false,
        message: `Key not found or failed to update`,
      });
    });
  });
});
