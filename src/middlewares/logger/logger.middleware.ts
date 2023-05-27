import { Request, Response, NextFunction } from 'express';
import { logger } from 'src/utils/logger';

export function log(req: Request, res: Response, next: NextFunction) {
  logger.info(`Método: ${req.method}, URL: ${req.originalUrl}, IP: ${req.ip}`);
  next();
}
