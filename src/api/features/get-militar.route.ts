import { Router } from 'express';
import { GetMilitar } from '../../application/get-militar/GetMilitar';

export function getMilitarRoute(useCase: GetMilitar): Router {
  return Router().get('/militares/:id', async (req, res) => {
    res.json(await useCase.execute(req.params.id));
  });
}
