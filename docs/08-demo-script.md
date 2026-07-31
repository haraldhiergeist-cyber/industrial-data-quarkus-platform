# Demo Script

## Overview

This demo script provides a structured walkthrough of the Industrial Data Platform Showcase.

The objective is to demonstrate the complete technology stack from industrial data acquisition to cloud-native operations.

Estimated duration: 10 to 15 minutes.

---

# Demo Story

The presentation follows a simple narrative:

A PLC produces industrial process data.

The platform collects, processes, stores, visualizes, secures, monitors, and operates this data using modern cloud-native technologies.

---

## Step 1 – Project Introduction

Duration: 1 minute

Explain the purpose of the platform.

Key message:

"This project demonstrates a complete cloud-native industrial platform from infrastructure to business application."

Show:

- Overview document
- Platform stack diagram

Highlight:

- Hardware
- Harvester
- Kubernetes
- Platform Services
- Industrial Application

---

## Step 2 – Architecture Overview

Duration: 1 minute

Show architecture documentation.

Explain:

- PLC Collector Service
- Kafka
- Query Service
- Persist Service
- Angular UI

Show architecture diagram.

Key message:

"The platform is built using an event-driven architecture."

---

## Step 3 – Open Dashboard

Duration: 1 minute

Open the Angular dashboard.

Show:

- Current measurements
- Temperature
- Pressure
- Level

Explain:

- Data is coming from a PLC simulator
- Updates are delivered in real time

Key message:

"Users immediately see current process values."

---

## Step 4 – Demonstrate Real-Time Updates

Duration: 2 minutes

Change a PLC value in the simulator.

Examples:

- Temperature
- Pressure
- Tank level

Observe dashboard update.

Explain:

```text
PLC
 -> Collector
 -> Kafka
 -> Query Service
 -> WebSocket
 -> Browser
```

Key message:

"No page refresh is required."

---

## Step 5 – Demonstrate Historical Data

Duration: 2 minutes

Open the measurements/history page.

Show:

- Historical chart
- Time range selection
- Zoom functionality

Explain:

```text
Kafka
 -> Persist Service
 -> PostgreSQL
```

Key message:

"The platform separates current state and historical storage."

---

## Step 6 – Demonstrate Security

Duration: 1 minute

Open login page.

Show:

- Keycloak login
- User authentication
- Logout

Explain:

- OAuth2
- OpenID Connect
- JWT Tokens

Key message:

"Authentication is centralized and standards-based."

---

## Step 7 – Demonstrate Monitoring

Duration: 2 minutes

Open Grafana.

Show:

- JVM metrics
- Request statistics
- Resource consumption

Explain:

- SmallRye Health
- Micrometer
- Prometheus
- Grafana

Key message:

"The platform is observable and operationally transparent."

---

## Step 8 – Demonstrate Logging

Duration: 1 minute

Open Loki dashboards.

Show:

- Centralized logs
- Application logs
- Troubleshooting workflow

Key message:

"Operations teams can quickly diagnose issues."

---

## Step 9 – Demonstrate Kubernetes Operations

Duration: 2 minutes

Open Rancher.

Show:

- Cluster overview
- Workloads
- Services
- Ingresses

Explain:

- Kubernetes deployment model
- Container orchestration

Key message:

"The platform runs on a modern cloud-native foundation."

---

## Step 10 – Demonstrate Infrastructure Layer

Duration: 1 minute

Open Harvester.

Show:

- Virtual machines
- Infrastructure resources
- Networking

Explain:

- Infrastructure ownership
- Virtualization layer

Key message:

"The platform covers the entire stack from infrastructure to application."

---

## Step 11 – Demonstrate GitOps Deployment

Duration: 1 minute

Show deployment architecture.

Explain:

```text
GitLab
 -> CI/CD
 -> Harbor
 -> Fleet
 -> Kubernetes
```

Explain:

- Automated deployment
- Version-controlled infrastructure
- GitOps workflows

Key message:

"Changes move automatically from source code to running applications."

---

## Closing Summary

Duration: 1 minute

Summarize the demonstrated capabilities.

Infrastructure:

- Hardware
- Harvester
- Networking

Platform:

- Kubernetes
- Rancher
- Kafka
- Redis
- PostgreSQL
- Keycloak

Application:

- PLC Integration
- Real-Time Dashboards
- Historical Analysis

Operations:

- GitOps
- Monitoring
- Logging

Final message:

"The Industrial Data Platform Showcase demonstrates end-to-end ownership of a modern cloud-native industrial platform, from infrastructure to business application."
