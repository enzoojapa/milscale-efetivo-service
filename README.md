# MilScale - Efetivo Service

Esse microsserviço cuida do cadastro do efetivo do MilScale, ou seja, dos militares que podem entrar na escala de serviço. De cada militar a gente guarda o nome de guerra, a graduação, a subunidade e a situação, que pode ser apto, em missão ou afastado. Só quem está apto entra na conta do ciclo de serviço, então quando alguém vai pra missão o ciclo muda na hora no painel.

O banco é o MongoDB Atlas no plano gratuito, com a coleção `militares` e um índice único no nome de guerra, pra não deixar cadastrar dois militares com o mesmo nome. O CRUD é completo: dá pra listar (com filtro por situação e subunidade), buscar por id, cadastrar, atualizar e remover, e tudo está documentado no Swagger.

A organização segue Clean Architecture com Vertical Slice. O domínio tem a entidade Militar, as validações e a interface do repositório. Na aplicação cada caso de uso tem a sua própria pasta (create-militar, list-militares, get-militar, update-militar e delete-militar). A infraestrutura tem o repositório do MongoDB e um em memória usado nos testes, e a API tem as rotas por funcionalidade, o Swagger e a montagem das dependências. Os testes unitários passam pelo domínio, pelos casos de uso e pelas rotas, e os testes de arquitetura conferem as dependências entre camadas e que uma funcionalidade não importa a outra.

Foi feito em Node.js 22 com TypeScript, Express 5 e o driver oficial do MongoDB, com Swagger UI, Jest, Supertest e Docker.

Pra rodar localmente precisa da connection string do Mongo no `.env`:

```bash
npm install
cp .env.example .env
npm run dev
npm test
```

A imagem foi publicada no Docker Hub assim:

```bash
docker build -t enzowlima/milscale-efetivo-service:v1 .
docker push enzowlima/milscale-efetivo-service:v1
```

Na nuvem ele roda no Azure Container Apps. O Swagger está em https://ca-milscale-efetivo.ashyforest-fcfffbba.eastus2.azurecontainerapps.io/swagger e a imagem em https://hub.docker.com/r/enzowlima/milscale-efetivo-service. Ele é chamado pelo BFF (https://github.com/enzoojapa/milscale-bff), e o resto do projeto está no frontend (https://github.com/enzoojapa/milscale-frontend), no serviço de escalas (https://github.com/enzoojapa/milscale-escala-service) e na Function (https://github.com/enzoojapa/milscale-function).

Trabalho feito por Enzo Watanabe de Lima, João Guilherme Salomão, João Guilherme Cordeiro e Rafael Zeni Simião, para a disciplina de Arquitetura e Soluções Cloud da PUCPR (2026/2).
