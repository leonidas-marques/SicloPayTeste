# preferi a abordagem de compilar no proprio container para evitar possiveis erros
# executando os testes na inicialização do container

FROM node:18

WORKDIR /app

COPY package.json package-lock.json tsconfig.json ./

COPY ./prisma ./prisma

COPY ./src ./src

COPY ./swagger ./swagger

COPY ./.env ./.env

RUN npx prisma generate

RUN npm install

RUN npm run build

RUN rm -rf ./src

EXPOSE 3000

RUN npm test

CMD ["node", "dist/server.js"]




