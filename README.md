# MilScale - Efetivo Service

Microsserviço responsável pelo cadastro do efetivo (militares) do MilScale, sistema de escalas de serviço de 24h de uma organização militar.
Guarda nome de guerra, graduação, subunidade e situação (apto, em missão ou afastado). A quantidade de militares aptos é usada pelo BFF para calcular o ciclo de serviço.

## Arquitetura

```
Usuário -> Microfrontend (React) -> API Gateway (AWS) -> BFF (Node.js)
                                                         |-> Efetivo Service -> MongoDB Atlas
                                                         |-> Escala Service  -> Azure SQL
                                                         |                   -> Azure Service Bus -> Function (notificar-escala)
                                                         |-> Azure Function (calcular-ciclo)
```

Organização em **Clean Architecture** com **Vertical Slice** por funcionalidade:

```
src/
  domain/            entidade Militar, regras de validação e porta MilitarRepository
  application/       um caso de uso por pasta (create-militar, list-militares, get-militar, update-militar, delete-militar)
  infrastructure/    MongoMilitarRepository (driver oficial do MongoDB) e repositório em memória
  api/               rotas Express por feature, Swagger e composição (server.ts)
tests/
  unit/              domínio, casos de uso e API
  architecture/      regras de dependência entre camadas e entre slices
```

Banco: **MongoDB Atlas** (Free Tier), coleção `militares` com índice único em `nomeGuerra`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | /militares | Lista (filtros `situacao` e `subunidade`) com total e aptos |
| POST | /militares | Cadastra |
| GET | /militares/{id} | Busca por id |
| PUT | /militares/{id} | Atualiza (ex.: situação para MISSAO) |
| DELETE | /militares/{id} | Remove |
| GET | /swagger | Documentação Swagger |

## Tecnologias

Node.js 22, TypeScript, Express 5, MongoDB Node Driver, Swagger UI, Jest, Supertest, Docker.

## Como rodar localmente

```bash
npm install
cp .env.example .env   # preencher MONGO_URI
npm run dev            # http://localhost:3001/swagger
npm test               # testes unitários e de arquitetura
```

Com Docker:

```bash
docker build -t enzoojapa/milscale-efetivo-service:v1 .
docker run -p 3001:3001 -e MONGO_URI="..." enzoojapa/milscale-efetivo-service:v1
```

## Links

- Swagger: _LINK_SWAGGER_
- Docker Hub: _LINK_DOCKER_

## Projetos do sistema

| Componente | Repositório |
|---|---|
| Microfrontend (React) | [milscale-frontend](https://github.com/enzoojapa/milscale-frontend) |
| BFF (Node.js) | [milscale-bff](https://github.com/enzoojapa/milscale-bff) |
| Microsserviço de efetivo (MongoDB) | [milscale-efetivo-service](https://github.com/enzoojapa/milscale-efetivo-service) |
| Microsserviço de escalas (Azure SQL) | [milscale-escala-service](https://github.com/enzoojapa/milscale-escala-service) |
| Azure Function | [milscale-function](https://github.com/enzoojapa/milscale-function) |

## Alunos

- Enzo Watanabe de Lima
- João Guilherme Salomão
- João Guilherme Cordeiro
- Rafael Zeni Simião

PUCPR - Engenharia de Software - Arquitetura e Soluções Cloud (2026/2)
