# Teste de Programação: Desenvolvedor Node.js Siclopay

API Desenvolvida utilizando Node.js, TypeScript, Express, Prisma e Postgres, executando no docker.

# 🛠 Ferramentas

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg" height="40" alt="go logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg" height="40" alt="rust logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-plain-wordmark.svg" height="40" alt="ruby logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-plain-wordmark.svg" height="40" alt="dot-net logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain-wordmark.svg" height="40" alt="firebase logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-line-wordmark.svg" height="40" alt="amazonwebservices logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg" height="40" alt="circleci logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" height="40" alt="kubernetes logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-plain-wordmark.svg" height="40" alt="docker logo"  />
</div>

# Setup

sudo docker exec -it node_container bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma migrate deploy


# pgAdmin

Vá para http://localhost:8080/

logue com o email admin@admin.com e a senha admin

clique em adicionar novo servidor

Na aba geral dê um nome a seu criteiro

na aba conexão:
Host name = postgres
Username = user
Senha = password


