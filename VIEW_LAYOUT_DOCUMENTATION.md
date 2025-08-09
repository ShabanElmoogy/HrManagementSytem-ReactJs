# View Layout State Management Documentation

This documentation explains how to implement and use the view layout state saving functionality in the HR Management System.

## Overview

The view layout system allows users to switch between different view modes (grid, list, compact list) and automatically saves their preferences to localStorage. The system includes:

- **Basic Hook**: `useViewLayout` - Simple view layout management
- **Enhanced Hook**: `useViewLayoutEnhanced` - Advanced features with responsive defaults
- **Global Context**: `ViewLayoutContext` - Application-wide layout management
- **Utility Manager**: `ViewLayoutManager` - Bulk operations and statistics
- **Settings Component**: `ViewLayoutSettings` - User interface for managing preferences

## Quick Start

### 1. Basic Implementation

```jsx
import { useViewLayout } from "@/shared/hooks";
import { MyHeaderMultiViews } from "@/shared/components";

const MyPage = () => {
  // Basic view layout with localStorage persistence
  const [viewLayout, handleViewLayoutChange] = useViewLayout(
    "my-page-view-layout", // Storage key
    "grid", // Default layout
    ["grid", "list", "smallList"] // Valid layouts
  );

  return (
    <div>
      <MyHeaderMultiViews
        viewLayout={viewLayout}
        handleViewLayoutChange={handleViewLayoutChange}
        handleAddNew={() => {/* Add new item */}}
      />
      
      {/* Render different views based on layout */}
      {viewLayout === "grid" && <GridView />}
      {viewLayout === "list" && <ListView />}
      {viewLayout === "smallList" && <CompactView />}
    </div>
  );
};
```

### 2. Enhanced Implementation

```jsx
import { useViewLayoutEnhanced } from "@/shared/hooks";
import { useMediaQuery, useTheme } from "@mui/material";

const MyEnhancedPage = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  const {
    viewLayout,
    handleViewLayoutChange,
    setLayout,
    resetLayout,
    layoutInfo,
  } = useViewLayoutEnhanced(
    "my-page-enhanced-layout",
    "grid",
    ["grid", "list", "smallList"],
    {
      autoSaveDelay: 500, // Delay saving to prevent excessive writes
      getResponsiveDefault: () => {
        if (isSm) return "smallList";
        if (isMd) return "list";
        return "grid";
      },
      onLayoutChange: (newLayout, oldLayout) => {
        console.log(`Layout changed: ${oldLayout} → ${newLayout}`);
      },
      debug: true, // Enable debug logging
    }
  );

  return (
    <div>
      <MyHeaderMultiViews
        viewLayout={viewLayout}
        handleViewLayoutChange={handleViewLayoutChange}
        handleAddNew={() => {/* Add new item */}}
      />
      
      {/* Debug info */}
      <div>Current: {layoutInfo.current}, Is Default: {layoutInfo.isDefault}</div>
      
      {/* Programmatic controls */}
      <button onClick={() => setLayout("list")}>Force List View</button>
      <button onClick={resetLayout}>Reset to Default</button>
      
      {/* Views */}
      {renderView(viewLayout)}
    </div>
  );
};
```

### 3. Global Context Implementation

```jsx
import { ViewLayoutProvider, useViewLayoutContext } from "@/shared/contexts/ViewLayoutContext";

// Wrap your app with the provider
const App = () => (
  <ViewLayoutProvider>
    <MyApplication />
  </ViewLayoutProvider>
);

// Use in components
const MyComponent = () => {
  const {
    globalPreferences,
    layoutStats,
    createViewLayoutHook,
    clearAllLayouts,
  } = useViewLayoutContext();

  // Create a configured hook
  const hookConfig = createViewLayoutHook("my-component-layout");
  
  return (
    <div>
      <p>Total saved layouts: {layoutStats?.total}</p>
      <button onClick={clearAllLayouts}>Clear All Preferences</button>
    </div>
  );
};
```

## API Reference

### useViewLayout(storageKey, defaultLayout, validLayouts)

Basic hook for view layout management.

**Parameters:**
- `storageKey` (string): Unique key for localStorage
- `defaultLayout` (string): Default layout when none is saved
- `validLayouts` (array): Array of valid layout options

**Returns:**
- `[viewLayout, handleViewLayoutChange]`: Current layout and change handler

### useViewLayoutEnhanced(storageKey, defaultLayout, validLayouts, options)

Enhanced hook with additional features.

**Options:**
- `autoSaveDelay` (number): Delay before saving to localStorage (default: 0)
- `getResponsiveDefault` (function): Function to determine responsive default
- `onLayoutChange` (function): Callback when layout changes
- `debug` (boolean): Enable debug logging

**Returns:**
- `viewLayout` (string): Current layout
- `layoutInfo` (object): Layout information and metadata
- `handleViewLayoutChange` (function): Event handler for layout changes
- `setLayout` (function): Programmatically set layout
- `resetLayout` (function): Reset to default layout
- `clearSavedLayout` (function): Clear saved preference
- `isValidLayout` (function): Validate layout option

### ViewLayoutManager

Utility class for bulk operations.

**Methods:**
- `getAllSavedLayouts()`: Get all saved layouts
- `clearAllLayouts()`: Clear all saved layouts
- `exportPreferences()`: Export preferences as JSON
- `importPreferences(jsonData)`: Import preferences from JSON
- `getStatistics()`: Get usage statistics

### ViewLayoutContext

Global context for application-wide layout management.

**Provides:**
- `globalPreferences`: Global settings
- `layoutStats`: Usage statistics
- `breakpoints`: Current responsive breakpoints
- `createViewLayoutHook()`: Create configured hooks
- `clearAllLayouts()`: Clear all preferences
- `exportPreferences()`: Export all preferences
- `importPreferences()`: Import preferences

## Storage Keys

Storage keys should follow this pattern:
```
{prefix}-view-layout-{module}-{page}-{userId?}
```

Examples:
- `hr-system-view-layout-countries`
- `hr-system-view-layout-users-admin-123`
- `app-view-layout-dashboard-main`

## Responsive Behavior

The system supports responsive defaults:

```jsx
const getResponsiveDefault = () => {
  if (isSm) return "smallList"; // Mobile: compact view
  if (isMd) return "list";      // Tablet: detailed list
  return "grid";                // Desktop: grid view
};
```

## Best Practices

### 1. Use Descriptive Storage Keys
```jsx
// Good
const [viewLayout] = useViewLayout("countries-admin-view");

// Bad
const [viewLayout] = useViewLayout("view1");
```

### 2. Implement Responsive Defaults
```jsx
const {viewLayout} = useViewLayoutEnhanced(
  "my-page-layout",
  "grid",
  ["grid", "list", "smallList"],
  {
    getResponsiveDefault: () => {
      if (isMobile) return "smallList";
      return "grid";
    }
  }
);
```

### 3. Handle Loading States
```jsx
const renderView = () => {
  if (loading) return <LoadingSpinner />;
  
  switch (viewLayout) {
    case "grid": return <GridView items={items} />;
    case "list": return <ListView items={items} />;
    default: return <GridView items={items} />;
  }
};
```

### 4. Provide Fallbacks
```jsx
const validLayouts = ["grid", "list", "smallList"];
const [viewLayout] = useViewLayout(
  "my-page-layout",
  "grid", // Fallback default
  validLayouts
);

// Always validate before rendering
const safeLayout = validLayouts.includes(viewLayout) ? viewLayout : "grid";
```

## Examples

### Complete Page Implementation

See the example files:
- `countriesPageWithViews.jsx` - Basic implementation
- `countriesPageAdvanced.jsx` - Advanced implementation with all features

### Settings Management

Use the `ViewLayoutSettings` component to provide users with a settings interface:

```jsx
import ViewLayoutSettings from "@/shared/components/common/settings/ViewLayoutSettings";

const SettingsPage = () => (
  <ViewLayoutProvider>
    <ViewLayoutSettings />
  </ViewLayoutProvider>
);
```

## Troubleshooting

### Layout Not Persisting
- Check if localStorage is available
- Verify storage key uniqueness
- Check browser storage limits

### Responsive Defaults Not Working
- Ensure `getResponsiveDefault` function is provided
- Check breakpoint detection
- Verify `useResponsiveDefaults` is enabled

### Performance Issues
- Increase `autoSaveDelay` to reduce localStorage writes
- Use `useViewLayout` instead of `useViewLayoutEnhanced` for simple cases
- Implement proper loading states

## Migration Guide

### From No View Layout System
1. Install the hooks and components
2. Replace static views with dynamic rendering
3. Add `MyHeaderMultiViews` component
4. Test with different layouts

### From Basic to Enhanced
1. Replace `useViewLayout` with `useViewLayoutEnhanced`
2. Add responsive defaults
3. Configure auto-save delay
4. Add layout change callbacks

## Browser Support

- **localStorage**: All modern browsers
- **Responsive breakpoints**: Requires CSS media query support
- **Auto-save**: Uses setTimeout (all browsers)

## Security Considerations

- localStorage data is domain-specific
- No sensitive data is stored
- User preferences only affect UI, not data access
- Clear preferences on logout if needed

## Performance Impact

- **Memory**: Minimal (few KB per page)
- **Storage**: ~50-100 bytes per saved layout
- **Network**: No network requests
- **Rendering**: Negligible impact with proper implementation