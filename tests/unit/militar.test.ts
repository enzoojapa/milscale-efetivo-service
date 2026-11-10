import request from 'supertest';
import { buildApp } from '../../src/api/app';
import { CreateMilitar } from '../../src/application/create-militar/CreateMilitar';
import { ListMilitares } from '../../src/application/list-militares/ListMilitares';
import { DomainError, Militar } from '../../src/domain/Militar';
import { InMemoryMilitarRepository } from '../../src/infrastructure/persistence/InMemoryMilitarRepository';

const base = {
  nomeGuerra: 'silva',
  nomeCompleto: 'Joao Pedro da Silva',
  graduacao: 'SOLDADO' as const,
  subunidade: '1a Companhia',
  situacao: 'APTO' as const,
};

describe('Militar (dominio)', () => {
  it('normaliza o nome de guerra em maiusculas', () => {
    expect(Militar.criar(base).nomeGuerra).toBe('SILVA');
  });

  it('rejeita graduacao invalida', () => {
    expect(() => Militar.criar({ ...base, graduacao: 'GENERAL' as never })).toThrow(DomainError);
  });

  it('so esta apto com situacao APTO', () => {
    expect(Militar.criar({ ...base, situacao: 'MISSAO' }).estaApto()).toBe(false);
  });
});

describe('Casos de uso', () => {
  it('nao permite nome de guerra duplicado', async () => {
    const repo = new InMemoryMilitarRepository();
    const criar = new CreateMilitar(repo);
    await criar.execute(base);
    await expect(criar.execute(base)).rejects.toThrow('Ja existe');
  });

  it('lista com total e quantidade de aptos', async () => {
    const repo = new InMemoryMilitarRepository();
    const criar = new CreateMilitar(repo);
    await criar.execute(base);
    await criar.execute({ ...base, nomeGuerra: 'souza', situacao: 'AFASTADO' });
    const r = await new ListMilitares(repo).execute();
    expect(r.total).toBe(2);
    expect(r.aptos).toBe(1);
  });
});

describe('API', () => {
  const app = buildApp(new InMemoryMilitarRepository());

  it('faz o CRUD completo', async () => {
    const criado = await request(app).post('/militares').send(base).expect(201);
    const id = criado.body.id;
    await request(app).get(`/militares/${id}`).expect(200);
    const atualizado = await request(app).put(`/militares/${id}`).send({ situacao: 'MISSAO' }).expect(200);
    expect(atualizado.body.apto).toBe(false);
    await request(app).delete(`/militares/${id}`).expect(204);
    await request(app).get(`/militares/${id}`).expect(404);
  });

  it('retorna 400 para dados invalidos', async () => {
    await request(app).post('/militares').send({ nomeGuerra: 'x' }).expect(400);
  });
});
