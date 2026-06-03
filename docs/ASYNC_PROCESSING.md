# Async Processing Flow

## Use Case

When an order is successfully created, the system performs asynchronous work:

1. Send invoice email
2. Save activity log
3. Create notification record

## Implementation

- Queue provider: **BullMQ** with **Redis**
- Queue name: `order-processing`
- Job type: `order-created`
- Retry policy: 3 attempts with exponential backoff
- Dead-letter behavior: failed jobs are logged and retried by BullMQ
- Idempotency: each async task is identified by a unique `eventId`

## Order Job Workflow

1. `orderService.createOrder()` creates the order and then calls `enqueueOrderProcessing(order.id)`.
2. `orderWorker` processes the job and checks for an existing activity log by `eventId`.
3. If the order has already been processed, the worker skips duplicate execution.
4. The worker sends the invoice email and writes a record to `activity_logs`.
5. Notifications are persisted in the `notifications` table.
6. If processing fails, BullMQ retries the job and logs failures for visibility.
