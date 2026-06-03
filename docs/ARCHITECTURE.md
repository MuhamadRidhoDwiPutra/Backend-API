# Architecture Overview

## Core Layers

- **Routes**: Define API endpoints in `src/routes/*`.
- **Controllers**: Handle HTTP requests and responses in `src/controllers/*`.
- **Services**: Contain business logic in `src/services/*`.
- **Repositories**: Access data via Prisma in `src/repositories/*`.
- **Middlewares**: Validation, authentication, logging, and error handling.
- **Workers / Queues**: Async processing for order-related tasks.

## Key Components

- `src/app.ts`
  - Express app configuration
  - Security, CORS, rate limiting, structured logging, metrics, and routes
- `src/server.ts`
  - Bootstraps the database connection, HTTP server, and async worker
- `src/config/index.ts`
  - Central application configuration from environment variables
- `src/workers/orderWorker.ts`
  - BullMQ worker that processes order jobs asynchronously
- `src/queues/orderQueue.ts`
  - Order queue definition and scheduler

## Observability

- Structured logging: `pino` with `pino-http`
- Request tracing: request IDs via `pino-http`
- Metrics: Prometheus-style metrics using `prom-client` at `/metrics`

## Async Processing

- Order creation enqueues a background job (`order-created`) after transaction success.
- The worker sends invoice emails, saves activity logs, and creates notification records.
- Job retries and failure logging are managed by BullMQ.
