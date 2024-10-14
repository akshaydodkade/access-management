import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AccessKey } from './access-key.interface';

@Injectable()
export class AccessKeyService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // generate new access key
  async createKey(rateLimit: number, expirationTime: Date): Promise<string> {
    const key = this.generateUniqueKey();

    const keyData: AccessKey = {
      key,
      rateLimit,
      expirationTime,
      remainingRequests: rateLimit,
      isEnabled: true,
    };

    await this.redisClient.hmset(`access_key:${key}`, {
      key: keyData.key,
      rateLimit: keyData.rateLimit.toString(),
      expirationTime: keyData.expirationTime,
      remainingRequests: keyData.remainingRequests.toString(),
      isEnabled: keyData.isEnabled.toString(),
    });

    return key;
  }

  // list all access keys
  async listKeys(): Promise<AccessKey[]> {
    const keys = await this.redisClient.keys('access_key:*');
    const allKeys: AccessKey[] = [];

    for (const key of keys) {
      const keyData = await this.redisClient.hgetall(key);
      const accessKey: AccessKey = {
        key: keyData.key,
        rateLimit: Number(keyData.rateLimit),
        expirationTime: new Date(keyData.expirationTime),
        remainingRequests: Number(keyData.remainingRequests),
        isEnabled: keyData.isEnabled === 'true',
      };
      allKeys.push(accessKey);
    }

    return allKeys;
  }

  // delete access key
  async deleteKey(key: string): Promise<boolean> {
    const result = await this.redisClient.del(`access_key:${key}`);
    return result === 1;
  }

  // update existing access key
  async updateKey(
    key: string,
    rateLimit: number,
    expirationTime: Date,
  ): Promise<boolean> {
    const exists = await this.redisClient.exists(`access_key:${key}`);
    if (!exists) {
      return false;
    }

    await this.redisClient.hmset(`access_key:${key}`, {
      rateLimit: rateLimit.toString(),
      expirationTime: expirationTime,
      remainingRequests: rateLimit.toString(),
    });

    return true;
  }

  // generate unique key
  private generateUniqueKey(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // get details
  async getAccessPlanDetails(key: string): Promise<AccessKey | null> {
    const keyData = await this.redisClient.hgetall(`access_key:${key}`);
    if (!keyData || Object.keys(keyData).length === 0) {
      return null;
    }

    const accessKey: AccessKey = {
      key: keyData.key,
      rateLimit: Number(keyData.rateLimit),
      expirationTime: new Date(keyData.expirationTime),
      remainingRequests: Number(keyData.remainingRequests),
      isEnabled: keyData.isEnabled === 'true',
    };

    return accessKey;
  }

  // enable or disable the access key
  async toggleKey(key: string, isEnabled: boolean): Promise<boolean> {
    const exists = await this.redisClient.exists(`access_key:${key}`);
    if (!exists) {
      return false;
    }

    await this.redisClient.hset(
      `access_key:${key}`,
      'isEnabled',
      isEnabled?.toString(),
    );
    return true;
  }

  // fetch logs
  async viewLogs() {
    const logs = await this.redisClient.lrange('token_request_logs', 0, -1);
    const parsedLogs = logs?.map((log) => JSON.parse(log));
    return parsedLogs;
  }
}
