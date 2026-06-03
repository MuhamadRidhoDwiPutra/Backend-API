# Database ERD and Schema

## Tables

- `users`
  - Stores user accounts and roles
  - Unique index on `email`
  - Index on `role`

- `products`
  - Stores product catalog data
  - Soft delete via `deleted_at`
  - Index on `name`, `deleted_at`, `price`

- `orders`
  - Stores order header data
  - Index on `user_id`, `status`, `created_at`

- `order_items`
  - Stores individual product line items per order
  - Index on `order_id`, `product_id`

- `activity_logs`
  - Records async workflow events and status
  - Unique `event_id` for idempotency
  - Index on `order_id` and `status`

- `notifications`
  - Stores async notification delivery records
  - Index on `user_id`

## ERD Diagram

```text
[User] 1---* [Order] 1---* [OrderItem] *---1 [Product]
   |                 |
   |                 * [ActivityLog]
   |                 * [Notification]
   |
   * [ActivityLog]
```

## Database Rationale

- `users` and `orders` are normalized for customer/order relation.
- `products` are soft-deleted so historical order data remains consistent.
- `order_items` separate line items from order header for efficient querying.
- `activity_logs` provide an audit trail for asynchronous processing.
- `notifications` store outbound notification state and delivery metadata.
