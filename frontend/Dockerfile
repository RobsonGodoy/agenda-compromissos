FROM node:24.11-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 5173

# Comando para iniciar em modo desenvolvimento com host
CMD ["npm", "run", "dev", "--", "--host"]

