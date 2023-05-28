import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../services/jwt.service';

export function jwtGuard(req: Request, res: Response, next: NextFunction) {
  const jWTService = new JWTService();
  if (jWTService.verify(req.headers.token as string)) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
}
