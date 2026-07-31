# Industrial Data Platform — Quarkus Edition

A Quarkus implementation of the existing Spring Boot industrial data showcase. It preserves the same end-to-end flow while replacing the backend runtime and framework stack.

```text
PLC / PLC4X
    ↓
plc-collector-service (Quarkus Scheduler + Quarkus Messaging)
    ↓
Kafka: plc.raw.readings
    ├── plc-persist-service → PostgreSQL / Liquibase
    └── plc-query-service   → Redis current state + REST + JSON WebSocket
                                      ↓
                              Angular industrial UI
```

## Main migration decisions

| Spring implementation | Quarkus implementation |
|---|---|
| Spring Boot configuration properties | SmallRye Config Mapping |
| Camel timer route | Quarkus Scheduler |
| Camel Kafka producer/consumer | Quarkus Messaging with Kafka |
| Spring Data JPA | Hibernate ORM with Panache |
| RedisTemplate | Quarkus Redis DataSource |
| Spring MVC | Quarkus REST / Jakarta REST |
| Spring STOMP broker | WebSockets Next with plain JSON |
| Spring Security resource server | Quarkus OIDC |
| Actuator health and metrics | SmallRye Health and Micrometer |

The PLC reader still uses the PLC4X Java API directly. This avoids coupling the collector to a Camel component that is not required for the Quarkus implementation.

## Modules

- `industrial-data-platform-contracts`: shared event and API contracts
- `plc-collector-service`: polls PLC tags and publishes readings to Kafka
- `plc-persist-service`: stores changed values in PostgreSQL, idempotently by Kafka offset
- `plc-query-service`: current values in Redis, history REST API, Kafka consumer, JSON WebSocket
- `plc-industrial-ui`: Angular 21 UI adapted from STOMP to the browser WebSocket API

## Build

```bash
./mvnw clean verify
cd plc-industrial-ui
npm ci
npm run build
```

Quarkus JVM applications are written to each module's `target/quarkus-app` directory.

## Development services

The defaults are compatible with local Kafka and Redis. PostgreSQL defaults to the existing cluster database.

Important environment variables:

| Variable | Default |
|---|---|
| `KAFKA_BOOTSTRAP_SERVERS` | `localhost:9092` |
| `PLC_READINGS_TOPIC` | `plc.raw.readings` |
| `DB_URL` | `jdbc:postgresql://postgres.cluster.lab:5432/plcdb` |
| `DB_USERNAME` | `plcuser` |
| `DB_PASSWORD` | `plcpass` |
| `REDIS_URL` | `redis://localhost:6379` |
| `KEYCLOAK_ISSUER_URI` | `https://keycloak.cluster.lab/realms/industrial` |

Run a service in Quarkus dev mode:

```bash
./mvnw -pl plc-query-service -am quarkus:dev
```

## HTTP endpoints

The query service keeps the existing API paths:

- `GET /api/plc`
- `GET /api/plc/{tag}`
- `POST /api/plc`
- `DELETE /api/plc/{tag}`
- `GET /api/history/temperature`
- `GET /api/history/measurements?metric=TEMPERATURE&range=LAST_15_MINUTES`
- WebSocket: `/ws`
- Health: `/q/health/live` and `/q/health/ready`
- Metrics: `/q/metrics`
- OpenAPI: `/v3/api-docs?format=json`
- Swagger UI: `/swagger-ui`

## Parallel operation with the Spring version

The default Quarkus Kafka consumer groups have a `-quarkus-` suffix so both implementations can receive the full event stream. The persistence service uses PostgreSQL `ON CONFLICT ... DO NOTHING` against the existing Kafka topic/partition/offset constraint, so duplicate inserts are avoided even when both implementations run simultaneously.

Use a separate namespace and hosts in the Quarkus infrastructure repository, for example:

- namespace: `industrial-quarkus`
- query host: `plc-query-quarkus.cluster.lab`
- UI host: `plc-ui-quarkus.cluster.lab`

The production Angular environment already points to the Quarkus query host. Add the new UI host to the Keycloak client's valid redirect URIs and web origins.

## GitLab CI/CD

The root `.gitlab-ci.yml` is a new centralized pipeline with these stages:

```text
test → build → image → update-infra
```

Images are pushed to:

```text
harbor.cluster.lab/industrial-quarkus/<service>
```

The update jobs expect this repository:

```text
gitlab.cluster.lab/harald/industrial-data-platform-quarkus-infra.git
```

Required GitLab CI variables:

- `HARBOR_USERNAME`
- `HARBOR_PASSWORD`
- `INFRA_REPO_TOKEN`

See [`docs/10-validation.md`](docs/10-validation.md) for the reproducible validation commands.

## Current scope

This repository is generated from the existing public Spring Boot source and has been structurally migrated to Quarkus. Cluster deployment manifests belong in the separate `industrial-data-platform-quarkus-infra` repository.
