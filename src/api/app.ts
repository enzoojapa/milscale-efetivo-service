import cors from 'cors';
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { CreateMilitar } from '../application/create-militar/CreateMilitar';
import { DeleteMilitar } from '../application/delete-militar/DeleteMilitar';
import { GetMilitar } from '../application/get-militar/GetMilitar';
import { ListMilitares } from '../application/list-militares/ListMilitares';
import { UpdateMilitar } from '../application/update-militar/UpdateMilitar';
import { MilitarRepository } from '../domain/MilitarRepository';
import { openApiSpec } from './docs/openapi';
import { errorHandler } from './errorHandler';
import { createMilitarRoute } from './features/create-militar.route';
import { deleteMilitarRoute } from './features/delete-militar.route';
import { getMilitarRoute } from './features/get-militar.route';
import { listMilitaresRoute } from './features/list-militares.route';
import { updateMilitarRoute } from './features/update-militar.route';

export function buildApp(repo: MilitarRepository): Express {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', servico: 'milscale-efetivo-service' });
  });
  app.get('/swagger.json', (_req, res) => {
    res.json(openApiSpec);
  });
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.use(createMilitarRoute(new CreateMilitar(repo)));
  app.use(listMilitaresRoute(new ListMilitares(repo)));
  app.use(getMilitarRoute(new GetMilitar(repo)));
  app.use(updateMilitarRoute(new UpdateMilitar(repo)));
  app.use(deleteMilitarRoute(new DeleteMilitar(repo)));

  app.use(errorHandler);
  return app;
}
