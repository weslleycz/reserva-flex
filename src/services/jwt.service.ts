import { Injectable } from '@nestjs/common';
import jwt, { sign } from 'jsonwebtoken';

@Injectable()
export class JWTService {
  public login(id: string): string {
    return sign({ data: id }, process.env.Security_JWT, {
      expiresIn: '72h',
    });
  }

  public verify(token: string): boolean {
    try {
      jwt.verify(token, process.env.Security_JWT);
      return true;
    } catch (err) {
      return false;
    }
  }

  public decode(token: string) {
    return jwt.decode(token);
  }
}
