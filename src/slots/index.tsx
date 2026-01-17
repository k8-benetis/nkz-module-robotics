/**
 * Slot Registration for Your Module
 * =============================================================================
 * Defines all slots that integrate with the Unified Viewer (/entities page).
 * 
 * IMPORTANT: All widgets MUST include explicit `moduleId` property.
 * This ensures proper provider wrapping and error handling by the host.
 */

import React from 'react';

// =============================================================================
// IMPORTANT: Set your module ID here
// This MUST match the "id" field in your manifest.json
// =============================================================================
const MODULE_ID = 'robotics';

// Type definitions for slot widgets (simplified for brevity as they are interfaces)
export interface SlotWidgetDefinition {
    id: string;
    moduleId: string;
    component: string;
    priority: number;
    localComponent: React.ComponentType<any>;
    defaultProps?: Record<string, any>;
    showWhen?: {
        entityType?: string[];
        layerActive?: string[];
    };
}

export type SlotType = 'layer-toggle' | 'context-panel' | 'bottom-panel' | 'entity-tree' | 'map-layer';

export interface ModuleViewerSlots {
    'layer-toggle'?: SlotWidgetDefinition[];
    'context-panel'?: SlotWidgetDefinition[];
    'bottom-panel'?: SlotWidgetDefinition[];
    'entity-tree'?: SlotWidgetDefinition[];
    'map-layer'?: SlotWidgetDefinition[];
    moduleProvider?: React.ComponentType<{ children: React.ReactNode }>;
}

// =============================================================================
// Example Slot Component
// =============================================================================

const ExampleSlot: React.FC = () => {
    return (
        <div className="p-4 text-center">
            <p className="text-sm text-slate-600">
                Hello from {MODULE_ID} module!
            </p>
            <p className="text-xs text-slate-400 mt-1">
                This is an example slot widget.
            </p>
        </div>
    );
};

// =============================================================================
// Slots Configuration
// =============================================================================

export const moduleSlots: ModuleViewerSlots = {
    'map-layer': [],
    'layer-toggle': [],
    'context-panel': [
        {
            id: `${MODULE_ID}-example`,
            moduleId: MODULE_ID,
            component: 'ExampleSlot',
            priority: 100,
            localComponent: ExampleSlot,
        }
    ],
    'bottom-panel': [],
    'entity-tree': [],
};

export const viewerSlots = moduleSlots;
export default moduleSlots;
