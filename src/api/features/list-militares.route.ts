import { Router } from 'express';
import { ListMilitares } from '../../application/list-militares/ListMilitares';
import { Situacao } from '../../domain/Militar';

export function listMilitaresRoute(useCase: ListMilitares): Router {
  return Router().get('/militares', async (req, res) => {
    const resultado = await useCase.execute({
      situacao: req.query.situacao as Situacao | undefined,
      subunidade: req.query.subunidade as string | undefined,
    });
    res.json(resultado);
  });
}
