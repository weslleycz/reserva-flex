import { Request, Response, NextFunction } from 'express';

export function isAdm(req: Request, res: Response, next: NextFunction) {
  if (req.headers.security_key === process.env.Security_Key) {
    next();
  } else {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }
}
