import { Router } from 'express';
import { CreateMilitar } from '../../application/create-militar/CreateMilitar';

export function createMilitarRoute(useCase: CreateMilitar): Router {
  return Router().post('/militares', async (req, res) => {
    const militar = await useCase.execute(req.body);
    res.status(201).json(militar);
  });
}
