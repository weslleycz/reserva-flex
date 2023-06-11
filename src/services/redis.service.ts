import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor() {
    // Configuração do cliente Redis
    this.redisClient = new Redis({
      host: 'localhost', // Host do seu servidor Redis
      port: 6379, // Porta do seu servidor Redis
    });
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async getValue(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }
}
