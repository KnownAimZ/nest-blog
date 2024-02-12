import { Injectable } from '@nestjs/common';
import { HashingService } from 'auth/hashing';
import { randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

@Injectable()
export class ScryptService implements HashingService {
  async generateSalt(): Promise<Buffer> {
    return await randomBytes(16);
  }

  concatHashedPass(pass: Buffer, salt: Buffer): string {
    return `${pass.toString('hex')}:${salt.toString('hex')}`;
  }

  async hash(data: string | Buffer): Promise<string> {
    const salt = await this.generateSalt();
    const hashedPassword = (await scryptAsync(data, salt, 64)) as Buffer;
    return this.concatHashedPass(hashedPassword, salt);
  }
  async compare(data: string, encrypted: string): Promise<boolean> {
    const [pass, salt] = encrypted.split(':');
    const saltBuffer = Buffer.from(salt, 'hex');
    const passBuffer = Buffer.from(pass, 'hex');
    const hashedData = (await scryptAsync(data, saltBuffer, 64)) as Buffer;
    return timingSafeEqual(hashedData, passBuffer);
  }
}
