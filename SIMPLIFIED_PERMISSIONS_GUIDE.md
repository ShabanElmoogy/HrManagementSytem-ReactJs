# Simplified Permissions System Guide

The permissions system has been simplified while maintaining TypeScript benefits and backward compatibility.

## Key Features

✅ **Simple Structure**: Clean, easy-to-understand code  
✅ **TypeScript Support**: Type safety without complexity  
✅ **Backward Compatible**: Works with existing JavaScript code  
✅ **Easy to Use**: Intuitive hooks and helper functions  

## Basic Usage

### 1. Import Permissions

```typescript
// For new TypeScript components
import Permissions from "@/constants/appPermissions";

// For existing JavaScript components (backward compatible)
import { appPermissions } from "@/constants";
```

### 2. Use Permission Hooks

```typescript
import { useCountriesPermissions } from "@/shared/hooks/usePermissions";

const MyComponent = () => {
  const { canView, canCreate, canEdit, canDelete } = useCountriesPermissions();
  
  return (
    <div>
      {canView && <ViewButton />}
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </div>
  );
};
```

### 3. Generic Module Permissions

```typescript
import { useModulePermissions } from "@/shared/hooks/usePermissions";

const StatesComponent = () => {
  const permissions = useModulePermissions('States');
  
  return (
    <div>
      {permissions.canView && <StatesList />}
      {permissions.canCreate && <AddButton />}
    </div>
  );
};
```

### 4. Manual Permission Checking

```typescript
import { usePermissions } from "@/shared/hooks/usePermissions";

const MyComponent = () => {
  const { hasPermission, hasAnyPermission } = usePermissions();
  
  const canDeleteCountries = hasPermission("Countries:Delete");
  const canManageCountries = hasAnyPermission([
    "Countries:Create",
    "Countries:Edit",
    "Countries:Delete"
  ]);
  
  return <div>{/* Your component */}</div>;
};
```

## Available Permissions

All permissions follow the pattern: `Module:Action`

### Modules
- Addresses, AddressTypes, ApiKeys, Categories, Countries
- Districts, ChangeLogs, Localizations, ReportsCategories
- Roles, States, SubCategories, Users

### Actions
- View, Create, Edit, Delete
- Special case: ChangeLogs (View only)

## Examples

### DataGrid with Permissions

```typescript
const MyDataGrid = ({ data, onEdit, onDelete }) => {
  const permissions = useCountriesPermissions();

  const getActions = useCallback((params) => {
    const actions = [];
    
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
        <GridActionsCellItem
          icon={<Delete />}
          onClick={() => onDelete(params.row)}
        />
      );
    }
    
    return actions;
  }, [permissions]);

  return (
    <DataGrid
      rows={data}
      columns={columns}
      addNewRow={permissions.canCreate ? handleAdd : undefined}
    />
  );
};
```

### Form with Permissions

```typescript
const CountryForm = ({ country, onSave }) => {
  const { canEdit, canCreate } = useCountriesPermissions();
  
  const isReadOnly = country?.id ? !canEdit : !canCreate;

  return (
    <form>
      <TextField
        name="name"
        disabled={isReadOnly}
        value={country?.name || ''}
      />
      
      {!isReadOnly && (
        <Button onClick={onSave}>
          {country?.id ? 'Update' : 'Create'}
        </Button>
      )}
    </form>
  );
};
```

### Navigation with Permissions

```typescript
const Navigation = () => {
  const { hasPermission } = usePermissions();

  return (
    <nav>
      {hasPermission("Countries:View") && (
        <NavLink to="/countries">Countries</NavLink>
      )}
      {hasPermission("States:View") && (
        <NavLink to="/states">States</NavLink>
      )}
      {hasPermission("Users:View") && (
        <NavLink to="/users">Users</NavLink>
      )}
    </nav>
  );
};
```

## Migration from Old System

### Before (JavaScript)
```javascript
import { appPermissions } from "@/constants";

const canDelete = userPermissions.includes(appPermissions.DeleteCountries);
```

### After (TypeScript - Simplified)
```typescript
import { useCountriesPermissions } from "@/shared/hooks/usePermissions";

const { canDelete } = useCountriesPermissions();
```

## Helper Functions

```typescript
import { hasPermission, hasAnyPermission, hasAllPermissions } from "@/constants/appPermissions";

// Check single permission
const canView = hasPermission(userPermissions, "Countries:View");

// Check any of multiple permissions
const canManage = hasAnyPermission(userPermissions, [
  "Countries:Create",
  "Countries:Edit"
]);

// Check all permissions required
const isAdmin = hasAllPermissions(userPermissions, [
  "Users:View",
  "Users:Create",
  "Users:Edit",
  "Users:Delete"
]);
```

## Benefits of Simplified Version

1. **Less Code**: Removed complex enums and interfaces
2. **Easier to Understand**: Simple object structure
3. **Better Performance**: Fewer abstractions
4. **Backward Compatible**: Works with existing code
5. **Type Safe**: Still provides TypeScript benefits
6. **Easy to Extend**: Simple to add new permissions

## File Structure

```
src/
├── constants/
│   └── appPermissions.ts          # Simplified permissions
├── shared/
│   └── hooks/
│       └── usePermissions.ts      # Simplified hooks
└── features/
    └── countries/
        └── components/
            └── countriesDataGrid.tsx  # Example usage
```

This simplified system maintains all the benefits of TypeScript while being much easier to use and maintain!