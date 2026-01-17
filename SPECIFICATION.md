# Robotics & Telemetry Module - Technical Specification

## 1. Architecture: "Dual Speed"
Separates data by frequency and criticality.

### A. Management Plane (Fleet)
-   **Protocol**: MQTT (Json/Ultralight).
-   **Path**: Robot -> IoT Agent -> Orion-LD -> TimescaleDB.
-   **Data**: GPS, Battery, OpMode, TaskID, Alarms.
-   **Use**: Cesium Unified Viewer (Historical/Low-freq).

### B. Control Plane (Teleoperation)
-   **Protocol**: Zenoh.
-   **Path**: Robot <-> Zenoh Router <-> Web Client.
-   **Data**: Video, LiDAR 2D, `cmd_vel`, `steering_mode`, Joysticks.
-   **Use**: Real-time Cockpit (High-freq).

## 2. Security & Safety
-   **Multitenancy (CRITICAL)**:
    -   **Namespacing**: Strict topic structure `nkz/<tenant_id>/<robot_id>/...`.
    -   **Access Control**: Router MUST enforce ACLs or Authentication to prevent cross-tenant data leakage. Users should only be able to subscribe/publish to their tenant's topics.
-   **Heartbeat/Watchdog**:
    -   Robot listens on `/zenoh/heartbeat`.
    -   Manual Mode: Requires pulse every **1000ms (1s)**.
    -   Auto Mode: Ignores heartbeat.
    -   **Soft Stop**: If signal lost -> Reduce `cmd_vel` gradually (e.g., 1.0 to 0.0 in 0.5s) to protect mechanics.

## 3. Steering Modes (4WS)
Four-Wheel Steering configurations for `AgriRobot`:
1.  **Ackermann Front**: Standard car-like.
2.  **Ackermann Dual**: Opposed rear steering (tighter radius).
3.  **Crab**: Diagonal movement.
4.  **Differential**: Skid-steer / Zero turn.

## 4. Frontend Components
-   **Fleet Overlay**: HTML overlay on Cesium (non-canvas) for crisp text.
-   **Cockpit**:
    -   Video Viewport (Center) - *Phase 1 uses Zenoh transport*.
    -   Safety Header (E-Stop, Mode, Ping).
    -   Drive Panel (Visual steering feedback).
    -   Implement Panel (Dynamic widgets).
