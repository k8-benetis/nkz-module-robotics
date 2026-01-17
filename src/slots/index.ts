/**
 * Slot Registration for Your Module
 * =============================================================================
 * Defines all slots that integrate with the Unified Viewer (/entities page).
 * 
 * IMPORTANT: All widgets MUST include explicit `moduleId` property.
 * This ensures proper provider wrapping and error handling by the host.
 * 
 * Available Slots:
 * - 'map-layer': Cesium layers, markers, overlays
 * - 'layer-toggle': Layer manager controls (toggle visibility)
 * - 'context-panel': Right panel (entity details when selected)
 * - 'bottom-panel': Bottom panel (timeline, charts)
 * - 'entity-tree': Left panel (custom entity lists)
 */

import React from 'react';

// =============================================================================
// IMPORTANT: Set your module ID here
// This MUST match the "id" field in your manifest.json
// =============================================================================
const MODULE_ID = 'robotics';

// Type definitions for slot widgets
export interface SlotWidgetDefinition {
    /** Unique identifier for this widget (prefix with module name) */
    id: string;
    /** 
     * Module ID that owns this widget. REQUIRED for all modules.
     * Used by the host's SlotRenderer to:
     * - Group widgets from the same module
     * - Apply the module's shared provider (for React Context)
     * - Handle errors per-module with proper error boundaries
     */
    moduleId: string;
    /** Component name (for debugging/logging) */
    component: string;
    /** Render priority (lower = rendered first/higher in list) */
    priority: number;
    /** The actual React component to render */
    localComponent: React.ComponentType<any>;
    /** Default props passed to the widget */
    defaultProps?: Record<string, any>;
    /** Conditional visibility */
    showWhen?: {
        /** Show only when selected entity is one of these types */
        entityType?: string[];
        /** Show only when one of these layers is active */
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
    /** 
     * Optional module provider for React Context.
     * When multiple widgets from the same module are rendered, they will share
     * a single instance of this provider. This ensures state synchronization
     * between widgets from the same module.
     */
    moduleProvider?: React.ComponentType<{ children: React.ReactNode }>;
}

// =============================================================================
// Example Slot Component
// =============================================================================
// In a real module, you would import from '../components/slots/...'
// For now, we define a simple inline component as an example

const ExampleSlot: React.FC = () => {
    return (
        <div className= "p-4 text-center" >
        <p className="text-sm text-slate-600" >
            Hello from { MODULE_ID } module!
                </p>
                < p className = "text-xs text-slate-400 mt-1" >
                    This is an example slot widget.
            </p>
                        </div>
    );
};

// =============================================================================
// Slots Configuration
// =============================================================================
// Add your slot widgets here. Each widget must include moduleId.

export const moduleSlots: ModuleViewerSlots = {
    'map-layer': [
        // Add your Cesium/map layer widgets here
        // Example:
        // {
        //   id: 'hello-world-cesium-layer',
        //   moduleId: MODULE_ID,
        //   component: 'MyCesiumLayer',
        //   priority: 10,
        //   localComponent: MyCesiumLayer,
        // }
    ],

    'layer-toggle': [
        // Add your layer toggle widgets here
        // These appear in the Layers dropdown in the Unified Viewer
    ],

    'context-panel': [
        // Example: Show this widget when any entity is selected
        {
            id: `${MODULE_ID}-example`,
            moduleId: MODULE_ID,
            component: 'ExampleSlot',
            priority: 100, // Higher priority = appears lower in the panel
            localComponent: ExampleSlot,
            // Uncomment to show only for specific entity types:
            // showWhen: {
            //   entityType: ['AgriParcel', 'AgriSensor']
            // }
        }
    ],

    'bottom-panel': [
        // Add your bottom panel widgets here (charts, timelines, etc.)
    ],

    'entity-tree': [
        // Add your entity tree widgets here
    ],

    // Uncomment if your module uses React Context that needs to be shared
    // between multiple slots:
    // moduleProvider: MyModuleProvider,
};

/**
 * Export as viewerSlots for host integration
 * 
 * The host's ModuleContext looks for './viewerSlots' export in remoteEntry.js
 * Make sure your vite.config.ts exposes this:
 * 
 * ```typescript
 * federation({
 *   exposes: {
 *     './viewerSlots': './src/slots/index.ts',
 *     // ...
 *   },
 * })
 * ```
 */
export const viewerSlots = moduleSlots;
export default moduleSlots;
