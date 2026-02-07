# Test Infrastructure

This directory contains the test infrastructure for the cocos-skills CLI tool.

## Structure

```
cli/tests/
├── setup.ts                    # Global test setup
├── fixtures/
│   ├── scene-data.ts           # Mock scene/node/component data
│   └── mock-responses.ts       # Mock API responses
├── utils/
│   └── test-client.ts          # TestClient wrapper
├── unit/                       # Unit tests
│   └── client.test.ts          # Client tests
├── integration/                # Integration tests
└── e2e/                        # End-to-end tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run e2e tests only
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Test Utilities

### TestClient

The `TestClient` class wraps `CocosClient` with test-specific functionality:

```typescript
import { createTestClient } from '@test/utils/test-client.js';

const client = createTestClient({
  baseUrl: 'http://localhost:8080',
  mockMode: true,
  mockHandler: async (module, action, params) => {
    return { success: true, data: { result: 'ok' } };
  }
});

// Execute and track history
const result = await client.executeTest('scene', 'open-scene', ['db://assets/Test.scene']);

// Convenience methods
await client.executeAndExpectSuccess('scene', 'open-scene', ['db://assets/Test.scene']);
await client.executeAndExpectError('scene', 'open-scene', ['db://assets/Test.scene']);

// Get execution history
const history = client.getExecutionHistory();
const stats = client.getExecutionStats();
```

### Fixtures

Mock data for testing:

```typescript
import {
  TEST_SCENE_PATH,
  TEST_NODE_UUID,
  DEFAULT_MOCK_NODE,
  createMockNode,
} from '@test/fixtures/scene-data.js';

import {
  successResponse,
  errorResponse,
  mockOpenSceneResponse,
} from '@test/fixtures/mock-responses.js';
```

## Writing Tests

### Unit Tests

Test individual functions and classes in isolation:

```typescript
import { describe, it, expect } from 'vitest';
import { CocosClient } from '../../src/lib/client.js';

describe('CocosClient', () => {
  it('should create client with default config', () => {
    const client = new CocosClient();
    expect(client.getBaseUrl()).toBe('http://127.0.0.1:54321');
  });
});
```

### Integration Tests

Test multiple components working together:

```typescript
import { describe, it, expect } from 'vitest';
import { createTestClient } from '../utils/test-client.js';

describe('Scene Operations Integration', () => {
  it('should open and save scene', async () => {
    const client = createTestClient({ mockMode: true, mockHandler });
    await client.executeAndExpectSuccess('scene', 'open-scene', ['db://assets/Test.scene']);
    await client.executeAndExpectSuccess('scene', 'save-scene', []);
  });
});
```

### E2E Tests

Test full workflows against a real server:

```typescript
import { describe, it, expect } from 'vitest';
import { CocosClient } from '../../src/lib/client.js';

describe('Scene E2E', () => {
  it('should create node in scene', async () => {
    const client = new CocosClient();
    const result = await client.execute('scene', 'create-node', [
      JSON.stringify({ parent: 'Canvas', name: 'TestNode' })
    ]);
    expect(result.success).toBe(true);
  });
});
```

## Configuration

Vitest is configured in `cli/vitest.config.ts`:

- ESM support (Node16 modules)
- TypeScript support
- Test environment: node
- Coverage with v8
- Global utilities enabled
- Setup file: `cli/tests/setup.ts`

## CI/CD

Tests run automatically in CI. Ensure all tests pass before committing:

```bash
npm run test:unit
npm run test:integration
```

Coverage reports are generated in `coverage/` directory.
