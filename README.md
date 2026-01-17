# Robotics & Telemetry Module (`nkz-module-robotics`)

**Vendor**: [Robotika](https://robotika.cloud)  
**Standard**: NKZ (Nekazari)

This module enables advanced robotics integration for the Nekazari platform, specifically focusing on low-latency telemetry and control via **Eclipse Zenoh**.

## Features

-   **Zenoh Router**: A dedicated Zenoh router deployment (`zenoh-router`) running in the `nekazari` namespace.
-   **Low-Latency Control**: Optimized for video streaming and joystick teleoperation.
-   **Fleet Management**: Interfaces for managing robot fleets (future hook into `entity-manager`).

## Architecture

### Zenoh Integration
The module deploys a Zenoh router that acts as the central message broker for robots.
-   **Ports**: `7447` (TCP/UDP) for peer-to-peer and routed communication.
-   **Connectivity**: Robots should connect to this router via the Platform VPN (`nekazari-vpn`) or internal cluster network.

### MQTT Co-existence
This module works alongside the core `mosquitto` broker.
-   **Telemetry (Slow)**: GPS, Battery, Status -> MQTT (Core)
-   **Teleoperation (Fast)**: Video, Joystick -> Zenoh (This Module)

## Deployment

This module includes Kubernetes manifests in `k8s/`:
-   `zenoh-deployment.yaml`: Deploys the Zenoh router.

## Development

See the root `nekazari-public` documentation for module development guidelines.
