# Teste de Programação: Desenvolvedor Node.js Siclopay

API desenvolvida utilizando Node.js, TypeScript, Express, Prisma e PostgreSQL, executando no Docker.

## 🛠 Ferramentas

<p align="left"> <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://git-scm.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/git-scm/git-scm-icon.svg" alt="git" width="40" height="40"/> </a> <a href="https://graphql.org" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/graphql/graphql-icon.svg" alt="graphql" width="40" height="40"/> </a> <a href="https://jestjs.io" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/jestjsio/jestjsio-icon.svg" alt="jest" width="40" height="40"/> </a> <a href="https://www.linux.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/linux/linux-original.svg" alt="linux" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a> </p>

## 📝 Setup

Tenha certeza de ter o arquivo .env enviado na raiz do projeto

Na pasta raiz do projeto:

```bash
sudo docker-compose up --build 

```
Depois da inicialização, abra outro terminal:

```bash
sudo docker exec -it node_container bash
```
Logo após:

```bash
npx prisma generate
npx prisma migrate dev --name init
exit
```

## 🖥 Acessando o pgAdmin

Vá para http://localhost:8080/

logue com o email admin@admin.com e a senha admin

clique em adicionar novo servidor

Na aba geral dê um nome a seu criteiro

na aba conexão:
Host name = postgres
Username = user
Senha = password

## As rotas ficaram organizadas da seguinte forma

#### Documentação com Swagger

http://localhost:3000/api/v1/api-docs/

#### Rotas da Api

http://localhost:3000/api/v1/products

http://localhost:3000/api/v1/products/shopify

http://localhost:3000/api/v1/shopify/products

http://localhost:3000/api/v1/shopify/products/sync

#### Payloads

Se for útil, deixei um arquivo de payload na raiz, para testar a rota que precisa dela no Insomnia ou Postman
