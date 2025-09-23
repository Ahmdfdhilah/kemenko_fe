# Services Layer

This directory contains the service layer for API communication in application

## Architecture Overview

### Base Service Pattern
All services extend the `BaseService` class which provides:
- Consistent HTTP method wrappers (GET, POST, PUT, PATCH, DELETE)
- Type-safe request/response handling
- Automatic API endpoint prefixing


## Service Architecture

### 1. BaseService Class (`base/service.ts`)

The foundation class that all specific services extend:

```typescript
export abstract class BaseService {
  protected baseEndpoint: string;
  
  constructor(baseEndpoint: string) {
    this.baseEndpoint = `/api/v1${baseEndpoint}`;
  }
}
```

**Key Features:**
- **Type Safety**: Generic types for request/response handling

### 2. Service Implementation Pattern

Each service follows this consistent pattern:

```typescript
// Example: UserService
class UserService extends BaseService {
  constructor() {
    super("/users");  // API endpoint prefix
  }

  async getUsers(params?: UserFilterParams, options?: UserServiceOptions): Promise<UserListResponse> {
    return this.get(
      endpoint
    );
  }
}

export const userService = new UserService();
```

### 3. Type Definitions Pattern

Each service module includes comprehensive TypeScript types:

```typescript
// Domain types
export interface User {
  id: string;
  username: string;
  // ... other properties
}

// Request/Response types
export interface UserCreate { /* ... */ }
export interface UserUpdate { /* ... */ }
export interface UserResponse { /* ... */ }
export interface UserListResponse { /* ... */ }

```

## Usage Examples

### Basic Service Usage

```typescript
import { userService, UserCreate } from '@/services';

// Get current user
const currentUser = await userService.getCurrentUser();

// Create new user 
const newUserData: UserCreate = {
  nama_lengkap: "John Doe",
  email: "john@example.com",
  // ... other fields
};

const createdUser = await userService.createUser(newUserData);
```

## Error Handling

The BaseService provides consistent error handling:

1. **HTTP Errors**: Automatically caught and parsed
2. **Error Messages**: Extracted from API response or fallback to generic messages
3. **Error Propagation**: Errors re-thrown for component-level handling

```typescript
// Error handling example
try {
  await userService.createUser(userData);
} catch (error) {
  // Additional error handling if needed
  console.error("User creation failed:", error.message);
}
```

## Adding New Services

To add a new service, follow this pattern:

1. **Create service directory**: `services/newService/`

2. **Define types** (`types.ts`):
```typescript
export interface NewEntity {
  id: string;
  name: string;
}

export interface NewEntityCreate {
  name: string;
}

export interface NewEntityServiceOptions extends ServiceOptions {
  // Additional options if needed
}
```

3. **Implement service** (`service.ts`):
```typescript
import { BaseService } from "../base";

class NewEntityService extends BaseService {
  constructor() {
    super("/new-entity");
  }

  async getEntities(options?: NewEntityServiceOptions) {
    return this.get("/", undefined, errorConfig, options);
  }
}

export const newEntityService = new NewEntityService();
```

4. **Export from index** (`index.ts`):
```typescript
export { newEntityService } from "./service";
export type * from "./types";
```

5. **Add to main exports** (`services/index.ts`):
```typescript
export { newEntityService } from "./newEntity";
export type { NewEntity, NewEntityCreate } from "./newEntity";
```

## Best Practices

1. **Type Safety**: Always define comprehensive TypeScript types
2. **Consistent Naming**: Follow the established naming conventions
3. **Service Options**: Support options parameter for flexibility
4. **Documentation**: Include JSDoc comments for complex methods
5. **Testing**: Write unit tests for service methods (when applicable)

## Common Patterns

### File Upload Services
Several services support file uploads with consistent patterns:

```typescript
async uploadFile(entityId: string, file: File, options?: ServiceOptions) {
  const formData = new FormData();
  formData.append('file', file);
  
  return this.post(
    `/${entityId}/upload`,
    formData,
    { title: "Success", description: "File uploaded successfully" },
    { title: "Error", description: "Failed to upload file" },
    options
  );
}
```

### Statistics Methods
Many services provide statistics endpoints:

```typescript
async getStatistics(options?: ServiceOptions) {
  return this.get(
    "/statistics",
    undefined,
    { title: "Error", description: "Failed to get statistics" },
    options
  );
}
```

This service layer provides a robust, type-safe foundation for API communication while maintaining consistency and developer experience across the application.