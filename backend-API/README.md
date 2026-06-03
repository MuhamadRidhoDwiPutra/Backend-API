# Backend Technical Test API

Production-ready backend dengan Express.js, PostgreSQL, Prisma ORM, dan JWT Authentication.

## 📁 Project Structure

```
├── src/
│   ├── config/           # Configuration (database, app settings)
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic layer
│   ├── repositories/     # Data access layer
│   ├── routes/           # API route definitions
│   ├── middlewares/      # Express middlewares (auth, error, validation)
│   ├── validators/       # Zod validation schemas
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your database configuration
```

### 3. Database Setup (Local)

```bash
# Generate Prisma Client
npm run prisma:generate

# Run Migrations
npm run prisma:migrate

# Seed Database
npm run prisma:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 🐳 Docker Setup

### Start All Services

```bash
docker-compose up -d
```

Services:
- **API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

### Stop Services

```bash
docker-compose down -v
```

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register user | Public |
| POST | /api/auth/login | Login | Public |
| GET | /api/auth/me | Get profile | Auth |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/products | List products | Public |
| GET | /api/products/:id | Get product | Public |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/orders | Create order | Auth |
| GET | /api/orders/history | Order history | Auth |
| GET | /api/orders/:id | Get order | Auth |
| PATCH | /api/orders/:id/status | Update status | Admin |

---

## 🔐 Security Features

| Feature | Description |
|---------|-------------|
| **Helmet** | Security headers |
| **CORS** | Cross-Origin Resource Sharing control |
| **Rate Limiting** | 100 requests per 15 minutes |
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT** | Access token with 7-day expiration |
| **Input Validation** | Zod schemas |

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin123! |
| Customer | customer@example.com | Customer123! |

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed database |