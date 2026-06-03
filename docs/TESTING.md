# Testing Strategy

## Overview

The project uses **Jest** for both unit and integration testing.

## Strategy

- **Unit tests** cover utility functions, middleware behavior, and business logic in isolation.
- **Integration tests** verify HTTP endpoints and application wiring.
- Test files live under `tests/unit` and `tests/integration`.

## Mocking

- Middleware tests use Jest mocks for response objects.
- Utility tests validate pure functions and token generation logic.
- Integration tests use `supertest` against the Express app.

## Edge Cases

- Invalid request payloads
- Auth errors and token verification
- Request tracing and metrics endpoints
- Background job failure and retry logic (architected with BullMQ)

## Coverage

The test suite is configured to collect coverage and report metrics under `coverage/`.
Minimum coverage is targeted at **70%**.
