FROM node:24.11-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Definir DATABASE_URL padrão para builds públicos (pode ser sobrescrito via --build-arg)
ARG DATABASE_URL=mysql://root:123456@mysql:3307/agenda_db
ENV DATABASE_URL=${DATABASE_URL}

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3000

# Comando para iniciar (aguarda migrations e inicia o app)
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]

