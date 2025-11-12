FROM node:24.11-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3000

# Comando para iniciar (aguarda migrations e inicia o app)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]

