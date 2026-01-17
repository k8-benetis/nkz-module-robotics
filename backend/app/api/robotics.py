from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

router = APIRouter()

class ZenohConfig(BaseModel):
    mode: str
    connect: List[str]
    namespaces: Dict[str, str]
    safety: Dict[str, Any]

@router.get("/devices/{robot_id}/config", response_model=ZenohConfig)
async def get_robot_config(
    robot_id: str, 
    tenant_id: str = Query(..., description="The ID of the tenant owning the robot")
):
    """
    Generate Zenoh configuration for a specific robot.
    
    This includes:
    - Connection endpoints (Zenoh Router)
    - strict namespacing (nkz/{tenant_id}/{robot_id})
    - Safety parameters (Watchdog timeout)
    """
    
    # 1. Namespacing Strategy
    # All topics for this robot must be prefixed with: nkz/<tenant_id>/<robot_id>/
    base_prefix = f"nkz/{tenant_id}/{robot_id}"
    
    # 2. Connection Endpoints
    # In a real deployment, this might be dynamic based on the region or availability.
    # For Phase 1, we assume the VPN Gateway (10.8.0.1) proxies or the Robot can route to the Cluster.
    # We provide the VPN internal IP as the primary contact point.
    router_endpoints = ["tcp/10.8.0.1:7447"] 

    return ZenohConfig(
        mode="client",
        connect=router_endpoints,
        namespaces={
            "prefix": base_prefix,
            "cmd_vel": f"{base_prefix}/cmd_vel",
            "video": f"{base_prefix}/video",
            "telemetry": f"{base_prefix}/telemetry",
            "heartbeat": f"{base_prefix}/heartbeat"
        },
        safety={
            "watchdog_timeout_ms": 1000,
            "watchdog_topic": f"{base_prefix}/heartbeat",
            "safe_stop_behavior": "ramp_down_0.5s"
        }
    )
