# Validation

Run these checks after cloning the repository in an environment with access to Maven Central and npm:

```bash
./mvnw clean verify

cd plc-industrial-ui
npm ci
npm run build
```

The GitLab pipeline performs the same backend tests and UI build before creating container images.

For local integration testing, start Kafka, Redis, PostgreSQL, and Keycloak or supply their connection settings through the environment variables documented in the root README. The PLC collector can then be run against the existing S7 endpoint or a PLC4X simulated connection string.
