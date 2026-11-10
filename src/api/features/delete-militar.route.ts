import { Router } from 'express';
import { DeleteMilitar } from '../../application/delete-militar/DeleteMilitar';

export function deleteMilitarRoute(useCase: DeleteMilitar): Router {
  return Router().delete('/militares/:id', async (req, res) => {
    await useCase.execute(req.params.id);
    res.status(204).send();
  });
}
