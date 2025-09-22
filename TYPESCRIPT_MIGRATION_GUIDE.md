# TypeScript Migration Guide

This guide will help you gradually convert your HR Management System from JavaScript to TypeScript.

## Configuration Files

- `tsconfig.json` - Main TypeScript configuration with lenient settings for gradual migration
- `tsconfig.strict.json` - Strict configuration to use once files are converted
- `src/types/index.ts` - Common type definitions for the project

## Migration Strategy

### Phase 1: Setup (✅ Complete)
- [x] Install TypeScript and type definitions
- [x] Create TypeScript configuration files
- [x] Set up common type definitions
- [x] Configure build tools

### Phase 2: Gradual File Conversion
Convert files in this order for best results:

1. **Utility files first** (`src/utils/`)
   - These are usually pure functions with clear inputs/outputs
   - Start with: `src/utils/constants.js` → `src/utils/constants.ts`

2. **Type definitions and interfaces** (`src/types/`)
   - Create specific type files for different modules
   - Example: `src/types/employee.ts`, `src/types/auth.ts`

3. **Service/API files** (`src/services/`)
   - API calls benefit greatly from TypeScript
   - Define request/response types

4. **Store/State management** (`src/store/`)
   - Type your Zustand stores for better state management

5. **Hooks** (`src/hooks/`)
   - Custom hooks with proper typing

6. **Components** (start with leaf components)
   - Convert smaller, reusable components first
   - Then move to larger, more complex components

### Phase 3: Enable Strict Mode
Once most files are converted:
1. Update `tsconfig.json` to use stricter settings
2. Fix any remaining type issues
3. Enable additional strict checks

## File Conversion Process

### 1. Rename Files
```bash
# Rename .js files to .ts (for non-React files)
mv src/utils/helpers.js src/utils/helpers.ts

# Rename .jsx files to .tsx (for React components)
mv src/components/Button.jsx src/components/Button.tsx
```

### 2. Add Type Annotations

#### Before (JavaScript):
```javascript
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const Button = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

#### After (TypeScript):
```typescript
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString();
};

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

### 3. Import Types
```typescript
import { User, Employee, ApiResponse } from '@/types';
import type { ComponentProps } from 'react';
```

## Common Patterns

### API Calls
```typescript
import { ApiResponse, Employee } from '@/types';

export const fetchEmployees = async (): Promise<ApiResponse<Employee[]>> => {
  const response = await fetch('/api/employees');
  return response.json();
};
```

### React Components
```typescript
import React from 'react';
import { Employee } from '@/types';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onEdit,
  onDelete
}) => {
  return (
    <div className="employee-card">
      <h3>{employee.firstName} {employee.lastName}</h3>
      <p>{employee.position}</p>
      <button onClick={() => onEdit(employee.id)}>Edit</button>
      <button onClick={() => onDelete(employee.id)}>Delete</button>
    </div>
  );
};
```

### Zustand Store
```typescript
import { create } from 'zustand';
import { User, AuthState } from '@/types';

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: (user, token) => set({
    user,
    token,
    isAuthenticated: true,
    isLoading: false
  }),
  
  logout: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
  }),
  
  setLoading: (isLoading) => set({ isLoading })
}));
```

## NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",
    "type-check:strict": "tsc --noEmit -p tsconfig.strict.json"
  }
}
```

## Tips for Gradual Migration

1. **Start Small**: Convert utility functions and constants first
2. **Use `any` Temporarily**: It's okay to use `any` initially and refine types later
3. **Leverage IDE**: Use VS Code's TypeScript support for auto-completion and error detection
4. **Test Frequently**: Run `npm run type-check` regularly to catch issues early
5. **Document Types**: Add JSDoc comments for complex types
6. **Use Type Guards**: Create type guard functions for runtime type checking

## Common Issues and Solutions

### Issue: "Cannot find module" errors
**Solution**: Add proper type declarations or use `declare module` statements

### Issue: Complex prop types
**Solution**: Break down into smaller interfaces and use composition

### Issue: Third-party library types
**Solution**: Install `@types/library-name` or create custom declarations

### Issue: Event handlers
**Solution**: Use React's built-in event types:
```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // handle click
};
```

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)

## Progress Tracking

Create a checklist to track your migration progress:

- [ ] Utils converted
- [ ] Types defined
- [ ] Services converted
- [ ] Store converted
- [ ] Hooks converted
- [ ] Components converted
- [ ] Strict mode enabled
- [ ] All type errors resolved