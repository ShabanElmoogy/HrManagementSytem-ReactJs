# Permissions Best Practices Guide

This guide demonstrates the best practices for implementing the new TypeScript permission system in your HR Management application.

## Overview

The new permission system provides:
- **Type Safety**: Full TypeScript support with enums and interfaces
- **Reusable Hooks**: Custom hooks for permission checking
- **Better Performance**: Memoized permission checks
- **Enhanced Developer Experience**: IntelliSense and auto-completion

## Key Components

### 1. Permission Types (`src/constants/appPermissions.ts`)
- `PermissionEnum`: Enum with all available permissions
- `PermissionString`: Union type for permission strings
- `PermissionModule`: Union type for module names
- Helper functions: `hasPermission`, `hasAnyPermission`, `hasAllPermissions`

### 2. Custom Hooks (`src/shared/hooks/usePermissions.ts`)
- `usePermissions`: General permission hook
- `useCountriesPermissions`: Specialized hook for Countries module
- `createModulePermissionsHook`: Factory for creating module-specific hooks

## Implementation Examples

### 1. Basic Permission Check in Component

```typescript
import { useCountriesPermissions } from "@/shared/hooks/usePermissions";

const MyComponent = () => {
  const permissions = useCountriesPermissions();
  
  return (
    <div>
      {permissions.canView && <ViewButton />}
      {permissions.canEdit && <EditButton />}
      {permissions.canDelete && <DeleteButton />}
    </div>
  );
};
```

### 2. DataGrid Implementation (Countries Example)

```typescript
import { useCountriesPermissions } from "@/shared/hooks/usePermissions";
import { PermissionEnum } from "@/constants/appPermissions";

const CountriesDataGrid = ({ countries, onEdit, onDelete, onView }) => {
  const permissions = useCountriesPermissions();

  const getActions = useCallback((params) => {
    const actions = [];

    if (permissions.canView) {
      actions.push(
        <GridActionsCellItem
          icon={<Visibility />}
          onClick={() => onView(params.row)}
        />
      );
    }

    if (permissions.canEdit) {
      actions.push(
        <GridActionsCellItem
          icon={<Edit />}
          onClick={() => onEdit(params.row)}
        />
      );
    }

    if (permissions.canDelete) {
      actions.push(
        <AuthorizeView requiredPermissions={[PermissionEnum.DeleteCountries]}>
          <GridActionsCellItem
            icon={<Delete />}
            onClick={() => onDelete(params.row)}
          />
        </AuthorizeView>
      );
    }

    return actions;
  }, [permissions, onView, onEdit, onDelete]);

  // Only show actions column if user has any permissions
  const columns = useMemo(() => {
    const baseColumns = [/* your columns */];
    
    if (permissions.canView || permissions.canEdit || permissions.canDelete) {
      baseColumns.push({
        field: "actions",
        type: "actions",
        getActions,
      });
    }
    
    return baseColumns;
  }, [permissions, getActions]);

  return (
    <DataGrid
      columns={columns}
      addNewRow={permissions.canCreate ? handleAdd : undefined}
    />
  );
};
```

### 3. Form Components with Permissions

```typescript
import { usePermissions } from "@/shared/hooks/usePermissions";
import { PermissionEnum } from "@/constants/appPermissions";

const CountryForm = ({ country, onSave }) => {
  const { hasPermission } = usePermissions();
  
  const canEdit = hasPermission(PermissionEnum.EditCountries);
  const canCreate = hasPermission(PermissionEnum.CreateCountries);
  
  const isReadOnly = country?.id ? !canEdit : !canCreate;

  return (
    <form>
      <TextField
        name="name"
        disabled={isReadOnly}
        value={country?.name || ''}
      />
      
      {!isReadOnly && (
        <Button type="submit" onClick={onSave}>
          {country?.id ? 'Update' : 'Create'}
        </Button>
      )}
    </form>
  );
};
```

### 4. Navigation/Menu with Permissions

```typescript
import { usePermissions } from "@/shared/hooks/usePermissions";

const NavigationMenu = () => {
  const { canViewModule } = usePermissions();

  return (
    <nav>
      {canViewModule('Countries') && (
        <NavLink to="/countries">Countries</NavLink>
      )}
      {canViewModule('States') && (
        <NavLink to="/states">States</NavLink>
      )}
      {canViewModule('Users') && (
        <NavLink to="/users">Users</NavLink>
      )}
    </nav>
  );
};
```

### 5. Creating Module-Specific Hooks

```typescript
// For States module
export const useStatesPermissions = createModulePermissionsHook('States');

// Usage in component
const StatesComponent = () => {
  const permissions = useStatesPermissions();
  
  return (
    <div>
      {permissions.canView && <StatesList />}
      {permissions.canCreate && <AddStateButton />}
    </div>
  );
};
```

## Best Practices

### 1. Use Specialized Hooks
```typescript
// ✅ Good - Use specialized hooks for better performance
const permissions = useCountriesPermissions();

// ❌ Avoid - Generic hook when specialized one exists
const { getModulePermissions } = usePermissions();
const permissions = getModulePermissions('Countries');
```

### 2. Memoize Permission Checks
```typescript
// ✅ Good - Memoized actions
const getActions = useCallback((params) => {
  // actions logic
}, [permissions, handlers]);

// ❌ Avoid - Creating new functions on every render
const getActions = (params) => {
  // actions logic - recreated every render
};
```

### 3. Conditional Rendering vs AuthorizeView
```typescript
// ✅ Use conditional rendering for performance
{permissions.canDelete && <DeleteButton />}

// ✅ Use AuthorizeView for complex permission logic
<AuthorizeView requiredPermissions={[PermissionEnum.DeleteCountries]}>
  <DeleteButton />
</AuthorizeView>
```

### 4. Handle Loading States
```typescript
const MyComponent = () => {
  const { isAuthenticated, canView } = usePermissions();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  if (!canView) {
    return <AccessDenied />;
  }
  
  return <ComponentContent />;
};
```

### 5. Type Safety
```typescript
// ✅ Good - Use enums for type safety
hasPermission(PermissionEnum.ViewCountries)

// ❌ Avoid - String literals (prone to typos)
hasPermission("Countries:View")
```

## Migration from Old System

### Step 1: Update Imports
```typescript
// Old
import { appPermissions } from "@/constants";

// New
import { PermissionEnum, useCountriesPermissions } from "@/constants/appPermissions";
```

### Step 2: Replace Permission Checks
```typescript
// Old
const canDelete = userPermissions.includes(appPermissions.DeleteCountries);

// New
const { canDelete } = useCountriesPermissions();
```

### Step 3: Update AuthorizeView Usage
```typescript
// Old
<AuthorizeView requiredPermissions={[appPermissions.DeleteCountries]}>

// New
<AuthorizeView requiredPermissions={[PermissionEnum.DeleteCountries]}>
```

## Performance Considerations

1. **Use Specialized Hooks**: They're optimized for specific modules
2. **Memoize Callbacks**: Prevent unnecessary re-renders
3. **Conditional Column Rendering**: Only show action columns when needed
4. **Lazy Permission Checks**: Check permissions only when needed

## Testing Permissions

```typescript
// Mock permissions in tests
const mockPermissions = {
  canView: true,
  canEdit: false,
  canDelete: false,
  canCreate: true,
};

jest.mock('@/shared/hooks/usePermissions', () => ({
  useCountriesPermissions: () => mockPermissions,
}));
```

## Common Patterns

### 1. Bulk Actions with Permissions
```typescript
const BulkActions = ({ selectedItems }) => {
  const { canDelete, canEdit } = useCountriesPermissions();
  
  return (
    <div>
      {canEdit && <BulkEditButton items={selectedItems} />}
      {canDelete && <BulkDeleteButton items={selectedItems} />}
    </div>
  );
};
```

### 2. Dynamic Form Fields
```typescript
const DynamicForm = () => {
  const { canEdit } = useCountriesPermissions();
  
  const fields = useMemo(() => {
    const baseFields = [/* basic fields */];
    
    if (canEdit) {
      baseFields.push(/* admin fields */);
    }
    
    return baseFields;
  }, [canEdit]);
  
  return <FormRenderer fields={fields} />;
};
```

This new system provides better type safety, performance, and developer experience while maintaining backward compatibility with the existing AuthorizeView component.