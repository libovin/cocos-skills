/**
 * Unit tests for validator module
 * Tests for validator.ts module
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  validateModuleAction,
  isModuleKnown,
  isActionKnown,
  listAllModules,
  listModuleActions,
  invalidateCache,
} from '../../src/lib/validator.js';
import { VALID_MODULES } from '../../src/types.js';

describe('validateModuleAction', () => {
  afterEach(() => {
    // Clear cache after each test
    invalidateCache();
  });

  describe('with known module and action', () => {
    it('should not throw for valid scene actions', () => {
      const sceneActions = VALID_MODULES.scene;
      expect(sceneActions.length).toBe(53);

      // Test a few key actions
      expect(() => validateModuleAction('scene', 'open-scene', false)).not.toThrow();
      expect(() => validateModuleAction('scene', 'save-scene', false)).not.toThrow();
      expect(() => validateModuleAction('scene', 'create-node', false)).not.toThrow();
      expect(() => validateModuleAction('scene', 'remove-node', false)).not.toThrow();
      expect(() => validateModuleAction('scene', 'set-property', false)).not.toThrow();
      expect(() => validateModuleAction('scene', 'query-node', false)).not.toThrow();
    });

    it('should not throw for valid asset-db actions', () => {
      expect(() => validateModuleAction('asset-db', 'create-asset', false)).not.toThrow();
      expect(() => validateModuleAction('asset-db', 'import-asset', false)).not.toThrow();
      expect(() => validateModuleAction('asset-db', 'query-asset-info', false)).not.toThrow();
      expect(() => validateModuleAction('asset-db', 'delete-asset', false)).not.toThrow();
    });

    it('should not throw for valid project actions', () => {
      expect(() => validateModuleAction('project', 'open-settings', false)).not.toThrow();
      expect(() => validateModuleAction('project', 'query-config', false)).not.toThrow();
      expect(() => validateModuleAction('project', 'set-config', false)).not.toThrow();
    });

    it('should not throw for valid builder actions', () => {
      expect(() => validateModuleAction('builder', 'open', false)).not.toThrow();
      expect(() => validateModuleAction('builder', 'query-worker-ready', false)).not.toThrow();
    });

    it('should not throw for valid engine actions', () => {
      expect(() => validateModuleAction('engine', 'query-info', false)).not.toThrow();
      expect(() => validateModuleAction('engine', 'query-engine-info', false)).not.toThrow();
    });

    it('should not throw for valid information actions', () => {
      expect(() => validateModuleAction('information', 'query-information', false)).not.toThrow();
      expect(() => validateModuleAction('information', 'open-information-dialog', false)).not.toThrow();
      expect(() => validateModuleAction('information', 'has-dialog', false)).not.toThrow();
      expect(() => validateModuleAction('information', 'close-dialog', false)).not.toThrow();
    });

    it('should not throw for valid preferences actions', () => {
      expect(() => validateModuleAction('preferences', 'open-settings', false)).not.toThrow();
      expect(() => validateModuleAction('preferences', 'query-config', false)).not.toThrow();
      expect(() => validateModuleAction('preferences', 'set-config', false)).not.toThrow();
    });

    it('should not throw for valid program actions', () => {
      expect(() => validateModuleAction('program', 'query-program-info', false)).not.toThrow();
      expect(() => validateModuleAction('program', 'open-program', false)).not.toThrow();
      expect(() => validateModuleAction('program', 'open-url', false)).not.toThrow();
    });

    it('should not throw for valid programming actions', () => {
      expect(() => validateModuleAction('programming', 'query-shared-settings', false)).not.toThrow();
      expect(() => validateModuleAction('programming', 'query-sorted-plugins', false)).not.toThrow();
    });

    it('should not throw for valid server actions', () => {
      expect(() => validateModuleAction('server', 'query-ip-list', false)).not.toThrow();
      expect(() => validateModuleAction('server', 'query-port', false)).not.toThrow();
    });

    it('should not throw for valid device actions', () => {
      expect(() => validateModuleAction('device', 'query', false)).not.toThrow();
    });

    it('should not throw for valid extension actions', () => {
      expect(() => validateModuleAction('extension', 'create-extension-template', false)).not.toThrow();
    });

    it('should recognize all 53 scene actions from VALID_MODULES.scene', () => {
      const sceneActions = VALID_MODULES.scene;
      expect(sceneActions.length).toBe(53);

      // Verify all scene actions are recognized
      sceneActions.forEach((action) => {
        expect(() => validateModuleAction('scene', action, false)).not.toThrow();
      });
    });

    it('should recognize all 21 asset-db actions', () => {
      const assetDbActions = VALID_MODULES['asset-db'];
      expect(assetDbActions.length).toBe(21);

      // Verify all asset-db actions are recognized
      assetDbActions.forEach((action) => {
        expect(() => validateModuleAction('asset-db', action, false)).not.toThrow();
      });
    });
  });

  describe('with unknown module', () => {
    it('should throw error when fetchFromServer is false', () => {
      expect(() => validateModuleAction('invalid-module', 'some-action', false)).toThrow(
        /Invalid module or action: invalid-module some-action/
      );
    });

    it('should throw error with available modules listed when fetchFromServer is true', () => {
      expect(() => validateModuleAction('invalid-module', 'some-action', true)).toThrow(
        /Invalid module: 'invalid-module'/
      );
    });
  });

  describe('with unknown action', () => {
    it('should throw error for known module but unknown action when fetchFromServer is false', () => {
      expect(() => validateModuleAction('scene', 'invalid-action', false)).toThrow(
        /Invalid module or action: scene invalid-action/
      );
    });

    it('should throw error with available actions listed when fetchFromServer is true', () => {
      // The error message will list available modules/actions from the cache
      expect(() => validateModuleAction('scene', 'invalid-action', true)).toThrow();
    });
  });

  describe('with fetchFromServer parameter', () => {
    it('should pass validation without fetching from server when fetchFromServer is false and action is valid', () => {
      expect(() => validateModuleAction('scene', 'create-node', false)).not.toThrow();
    });

    it('should not fetch from server when fetchFromServer is false and action is invalid', () => {
      expect(() => validateModuleAction('scene', 'invalid-action', false)).toThrow();
    });

    it('should use cached modules when available', () => {
      // First call populates cache
      expect(() => validateModuleAction('scene', 'create-node', true)).not.toThrow();

      // Second call should use cache
      expect(() => validateModuleAction('scene', 'create-node', true)).not.toThrow();
    });
  });
});

describe('isModuleKnown', () => {
  it('should return true for known modules', () => {
    expect(isModuleKnown('scene')).toBe(true);
    expect(isModuleKnown('asset-db')).toBe(true);
    expect(isModuleKnown('project')).toBe(true);
    expect(isModuleKnown('builder')).toBe(true);
    expect(isModuleKnown('engine')).toBe(true);
    expect(isModuleKnown('information')).toBe(true);
    expect(isModuleKnown('preferences')).toBe(true);
    expect(isModuleKnown('program')).toBe(true);
    expect(isModuleKnown('programming')).toBe(true);
    expect(isModuleKnown('server')).toBe(true);
    expect(isModuleKnown('device')).toBe(true);
    expect(isModuleKnown('extension')).toBe(true);
  });

  it('should return false for unknown modules', () => {
    expect(isModuleKnown('invalid')).toBe(false);
    expect(isModuleKnown('unknown')).toBe(false);
    expect(isModuleKnown('')).toBe(false);
    expect(isModuleKnown('Scene')).toBe(false); // case sensitive
    expect(isModuleKnown('SCENE')).toBe(false); // case sensitive
  });

  it('should have type narrowing behavior', () => {
    if (isModuleKnown('scene')) {
      // TypeScript should know 'scene' is a valid ModuleName
      const actions = VALID_MODULES.scene;
      expect(actions).toBeDefined();
    }
  });
});

describe('isActionKnown', () => {
  it('should return true for known scene actions', () => {
    expect(isActionKnown('scene', 'open-scene')).toBe(true);
    expect(isActionKnown('scene', 'save-scene')).toBe(true);
    expect(isActionKnown('scene', 'create-node')).toBe(true);
    expect(isActionKnown('scene', 'remove-node')).toBe(true);
    expect(isActionKnown('scene', 'set-property')).toBe(true);
    expect(isActionKnown('scene', 'query-node')).toBe(true);
  });

  it('should return false for unknown scene actions', () => {
    expect(isActionKnown('scene', 'invalid-action')).toBe(false);
    expect(isActionKnown('scene', 'unknown')).toBe(false);
    expect(isActionKnown('scene', '')).toBe(false);
  });

  it('should return false for unknown modules', () => {
    expect(isActionKnown('invalid', 'create-node')).toBe(false);
    expect(isActionKnown('unknown', 'any-action')).toBe(false);
  });

  it('should return true for known asset-db actions', () => {
    expect(isActionKnown('asset-db', 'create-asset')).toBe(true);
    expect(isActionKnown('asset-db', 'import-asset')).toBe(true);
    expect(isActionKnown('asset-db', 'delete-asset')).toBe(true);
  });

  it('should return true for known project actions', () => {
    expect(isActionKnown('project', 'open-settings')).toBe(true);
    expect(isActionKnown('project', 'query-config')).toBe(true);
  });

  it('should be case sensitive', () => {
    expect(isActionKnown('scene', 'Create-Node')).toBe(false);
    expect(isActionKnown('scene', 'CREATE-NODE')).toBe(false);
    expect(isActionKnown('Scene', 'create-node')).toBe(false);
  });
});

describe('listAllModules', () => {
  it('should return array of all known module names', () => {
    const modules = listAllModules();

    expect(Array.isArray(modules)).toBe(true);
    expect(modules).toContain('scene');
    expect(modules).toContain('asset-db');
    expect(modules).toContain('project');
    expect(modules).toContain('builder');
    expect(modules).toContain('engine');
    expect(modules).toContain('information');
    expect(modules).toContain('preferences');
    expect(modules).toContain('program');
    expect(modules).toContain('programming');
    expect(modules).toContain('server');
    expect(modules).toContain('device');
    expect(modules).toContain('extension');
  });

  it('should return exactly 12 modules', () => {
    const modules = listAllModules();
    expect(modules.length).toBe(12);
  });

  it('should return the same modules as VALID_MODULES keys', () => {
    const modules = listAllModules();
    const validModuleKeys = Object.keys(VALID_MODULES);

    expect(modules.sort()).toEqual(validModuleKeys.sort());
  });
});

describe('listModuleActions', () => {
  it('should return array of actions for scene module', () => {
    const actions = listModuleActions('scene');

    expect(Array.isArray(actions)).toBe(true);
    expect(actions.length).toBeGreaterThan(0);
    expect(actions).toContain('open-scene');
    expect(actions).toContain('create-node');
    expect(actions).toContain('remove-node');
  });

  it('should return array of actions for asset-db module', () => {
    const actions = listModuleActions('asset-db');

    expect(Array.isArray(actions)).toBe(true);
    expect(actions.length).toBe(21);
    expect(actions).toContain('create-asset');
    expect(actions).toContain('import-asset');
  });

  it('should return empty array for unknown module', () => {
    const actions = listModuleActions('invalid-module');

    expect(Array.isArray(actions)).toBe(true);
    expect(actions.length).toBe(0);
  });

  it('should return correct number of scene actions (53)', () => {
    const actions = listModuleActions('scene');
    expect(actions.length).toBe(53);
  });

  it('should return correct number of asset-db actions (21)', () => {
    const actions = listModuleActions('asset-db');
    expect(actions.length).toBe(21);
  });

  it('should return correct number of project actions (3)', () => {
    const actions = listModuleActions('project');
    expect(actions.length).toBe(3);
  });

  it('should return correct number of builder actions (2)', () => {
    const actions = listModuleActions('builder');
    expect(actions.length).toBe(2);
  });

  it('should return correct number of engine actions (2)', () => {
    const actions = listModuleActions('engine');
    expect(actions.length).toBe(2);
  });

  it('should return correct number of information actions (4)', () => {
    const actions = listModuleActions('information');
    expect(actions.length).toBe(4);
  });

  it('should return correct number of preferences actions (3)', () => {
    const actions = listModuleActions('preferences');
    expect(actions.length).toBe(3);
  });

  it('should return correct number of program actions (3)', () => {
    const actions = listModuleActions('program');
    expect(actions.length).toBe(3);
  });

  it('should return correct number of programming actions (2)', () => {
    const actions = listModuleActions('programming');
    expect(actions.length).toBe(2);
  });

  it('should return correct number of server actions (2)', () => {
    const actions = listModuleActions('server');
    expect(actions.length).toBe(2);
  });

  it('should return correct number of device actions (1)', () => {
    const actions = listModuleActions('device');
    expect(actions.length).toBe(1);
  });

  it('should return correct number of extension actions (1)', () => {
    const actions = listModuleActions('extension');
    expect(actions.length).toBe(1);
  });
});

describe('invalidateCache', () => {
  it('should clear cached modules', () => {
    // Populate cache by calling validateModuleAction
    expect(() => validateModuleAction('scene', 'create-node', true)).not.toThrow();

    // Invalidate cache
    invalidateCache();

    // Cache should be cleared, but validation should still work with local VALID_MODULES
    expect(() => validateModuleAction('scene', 'create-node', false)).not.toThrow();
  });

  it('should allow re-validation after invalidation', () => {
    // First validation
    expect(() => validateModuleAction('scene', 'create-node', false)).not.toThrow();

    // Invalidate cache
    invalidateCache();

    // Should still work after invalidation
    expect(() => validateModuleAction('scene', 'create-node', false)).not.toThrow();
  });

  it('should be callable multiple times without error', () => {
    expect(() => invalidateCache()).not.toThrow();
    expect(() => invalidateCache()).not.toThrow();
    expect(() => invalidateCache()).not.toThrow();
  });
});

describe('scene module action completeness', () => {
  it('should contain all expected scene operation categories', () => {
    const actions = listModuleActions('scene');

    // Scene lifecycle operations
    expect(actions).toContain('open-scene');
    expect(actions).toContain('save-scene');
    expect(actions).toContain('save-as-scene');
    expect(actions).toContain('close-scene');

    // Node operations
    expect(actions).toContain('create-node');
    expect(actions).toContain('remove-node');
    expect(actions).toContain('copy-node');
    expect(actions).toContain('duplicate-node');
    expect(actions).toContain('paste-node');
    expect(actions).toContain('cut-node');
    expect(actions).toContain('set-parent');
    expect(actions).toContain('reset-node');

    // Property operations
    expect(actions).toContain('set-property');
    expect(actions).toContain('reset-property');
    expect(actions).toContain('move-array-element');
    expect(actions).toContain('remove-array-element');

    // Component operations
    expect(actions).toContain('create-component');
    expect(actions).toContain('remove-component');
    expect(actions).toContain('reset-component');
    expect(actions).toContain('execute-component-method');

    // Query operations
    expect(actions).toContain('query-is-ready');
    expect(actions).toContain('query-node');
    expect(actions).toContain('query-component');
    expect(actions).toContain('query-node-tree');
    expect(actions).toContain('query-dirty');
    expect(actions).toContain('query-classes');
    expect(actions).toContain('query-components');
    expect(actions).toContain('query-component-has-script');
    expect(actions).toContain('query-scene-bounds');

    // Gizmo operations
    expect(actions).toContain('change-gizmo-tool');
    expect(actions).toContain('query-gizmo-tool-name');
    expect(actions).toContain('change-gizmo-pivot');
    expect(actions).toContain('query-gizmo-pivot');
    expect(actions).toContain('change-gizmo-coordinate');
    expect(actions).toContain('query-gizmo-coordinate');

    // View operations
    expect(actions).toContain('change-is2D');
    expect(actions).toContain('query-is2D');
    expect(actions).toContain('set-grid-visible');
    expect(actions).toContain('query-is-grid-visible');
    expect(actions).toContain('set-icon-gizmo-3d');
    expect(actions).toContain('query-is-icon-gizmo-3d');
    expect(actions).toContain('set-icon-gizmo-size');
    expect(actions).toContain('query-icon-gizmo-size');

    // Camera operations
    expect(actions).toContain('focus-camera');
    expect(actions).toContain('align-with-view');
    expect(actions).toContain('align-view-with-node');

    // Script execution
    expect(actions).toContain('execute-scene-script');

    // Snapshot operations
    expect(actions).toContain('snapshot');
    expect(actions).toContain('snapshot-abort');

    // Reload operations
    expect(actions).toContain('soft-reload');

    // Asset queries
    expect(actions).toContain('query-nodes-by-asset-uuid');

    // Native check
    expect(actions).toContain('is-native');

    // Prefab restore
    expect(actions).toContain('restore-prefab');
  });

  it('should have exactly 53 scene actions', () => {
    const actions = listModuleActions('scene');
    expect(actions.length).toBe(53);
  });
});

describe('edge cases', () => {
  it('should handle empty string module', () => {
    expect(isModuleKnown('')).toBe(false);
    expect(listModuleActions('')).toEqual([]);
  });

  it('should handle empty string action', () => {
    expect(isActionKnown('scene', '')).toBe(false);
  });

  it('should handle whitespace in module or action names', () => {
    expect(isModuleKnown(' scene')).toBe(false);
    expect(isActionKnown('scene', 'create-node ')).toBe(false);
  });

  it('should handle special characters', () => {
    expect(isModuleKnown('scene/module')).toBe(false);
    expect(isActionKnown('scene', 'create-node?param=value')).toBe(false);
  });
});
