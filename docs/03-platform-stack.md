# Platform Stack

## Overview

The Industrial Data Platform Showcase intentionally covers the complete technology stack required to design, deploy, and operate a modern cloud-native industrial platform.

The stack spans from physical infrastructure to end-user applications and demonstrates expertise across multiple disciplines including infrastructure engineering, virtualization, Kubernetes, platform engineering, DevOps, and software development.

---

## Platform Layers

The platform is organized into five major layers.

```text
Business Applications
        ↑
Platform Services
        ↑
Container Platform
        ↑
Infrastructure Layer
        ↑
Hardware Layer
```

Each layer builds upon the capabilities provided by the layer below.

---

## Hardware Layer

The hardware layer provides the foundation for the entire platform.

Responsibilities:

- Compute resources
- Storage resources
- Network connectivity
- Physical infrastructure

This layer represents the physical environment on which all higher-level services are deployed.

---

## Infrastructure Layer

The infrastructure layer is implemented using Harvester.

### Harvester

Harvester provides:

- KVM virtualization
- Virtual machine lifecycle management
- Virtual networking
- Storage integration
- Infrastructure administration

### Supporting Infrastructure

Additional infrastructure services include:

- DNS
- DHCP
- TLS certificates
- Internal networking
- VLAN segmentation

Benefits:

- Infrastructure abstraction
- Simplified operations
- Resource isolation
- Flexible provisioning

---

## Container Platform Layer

The container platform layer is based on Rancher and RKE2 Kubernetes.

### Rancher

Responsibilities:

- Cluster management
- User administration
- Application deployment
- Operational visibility

### RKE2 Kubernetes

Responsibilities:

- Container orchestration
- Scheduling
- Service discovery
- Scaling
- High availability capabilities

Benefits:

- Cloud-native deployment model
- Standardized operations
- Workload portability
- Platform scalability

---

## Platform Services Layer

The platform services layer provides reusable capabilities consumed by business applications.

### Messaging

#### Apache Kafka

Responsibilities:

- Event streaming
- Asynchronous communication
- Decoupled service integration

### Data Storage

#### Redis

Responsibilities:

- Current process values
- Fast data access
- Caching

#### PostgreSQL

Responsibilities:

- Historical data storage
- Structured persistence
- Long-term retention

### Identity Management

#### Keycloak

Responsibilities:

- Authentication
- Authorization
- Single Sign-On
- Identity management

### Observability

#### Prometheus

Metrics collection and monitoring.

#### Grafana

Visualization and dashboards.

#### Loki

Centralized logging.

Benefits:

- Reduced application complexity
- Shared platform capabilities
- Standardized services
- Operational consistency

---

## Business Application Layer

The Industrial Data Platform itself represents the business application layer.

Components:

### PLC Collector Service

Industrial connectivity and data acquisition with Quarkus Scheduler, PLC4X, and Kafka messaging.

### PLC Query Service

Quarkus REST APIs, Redis current state, OIDC integration, and JSON WebSocket delivery.

### PLC Persist Service

Kafka consumption and historical persistence with Hibernate ORM, Panache, and Liquibase.

### Angular Frontend

User interface and visualization.

Benefits:

- Clear separation of concerns
- Independent deployment
- Service-oriented architecture
- Maintainable design

---

## Why a Layered Architecture

The layered approach provides several advantages.

### Separation of Responsibilities

Each layer focuses on a specific area of responsibility.

### Reusability

Platform services can support multiple business applications.

### Scalability

Individual layers can evolve independently.

### Maintainability

Infrastructure, platform services, and applications remain loosely coupled.

### Operational Excellence

Operational concerns are centralized within dedicated platform services.

---

## Demonstrated Capabilities

This showcase demonstrates practical experience in:

- Infrastructure Engineering
- Virtualization
- Kubernetes Operations
- Platform Engineering
- DevOps
- GitOps
- Security
- Monitoring
- Industrial Integration
- Cloud-Native Application Development

---

## Summary

The Industrial Data Platform Showcase demonstrates a complete cloud-native technology stack from hardware to business application level.

The platform intentionally combines infrastructure, platform services, and application development to illustrate full-stack ownership and end-to-end system design capabilities.
