# NestJS Auth & User Management Service

A **NestJS-based authentication and user management API** with JWT authentication, PostgreSQL integration, and email services.

---

## 🚀 Features

* Authentication (signup, login, refresh tokens, password reset)
* PostgreSQL with TypeORM integration
* Email service with Handlebars templates
* Modular architecture (Auth, Users, Mail, Config)
* Docker & Docker Compose support

---

## 📂 Project Structure

```
src/
 ├── auth/         # Authentication (controllers, services, DTOs, entities)
 ├── users/        # User module (CRUD, DTOs, entities)
 ├── mail/         # Email service and templates
 ├── config/       # App & database configurations
 ├── middleware/   # Middlewares (Auth, etc.)
 ├── guards/       # Auth and JWT guards
 └── main.ts       # Entry point
```

---

## ⚙️ Prerequisites

* [Node.js](https://nodejs.org/) v18+
* [pnpm](https://pnpm.io/) (or npm/yarn)
* [PostgreSQL](https://www.postgresql.org/) v15+
* [Docker](https://www.docker.com/) (if using containerized setup)

---

## 🔑 Environment Variables

Copy `.envdemo` as `.env` and update values if needed:

```bash
cp .envdemo .env
```

Example `.env`:

```env
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=auth_db
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/auth_db

PORT=4000
NODE_ENV=development

JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d

MAIL_HOST=smtp.ethereal.email
MAIL_USER=burnice.gorczany@ethereal.email
MAIL_PASSWORD=BEqvVdqHBp8XNDPuaT
MAIL_FROM=testing
```

---

## 🖥️ Local Development Setup

1. **Install dependencies**

   ```bash
   pnpm install
   ```

   *(or use `npm install` if not using pnpm)*

2. **Setup PostgreSQL**

   ```bash
   createdb auth_db
   ```

   Or connect via Dockerized PostgreSQL (see Docker section).

3. **Run migrations (if using TypeORM CLI)**

   ```bash
   pnpm run migration:run
   ```

4. **Start development server**

   ```bash
   pnpm run start:dev
   ```

5. **Access API**

   * Base URL: `http://localhost:4000`
   * Example endpoints:

     * `POST /auth/signup`
     * `POST /auth/login`
     * `GET /users`

---

## 🐳 Run with Docker

This project includes a `Dockerfile` and `docker-compose.yml`.

### 1. Build and Run Containers

```bash
docker-compose up --build
```

This will:

* Start a `postgres` container
* Start your NestJS app container

### 2. Verify Services

```bash
docker ps
```

You should see both `nestjs-app` and `postgres` running.

### 3. Access the API

* App: [http://localhost:4000](http://localhost:4000)
* PostgreSQL: on port `5432`

---

## 🛠️ Useful Commands

### Run in watch mode

```bash
pnpm run start:dev
```

### Build project

```bash
pnpm run build
```

### Run tests

```bash
pnpm run test
pnpm run test:e2e
pnpm run test:cov
```

### Stop Docker containers

```bash
docker-compose down
```

---

## 📬 API Examples (via cURL)

### Signup

```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

### Login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

---

## 📖 License

MIT

---

👉 Do you also want me to include **Swagger API setup instructions** (since many NestJS projects use it), or just keep it minimal for running the project?
