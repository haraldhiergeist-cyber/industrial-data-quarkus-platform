# PLC Industrial UI — Quarkus Edition

Angular 21 dashboard for the Quarkus industrial data platform.

## Data access

- Initial/current values and history are loaded through the REST API of `plc-query-service`.
- Live values arrive as JSON over a native browser WebSocket at `/ws`.
- Keycloak remains responsible for UI login.

## Local development

```bash
npm ci
npm start
```

The development environment expects the query service at `http://localhost:8080`.

## Production build

```bash
npm ci
npm run build
```

The generated application is written to `dist/plc-industrial-ui/browser`.

`Dockerfile` performs a complete multi-stage build for local use. `Dockerfile.ci` packages the build artifact produced by the GitLab `ui-build` job without running npm a second time.

## OpenAPI client

With the query service running locally:

```powershell
npm run generate-api
```

The command reads the Quarkus OpenAPI document from `http://localhost:8080/v3/api-docs?format=json`.
