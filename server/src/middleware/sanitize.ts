import { Request, Response, NextFunction } from 'express';

function sanitizeValue(value: string): string {
  return value.replace(/[<>"']/g, '').trim();
}

function sanitizeObject(obj: Record<string, any>): void {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeValue(obj[key]);
    } else if (obj[key] !== null && typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
}

export const sanitizeMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') sanitizeObject(req.body);
  if (req.query && typeof req.query === 'object') sanitizeObject(req.query as Record<string, any>);
  next();
};
