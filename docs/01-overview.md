# Industrial Data Platform Showcase

## Overview

The Industrial Data Platform Showcase demonstrates how modern cloud-native technologies can be used to build and operate an end-to-end industrial data platform.

Unlike many application-focused examples, this project intentionally covers the complete technology stack from physical infrastructure to business application level.

The showcase illustrates how industrial data can be collected, processed, stored, visualized, secured, monitored, and operated using modern cloud-native technologies and DevOps practices.

---

## Why This Project Matters

Most showcase projects focus on a single layer of the technology stack:

- Application development
- Kubernetes administration
- Infrastructure management
- Monitoring
- Industrial connectivity

This project combines all of these areas into a single, coherent platform.

It demonstrates the ability to design, build, deploy, operate, and maintain a complete industrial software platform covering:

Hardware → Virtualization → Infrastructure → Kubernetes → Platform Services → Business Applications

The project therefore represents not only software development skills but also platform engineering, cloud architecture, DevOps, and industrial integration expertise.

---

## Goals

The main objectives of the project are:

- Collect data from industrial PLC systems
- Process and distribute data using an event-driven architecture
- Store historical measurements
- Provide real-time dashboards
- Enable secure user authentication and authorization
- Demonstrate cloud-native deployment patterns
- Demonstrate GitOps-based operations
- Provide monitoring and observability capabilities
- Demonstrate a complete industrial platform stack

---

## Functional Overview

The platform consists of several independent services.

### PLC Collector Service

Reads process values from industrial PLC devices using Apache PLC4X and publishes events to Apache Kafka.

### PLC Persist Service

Consumes Kafka events and stores measurements in PostgreSQL for historical analysis.

### PLC Query Service

Provides APIs for retrieving current values and historical measurements. Current values are maintained in Redis for fast access.

### Industrial Web UI

Angular-based frontend providing dashboards, historical charts, and operational views.

### Security

Authentication and authorization are provided through Keycloak using OAuth2 and OpenID Connect.

### Monitoring

Prometheus, Grafana, and Loki provide metrics, dashboards, and centralized logging.

---

## Technology Stack

### Application Layer

- Angular
- Quarkus
- Quarkus Scheduler
- Quarkus Messaging with Kafka
- Apache PLC4X

### Platform Services

- Apache Kafka
- Redis
- PostgreSQL
- Keycloak

### Observability

- Prometheus
- Grafana
- Loki

### Container Platform

- Kubernetes (RKE2)
- Rancher

### Infrastructure Layer

- Harvester
- KVM Virtualization
- Virtual Networking
- DNS / DHCP Services
- TLS Infrastructure

---

## Platform Architecture

The showcase is built using a layered architecture.

### Hardware Layer

Physical server infrastructure providing compute, storage, and networking resources.

### Virtualization Layer

Harvester provides KVM-based virtualization and infrastructure management.

### Infrastructure Layer

Virtual machines, networking, DNS, DHCP, TLS certificates, and storage services.

### Container Platform Layer

Rancher and RKE2 Kubernetes provide workload orchestration and cluster management.

### Platform Services Layer

Kafka, Redis, PostgreSQL, Keycloak, Prometheus, Grafana, and Loki provide reusable platform capabilities.

### Business Application Layer

The Industrial Data Platform implements industrial data acquisition, processing, visualization, and analysis.

---

## Target Audience

This project is intended for:

- Industrial IoT initiatives
- Industry 4.0 projects
- Software architects
- Platform engineers
- DevOps engineers
- Cloud engineers
- Technical decision makers

---

## Repository Structure

### industrial-data-platform-quarkus

Application source code including:

- PLC Collector Service
- PLC Query Service
- PLC Persist Service
- Angular Frontend

### industrial-data-platform-quarkus-infra

Infrastructure and deployment resources including:

- Kubernetes manifests
- Fleet GitOps definitions
- Platform services
- Ingress configuration
- Deployment automation

---

## Key Capabilities Demonstrated

- Industrial PLC integration
- Event-driven architecture
- Cloud-native application development
- Kubernetes operations
- GitOps deployment workflows
- Identity and access management
- Monitoring and observability
- Infrastructure virtualization
- Platform engineering
- End-to-end system architecture

---

## Next Steps

Further documentation can be found in:

- Architecture Documentation
- Platform Stack Documentation
- Data Flow Documentation
- Deployment Documentation
- Security Documentation
- Observability Documentation
