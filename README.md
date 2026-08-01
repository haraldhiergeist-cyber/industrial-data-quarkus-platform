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
=======
# industrial-data-platform-quarkus



## Getting started

To make it easy for you to get started with GitLab, here's a list of recommended next steps.

Already a pro? Just edit this README.md and make it your own. Want to make it easy? [Use the template at the bottom](#editing-this-readme)!

## Add your files

* [Create](https://docs.gitlab.com/user/project/repository/web_editor/#create-a-file) or [upload](https://docs.gitlab.com/user/project/repository/web_editor/#upload-a-file) files
* [Add files using the command line](https://docs.gitlab.com/topics/git/add_files/#add-files-to-a-git-repository) or push an existing Git repository with the following command:

```
cd existing_repo
git remote add origin https://gitlab.cluster.lab/harald/industrial-data-platform-quarkus.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools

* [Set up project integrations](https://gitlab.cluster.lab/harald/industrial-data-platform-quarkus/-/settings/integrations)

## Collaborate with your team

* [Invite team members and collaborators](https://docs.gitlab.com/user/project/members/)
* [Create a new merge request](https://docs.gitlab.com/user/project/merge_requests/creating_merge_requests/)
* [Automatically close issues from merge requests](https://docs.gitlab.com/user/project/issues/managing_issues/#closing-issues-automatically)
* [Enable merge request approvals](https://docs.gitlab.com/user/project/merge_requests/approvals/)
* [Set auto-merge](https://docs.gitlab.com/user/project/merge_requests/auto_merge/)

## Test and Deploy

Use the built-in continuous integration in GitLab.

* [Get started with GitLab CI/CD](https://docs.gitlab.com/ci/quick_start/)
* [Analyze your code for known vulnerabilities with Static Application Security Testing (SAST)](https://docs.gitlab.com/user/application_security/sast/)
* [Deploy to Kubernetes, Amazon EC2, or Amazon ECS using Auto Deploy](https://docs.gitlab.com/topics/autodevops/requirements/)
* [Use pull-based deployments for improved Kubernetes management](https://docs.gitlab.com/user/clusters/agent/)
* [Set up protected environments](https://docs.gitlab.com/ci/environments/protected_environments/)

***

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
>>>>>>> origin/main
