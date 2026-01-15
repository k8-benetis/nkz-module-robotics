# NKZ Module Template

**Production-Ready Template** for creating NKZ Platform (Nekazari) modules.

Get your module running in 5 minutes! 🚀

## Quick Start

```bash
# Clone this template
git clone https://github.com/k8-benetis/nkz-module-template.git my-module
cd my-module

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## What's Included

- ✅ Complete "Hello World" example
- ✅ **SDK packages from NPM** (`@nekazari/sdk`, `@nekazari/ui-kit`)
- ✅ All dependencies pre-configured
- ✅ TypeScript setup with full type support
- ✅ Tailwind CSS configured
- ✅ Vite proxy for API calls (development)
- ✅ Module Federation configured
- ✅ Slot system for Unified Viewer integration

---

## Module Structure

```
my-module/
├── src/
│   ├── App.tsx                 # Main module component (standalone page)
│   ├── components/
│   │   └── slots/              # Slot components for Unified Viewer
│   ├── slots/
│   │   └── index.ts            # Slot registration (IMPORTANT!)
│   └── services/
│       └── api.ts              # API client using SDK
├── assets/
│   └── icon.png                # Module icon (128x128px)
├── manifest.json               # Module metadata (IMPORTANT!)
├── vite.config.ts              # Module Federation config
└── package.json
```

---

## Slots System

Modules can integrate with the **Unified Viewer** (`/entities` page) by providing widgets for specific slots.

### Available Slots

| Slot | Location | Use Case |
|------|----------|----------|
| `layer-toggle` | Layer manager dropdown | Toggle module layers on/off |
| `context-panel` | Right panel | Show details when entity is selected |
| `bottom-panel` | Bottom panel | Timelines, charts, temporal controls |
| `entity-tree` | Left panel | Custom entity lists or filters |
| `map-layer` | Map overlays | Cesium layers, markers, overlays |

### Registering Slots

Edit `src/slots/index.ts`:

```typescript
import { MyLayerToggle } from '../components/slots/MyLayerToggle';
import { MyContextPanel } from '../components/slots/MyContextPanel';

// IMPORTANT: Set this to match your module ID in manifest.json
const MODULE_ID = 'my-module';

export const viewerSlots = {
  'layer-toggle': [
    {
      id: 'my-module-layer-toggle',
      moduleId: MODULE_ID,  // REQUIRED for all slots
      component: 'MyLayerToggle',
      priority: 50,
      localComponent: MyLayerToggle,
    }
  ],
  'context-panel': [
    {
      id: 'my-module-context',
      moduleId: MODULE_ID,
      component: 'MyContextPanel',
      priority: 50,
      localComponent: MyContextPanel,
      // Only show when specific entity types are selected
      showWhen: {
        entityType: ['AgriParcel']
      }
    }
  ],
  'bottom-panel': [],
  'entity-tree': [],
  'map-layer': [],
};
```

### Slot Widget Interface

```typescript
interface SlotWidgetDefinition {
  id: string;                    // Unique ID (prefix with module name)
  moduleId: string;              // REQUIRED: Your module ID
  component: string;             // Component name (for logging)
  priority: number;              // Lower = renders first
  localComponent: React.FC;      // The actual component
  defaultProps?: Record<string, any>;
  showWhen?: {
    entityType?: string[];       // Show for specific entity types
    layerActive?: string[];      // Show when specific layers are active
  };
}
```

---

## Manifest.json

The `manifest.json` file defines all module metadata.

### Required Fields

```json
{
  "id": "my-module",              // Unique module identifier
  "name": "my-module",            // Internal name
  "display_name": "My Module",    // User-facing name
  "version": "1.0.0",
  "route_path": "/my-module",     // URL path for standalone page
  "label": "My Module",           // Sidebar label
  "icon": "leaf"                  // Lucide icon name (optional)
}
```

### Navigation Configuration

```json
{
  "navigation": {
    "sidebar": {
      "enabled": true,           // Show in sidebar
      "priority": 50,            // Order (lower = higher)
      "section": "addons"        // "addons" section in sidebar
    }
  }
}
```

### Slots Declaration (for documentation)

```json
{
  "slots": {
    "layer-toggle": [
      {
        "id": "my-module-layer",
        "component": "MyLayerToggle"
      }
    ],
    "context-panel": [],
    "bottom-panel": []
  }
}
```

---

## SDK Usage

### API Calls

```typescript
import { NKZClient } from '@nekazari/sdk';

const client = new NKZClient({
  baseUrl: '/api',
  getToken: () => localStorage.getItem('token'),
  getTenantId: () => localStorage.getItem('tenantId'),
});

// GET request
const data = await client.get('/my-module/items');

// POST request
await client.post('/my-module/items', { name: 'New Item' });
```

### Viewer Context

```typescript
import { useViewer } from '@nekazari/sdk';

const MySlot = () => {
  const {
    selectedEntityId,    // Currently selected entity
    selectedEntityType,  // Type of selected entity
    isLayerActive,       // Check if a layer is active
    currentDate,         // Current date in viewer
  } = useViewer();

  return (
    <div>
      Selected: {selectedEntityId}
    </div>
  );
};
```

### UI Components

```typescript
import { Button, Card, Input } from '@nekazari/ui-kit';

const MyComponent = () => (
  <Card padding="lg" className="shadow-md">
    <Input label="Name" placeholder="Enter name..." />
    <Button variant="primary">Submit</Button>
  </Card>
);
```

---

## Development Workflow

### 1. Local Development

```bash
npm run dev
```

Opens at `http://localhost:5003`. The Vite proxy forwards `/api` calls to the platform backend.

### 2. Testing with Platform

Set environment variables for API connection:

```env
VITE_API_BASE_URL=https://nkz.artotxiki.com
```

### 3. Building for Production

```bash
npm run build
```

Creates `dist/` with:
- `assets/remoteEntry.js` - Module Federation entry
- Bundle files for the module

### 4. Packaging

```bash
zip -r my-module-v1.0.0.zip \
  manifest.json package.json vite.config.ts \
  src/ assets/ dist/
```

---

## Support

- **Email**: developers@nekazari.com
- **Documentation**: [Developer Guide](https://github.com/k8-benetis/nekazari-public/blob/main/docs/EXTERNAL_DEVELOPER_GUIDE.md)

---

## SDK Packages

This template uses **publicly available** SDK packages from NPM:

- **`@nekazari/sdk`** - API client, authentication, i18n
- **`@nekazari/ui-kit`** - UI components (Button, Card, Input, etc.)

Both packages are licensed under **Apache-2.0**.

**NPM Links**:
- SDK: https://www.npmjs.com/package/@nekazari/sdk
- UI-Kit: https://www.npmjs.com/package/@nekazari/ui-kit

---

**Happy Coding!** 🎉
