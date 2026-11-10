import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../domain/Militar';
import { ConflictError, NotFoundError } from '../application/errors';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof DomainError) {
    res.status(400).json({ erro: err.message });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ erro: err.message });
    return;
  }
  if (err instanceof ConflictError) {
    res.status(409).json({ erro: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno' });
}
