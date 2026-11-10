import { Router } from 'express';
import { UpdateMilitar } from '../../application/update-militar/UpdateMilitar';

export function updateMilitarRoute(useCase: UpdateMilitar): Router {
  return Router().put('/militares/:id', async (req, res) => {
    res.json(await useCase.execute(req.params.id, req.body));
  });
}
