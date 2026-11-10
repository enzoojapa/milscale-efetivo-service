import { MongoMilitarRepository } from '../infrastructure/persistence/MongoMilitarRepository';
import { buildApp } from './app';

async function main(): Promise<void> {
  const port = Number(process.env.PORT ?? 3001);
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB ?? 'milscale_efetivo';
  if (!uri) {
    throw new Error('Variavel MONGO_URI nao configurada');
  }

  const { repo } = await MongoMilitarRepository.conectar(uri, dbName);
  buildApp(repo).listen(port, () => {
    console.log(`milscale-efetivo-service rodando na porta ${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
