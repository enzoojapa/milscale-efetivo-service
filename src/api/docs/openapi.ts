const militarSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '6731f0c2a1b2c3d4e5f60789' },
    nomeGuerra: { type: 'string', example: 'SILVA' },
    nomeCompleto: { type: 'string', example: 'Joao Pedro da Silva' },
    graduacao: { type: 'string', enum: ['SOLDADO', 'CABO', 'SARGENTO', 'TENENTE', 'CAPITAO'] },
    subunidade: { type: 'string', example: '1a Companhia' },
    situacao: { type: 'string', enum: ['APTO', 'MISSAO', 'AFASTADO'] },
    apto: { type: 'boolean' },
    criadoEm: { type: 'string', format: 'date-time' },
  },
};

const militarInput = {
  type: 'object',
  required: ['nomeGuerra', 'nomeCompleto', 'graduacao', 'subunidade'],
  properties: {
    nomeGuerra: { type: 'string', example: 'SILVA' },
    nomeCompleto: { type: 'string', example: 'Joao Pedro da Silva' },
    graduacao: { type: 'string', enum: ['SOLDADO', 'CABO', 'SARGENTO', 'TENENTE', 'CAPITAO'], example: 'SOLDADO' },
    subunidade: { type: 'string', example: '1a Companhia' },
    situacao: { type: 'string', enum: ['APTO', 'MISSAO', 'AFASTADO'], example: 'APTO' },
  },
};

const erro = { type: 'object', properties: { erro: { type: 'string' } } };
const idParam = { name: 'id', in: 'path', required: true, schema: { type: 'string' } };
const json = (schema: object) => ({ content: { 'application/json': { schema } } });

export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MilScale - Efetivo Service',
    version: '1.0.0',
    description: 'Microsservico de efetivo (militares e situacao). Banco: MongoDB Atlas.',
  },
  tags: [{ name: 'Militares' }, { name: 'Health' }],
  paths: {
    '/health': {
      get: { tags: ['Health'], summary: 'Status do servico', responses: { 200: { description: 'OK' } } },
    },
    '/militares': {
      get: {
        tags: ['Militares'],
        summary: 'Lista militares',
        parameters: [
          { name: 'situacao', in: 'query', schema: { type: 'string', enum: ['APTO', 'MISSAO', 'AFASTADO'] } },
          { name: 'subunidade', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: {
            description: 'Lista com totais',
            ...json({
              type: 'object',
              properties: {
                total: { type: 'integer' },
                aptos: { type: 'integer' },
                militares: { type: 'array', items: militarSchema },
              },
            }),
          },
        },
      },
      post: {
        tags: ['Militares'],
        summary: 'Cadastra militar',
        requestBody: { required: true, ...json(militarInput) },
        responses: {
          201: { description: 'Criado', ...json(militarSchema) },
          400: { description: 'Dados invalidos', ...json(erro) },
          409: { description: 'Nome de guerra duplicado', ...json(erro) },
        },
      },
    },
    '/militares/{id}': {
      get: {
        tags: ['Militares'],
        summary: 'Busca militar por id',
        parameters: [idParam],
        responses: { 200: { description: 'OK', ...json(militarSchema) }, 404: { description: 'Nao encontrado', ...json(erro) } },
      },
      put: {
        tags: ['Militares'],
        summary: 'Atualiza militar (ex.: situacao para MISSAO)',
        parameters: [idParam],
        requestBody: { required: true, ...json({ ...militarInput, required: [] }) },
        responses: {
          200: { description: 'Atualizado', ...json(militarSchema) },
          400: { description: 'Dados invalidos', ...json(erro) },
          404: { description: 'Nao encontrado', ...json(erro) },
        },
      },
      delete: {
        tags: ['Militares'],
        summary: 'Remove militar',
        parameters: [idParam],
        responses: { 204: { description: 'Removido' }, 404: { description: 'Nao encontrado', ...json(erro) } },
      },
    },
  },
};
