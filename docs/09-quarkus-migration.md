# Quarkus migration notes

The backend is not a mechanical annotation replacement. The following architectural changes are intentional:

1. Kafka integration uses MicroProfile Reactive Messaging rather than Camel Kafka routes.
2. The collector uses Quarkus Scheduler and calls PLC4X directly.
3. Browser live updates use plain JSON over WebSockets Next instead of STOMP.
4. PostgreSQL idempotency uses `ON CONFLICT` to remain safe while Spring and Quarkus deployments run in parallel.
5. Redis access uses the typed Quarkus Redis DataSource.
6. Health and metrics use the standard Quarkus `/q` endpoints.

The shared event contracts remain compatible. The Quarkus Liquibase changelog uses preconditions so an existing `plc_reading` table is reused, while a new database is bootstrapped with the same schema and Kafka idempotency constraint.
