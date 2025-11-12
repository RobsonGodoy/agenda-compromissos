# 📅 Agenda de Compromissos

Sistema fullstack para gerenciamento de compromissos, desenvolvido com NestJS, React, MySQL e Docker.

## Tecnologias

### Backend
- Node.js 24.11
- NestJS
- TypeScript
- Prisma ORM
- MySQL
- Jest (Testes)

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios

### Infraestrutura
- Docker
- Docker Compose

## 📁 Estrutura do Projeto

```
agenda-compromissos/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── appointments/       # Módulo de compromissos
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── entities/      # Entidades
│   │   │   ├── appointments.controller.ts
│   │   │   ├── appointments.service.ts
│   │   │   ├── appointments.service.spec.ts
│   │   │   └── appointments.module.ts
│   │   ├── prisma/
│   │   │   ├── prisma.service.ts
│   │   │   └── prisma.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # Aplicação React
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppointmentList.tsx
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── AppointmentForm.tsx
│   │   │   ├── AppointmentCalendar.tsx
│   │   │   ├── ViewToggle.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── NewAppointment.tsx
│   │   │   └── EditAppointment.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── appointment.ts
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🎯 Funcionalidades

- ✅ Listar compromissos (visualização em lista ou calendário)
- ✅ Criar novos compromissos
- ✅ Editar compromissos existentes
- ✅ Excluir compromissos (soft delete)
- ✅ Validação de dados no backend
- ✅ Interface responsiva e moderna
- ✅ API RESTful

## 📊 Modelo de Dados

```prisma
model Appointment {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(200)
  description String?  @db.Text
  datetime    DateTime
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## 🔌 API Endpoints

| Método | Endpoint              | Descrição                    |
|--------|-----------------------|------------------------------|
| GET    | `/appointments`       | Listar compromissos ativos   |
| GET    | `/appointments/:id`   | Buscar compromisso por ID    |
| POST   | `/appointments`       | Criar novo compromisso       |
| PATCH  | `/appointments/:id`   | Atualizar compromisso        |
| DELETE | `/appointments/:id`   | Excluir compromisso (soft)   |

## 🐳 Rodando com Docker (Recomendado)

### Pré-requisitos
- Docker
- Docker Compose

### Passos

1. **Clone o repositório (se aplicável)**

2. **Inicie os containers**
```bash
docker-compose up --build
```

3. **Acesse a aplicação**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MySQL: localhost:3307
- Credenciais padrão do MySQL (definidas no compose/Dockerfile):
  - Usuário: root
  - Senha: 123456
  - `DATABASE_URL`: mysql://root:123456@mysql:3307/agenda_db

> Caso deseje alterar a URL do banco, edite a variável `DATABASE_URL` em `docker-compose.yml` ou passe `--build-arg DATABASE_URL=...` ao construir o serviço `backend`.

### Comandos úteis do Docker

```bash
# Parar containers
docker-compose down

# Ver logs do backend
docker-compose logs -f backend

# Ver logs do frontend
docker-compose logs -f frontend

# Executar migrations manualmente
docker-compose exec backend npx prisma migrate deploy

# Acessar MySQL
docker-compose exec mysql mysql -u root -p agenda_db
# Senha: root
```

## 💻 Rodando Localmente (Sem Docker)

### Pré-requisitos
- Node.js 24.11+
- MySQL 8.0+
- npm

### Backend

1. **Instalar dependências**
```bash
cd backend
npm install
```

2. **Configurar variáveis de ambiente**
```bash
DATABASE_URL=mysql://root:123456@localhost:3307/agenda_db
```

3. **Executar migrations**
```bash
npx prisma migrate dev --name init
```

4. **Gerar Prisma Client**
```bash
npx prisma generate
```

5. **Iniciar servidor**
```bash
npm run start:dev
```

O backend estará rodando em http://localhost:3000

### Frontend

1. **Instalar dependências**
```bash
cd frontend
npm install
```

2. **Configurar variáveis de ambiente**
```bash
# Criar arquivo .env com:
VITE_API_URL=http://localhost:3000
```

3. **Iniciar aplicação**
```bash
npm run dev
```

O frontend estará rodando em http://localhost:5173

## 🧪 Testes

### Backend (Jest)

```bash
cd backend

# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm run test:watch

# Rodar com coverage
npm run test:cov
```

## Estilo e Design

O projeto utiliza CSS global com variáveis CSS para facilitar manutenção e temas:

```css
:root {
  --primary-color: #4a90e2;
  --secondary-color: #50e3c2;
  --danger-color: #e74c3c;
  --success-color: #2ecc71;
  /* ... mais variáveis */
}
```