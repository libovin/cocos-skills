/**
 * Gizmo Operations Integration Tests
 *
 * Tests for scene gizmo and tool actions:
 * - change-gizmo-tool, query-gizmo-tool-name
 * - change-gizmo-pivot, query-gizmo-pivot
 * - change-gizmo-coordinate, query-gizmo-coordinate
 * - change-is2D, query-is2D
 * - set-grid-visible, query-is-grid-visible
 * - set-icon-gizmo-3d, query-is-icon-gizmo-3d
 * - set-icon-gizmo-size, query-icon-gizmo-size
 * - snapshot, snapshot-abort
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CocosClient } from '../../../src/lib/client.js';
import { SceneFixture } from '../helpers/scene-fixture.js';

describe('Gizmo Operations Integration Tests', () => {
  let client: CocosClient;
  let fixture: SceneFixture;

  beforeAll(async () => {
    client = new CocosClient({ validate: true });
    fixture = new SceneFixture(client, 'db://assets/GizmoTest.scene', 'GizmoTest');

    const sceneInfo = await fixture.setup();
    if (!sceneInfo) {
      console.warn('Server not available, skipping gizmo integration tests');
    }
  });

  afterAll(async () => {
    await fixture.teardown();
  });

  describe('Gizmo Tool', () => {
    describe('change-gizmo-tool', () => {
      it('should set gizmo tool to move', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-gizmo-tool', ['move']);

        expect(result.success).toBe(true);
      });

      it('should set gizmo tool to rotate', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-gizmo-tool', ['rotate']);

        expect(result.success).toBe(true);
      });

      it('should set gizmo tool to scale', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-gizmo-tool', ['scale']);

        expect(result.success).toBe(true);
      });

      it('should validate change-gizmo-tool parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Test with no parameters
        await expect(
          client.execute('scene', 'change-gizmo-tool', [], false)
        ).rejects.toThrow();

        // Test with invalid parameter type
        await expect(
          client.execute('scene', 'change-gizmo-tool', [123], false)
        ).rejects.toThrow();

        // Test with invalid tool value
        const result = await client.execute('scene', 'change-gizmo-tool', ['invalid']);
        expect(result.success).toBe(false);
      });
    });

    describe('query-gizmo-tool-name', () => {
      it('should query current gizmo tool', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Set a known tool first
        await client.execute('scene', 'change-gizmo-tool', ['move']);

        const result = await client.execute('scene', 'query-gizmo-tool-name');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(['move', 'rotate', 'scale']).toContain(result.data);
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'query-gizmo-tool-name', []);

        expect(result.success).toBe(true);
      });
    });

    it('should verify tool change and query consistency', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const tools = ['move', 'rotate', 'scale'] as const;

      for (const tool of tools) {
        await client.execute('scene', 'change-gizmo-tool', [tool]);
        const queryResult = await client.execute('scene', 'query-gizmo-tool-name');

        expect(queryResult.success).toBe(true);
        expect(queryResult.data).toBe(tool);
      }
    });
  });

  describe('Gizmo Pivot', () => {
    describe('change-gizmo-pivot', () => {
      it('should set gizmo pivot to center', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-gizmo-pivot', ['center']);

        expect(result.success).toBe(true);
      });

      it('should set gizmo pivot to pivot', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-gizmo-pivot', ['pivot']);

        expect(result.success).toBe(true);
      });

      it('should validate change-gizmo-pivot parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Test with no parameters
        await expect(
          client.execute('scene', 'change-gizmo-pivot', [], false)
        ).rejects.toThrow();

        // Test with invalid parameter type
        await expect(
          client.execute('scene', 'change-gizmo-pivot', [123], false)
        ).rejects.toThrow();

        // Test with invalid pivot value
        const result = await client.execute('scene', 'change-gizmo-pivot', ['invalid']);
        expect(result.success).toBe(false);
      });
    });

    describe('query-gizmo-pivot', () => {
      it('should query current gizmo pivot', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Set a known pivot first
        await client.execute('scene', 'change-gizmo-pivot', ['center']);

        const result = await client.execute('scene', 'query-gizmo-pivot');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(['center', 'pivot']).toContain(result.data);
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'query-gizmo-pivot', []);

        expect(result.success).toBe(true);
      });
    });

    it('should verify pivot change and query consistency', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const pivots = ['center', 'pivot'] as const;

      for (const pivot of pivots) {
        await client.execute('scene', 'change-gizmo-pivot', [pivot]);
        const queryResult = await client.execute('scene', 'query-gizmo-pivot');

        expect(queryResult.success).toBe(true);
        expect(queryResult.data).toBe(pivot);
      }
    });
  });

  describe('Gizmo Coordinate', () => {
    describe('change-gizmo-coordinate', () => {
      it('should set gizmo coordinate to world', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-gizmo-coordinate', ['world']);

        expect(result.success).toBe(true);
      });

      it('should set gizmo coordinate to local', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-gizmo-coordinate', ['local']);

        expect(result.success).toBe(true);
      });

      it('should validate change-gizmo-coordinate parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Test with no parameters
        await expect(
          client.execute('scene', 'change-gizmo-coordinate', [], false)
        ).rejects.toThrow();

        // Test with invalid parameter type
        await expect(
          client.execute('scene', 'change-gizmo-coordinate', [123], false)
        ).rejects.toThrow();

        // Test with invalid coordinate value
        const result = await client.execute('scene', 'change-gizmo-coordinate', ['invalid']);
        expect(result.success).toBe(false);
      });
    });

    describe('query-gizmo-coordinate', () => {
      it('should query current gizmo coordinate', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Set a known coordinate first
        await client.execute('scene', 'change-gizmo-coordinate', ['world']);

        const result = await client.execute('scene', 'query-gizmo-coordinate');

        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(['world', 'local']).toContain(result.data);
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'query-gizmo-coordinate', []);

        expect(result.success).toBe(true);
      });
    });

    it('should verify coordinate change and query consistency', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const coordinates = ['world', 'local'] as const;

      for (const coordinate of coordinates) {
        await client.execute('scene', 'change-gizmo-coordinate', [coordinate]);
        const queryResult = await client.execute('scene', 'query-gizmo-coordinate');

        expect(queryResult.success).toBe(true);
        expect(queryResult.data).toBe(coordinate);
      }
    });
  });

  describe('2D/3D Mode', () => {
    describe('change-is2D', () => {
      it('should set mode to 2D', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-is2D', [true]);

        expect(result.success).toBe(true);
      });

      it('should set mode to 3D', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'change-is2D', [false]);

        expect(result.success).toBe(true);
      });

      it('should validate change-is2D parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Test with no parameters
        await expect(client.execute('scene', 'change-is2D', [], false)).rejects.toThrow();

        // Test with invalid parameter type
        await expect(client.execute('scene', 'change-is2D', ['invalid'], false)).rejects.toThrow();
      });
    });

    describe('query-is2D', () => {
      it('should query current 2D/3D mode', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Set a known mode first
        await client.execute('scene', 'change-is2D', [true]);

        const result = await client.execute('scene', 'query-is2D');

        expect(result.success).toBe(true);
        expect(typeof result.data).toBe('boolean');
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'query-is2D', []);

        expect(result.success).toBe(true);
      });
    });

    it('should verify 2D/3D mode change and query consistency', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const modes = [true, false] as const;

      for (const mode of modes) {
        await client.execute('scene', 'change-is2D', [mode]);
        const queryResult = await client.execute('scene', 'query-is2D');

        expect(queryResult.success).toBe(true);
        expect(queryResult.data).toBe(mode);
      }
    });
  });

  describe('Grid Visibility', () => {
    describe('set-grid-visible', () => {
      it('should show grid', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'set-grid-visible', [true]);

        expect(result.success).toBe(true);
      });

      it('should hide grid', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'set-grid-visible', [false]);

        expect(result.success).toBe(true);
      });

      it('should validate set-grid-visible parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Test with no parameters
        await expect(
          client.execute('scene', 'set-grid-visible', [], false)
        ).rejects.toThrow();

        // Test with invalid parameter type
        await expect(
          client.execute('scene', 'set-grid-visible', ['invalid'], false)
        ).rejects.toThrow();
      });
    });

    describe('query-is-grid-visible', () => {
      it('should query grid visibility', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Set a known state first
        await client.execute('scene', 'set-grid-visible', [true]);

        const result = await client.execute('scene', 'query-is-grid-visible');

        expect(result.success).toBe(true);
        expect(typeof result.data).toBe('boolean');
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'query-is-grid-visible', []);

        expect(result.success).toBe(true);
      });
    });

    it('should verify grid visibility change and query consistency', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      const states = [true, false] as const;

      for (const state of states) {
        await client.execute('scene', 'set-grid-visible', [state]);
        const queryResult = await client.execute('scene', 'query-is-grid-visible');

        expect(queryResult.success).toBe(true);
        expect(queryResult.data).toBe(state);
      }
    });
  });

  describe('Icon Gizmo', () => {
    describe('set-icon-gizmo-3d', () => {
      it('should set icon gizmo to 3D mode', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'set-icon-gizmo-3d', [true]);

        expect(result.success).toBe(true);
      });

      it('should set icon gizmo to 2D mode', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'set-icon-gizmo-3d', [false]);

        expect(result.success).toBe(true);
      });

      it('should validate set-icon-gizmo-3d parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Test with no parameters
        await expect(
          client.execute('scene', 'set-icon-gizmo-3d', [], false)
        ).rejects.toThrow();

        // Test with invalid parameter type
        await expect(
          client.execute('scene', 'set-icon-gizmo-3d', ['invalid'], false)
        ).rejects.toThrow();
      });
    });

    describe('query-is-icon-gizmo-3d', () => {
      it('should query icon gizmo 3D mode', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Set a known state first
        await client.execute('scene', 'set-icon-gizmo-3d', [true]);

        const result = await client.execute('scene', 'query-is-icon-gizmo-3d');

        expect(result.success).toBe(true);
        expect(typeof result.data).toBe('boolean');
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'query-is-icon-gizmo-3d', []);

        expect(result.success).toBe(true);
      });
    });

    describe('set-icon-gizmo-size', () => {
      it('should set icon gizmo size', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'set-icon-gizmo-size', [1.5]);

        expect(result.success).toBe(true);
      });

      it('should validate set-icon-gizmo-size parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Test with no parameters
        await expect(
          client.execute('scene', 'set-icon-gizmo-size', [], false)
        ).rejects.toThrow();

        // Test with invalid parameter type
        await expect(
          client.execute('scene', 'set-icon-gizmo-size', ['invalid'], false)
        ).rejects.toThrow();
      });
    });

    describe('query-icon-gizmo-size', () => {
      it('should query icon gizmo size', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Set a known size first
        await client.execute('scene', 'set-icon-gizmo-size', [1.5]);

        const result = await client.execute('scene', 'query-icon-gizmo-size');

        expect(result.success).toBe(true);
        expect(typeof result.data).toBe('number');
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'query-icon-gizmo-size', []);

        expect(result.success).toBe(true);
      });
    });

    it('should verify icon gizmo settings change and query consistency', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Test 3D mode
      await client.execute('scene', 'set-icon-gizmo-3d', [true]);
      const is3dResult = await client.execute('scene', 'query-is-icon-gizmo-3d');
      expect(is3dResult.data).toBe(true);

      // Test size
      await client.execute('scene', 'set-icon-gizmo-size', [2.0]);
      const sizeResult = await client.execute('scene', 'query-icon-gizmo-size');
      expect(sizeResult.data).toBe(2.0);
    });
  });

  describe('Snapshot Operations', () => {
    describe('snapshot', () => {
      it('should create scene snapshot', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'snapshot');

        expect(result.success).toBe(true);
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'snapshot', []);

        expect(result.success).toBe(true);
      });
    });

    describe('snapshot-abort', () => {
      it('should abort snapshot operation', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        const result = await client.execute('scene', 'snapshot-abort');

        expect(result.success).toBe(true);
      });

      it('should have no parameters', async () => {
        if (!fixture.isServerAvailable()) {
          return;
        }

        // Should execute without parameters
        const result = await client.execute('scene', 'snapshot-abort', []);

        expect(result.success).toBe(true);
      });
    });

    it('should handle snapshot and abort sequence', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Create snapshot
      const snapshotResult = await client.execute('scene', 'snapshot');
      expect(snapshotResult.success).toBe(true);

      // Abort snapshot
      const abortResult = await client.execute('scene', 'snapshot-abort');
      expect(abortResult.success).toBe(true);
    });
  });

  describe('Gizmo operation workflows', () => {
    it('should configure multiple gizmo settings in sequence', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Set tool
      await client.execute('scene', 'change-gizmo-tool', ['move']);
      expect((await client.execute('scene', 'query-gizmo-tool-name')).data).toBe('move');

      // Set pivot
      await client.execute('scene', 'change-gizmo-pivot', ['center']);
      expect((await client.execute('scene', 'query-gizmo-pivot')).data).toBe('center');

      // Set coordinate
      await client.execute('scene', 'change-gizmo-coordinate', ['world']);
      expect((await client.execute('scene', 'query-gizmo-coordinate')).data).toBe('world');

      // Set 2D mode
      await client.execute('scene', 'change-is2D', [true]);
      expect((await client.execute('scene', 'query-is2D')).data).toBe(true);

      // Set grid visibility
      await client.execute('scene', 'set-grid-visible', [true]);
      expect((await client.execute('scene', 'query-is-grid-visible')).data).toBe(true);

      // Set icon gizmo
      await client.execute('scene', 'set-icon-gizmo-3d', [false]);
      expect((await client.execute('scene', 'query-is-icon-gizmo-3d')).data).toBe(false);

      // Set icon size
      await client.execute('scene', 'set-icon-gizmo-size', [1.2]);
      expect((await client.execute('scene', 'query-icon-gizmo-size')).data).toBe(1.2);
    });

    it('should reset all gizmo settings to defaults', async () => {
      if (!fixture.isServerAvailable()) {
        return;
      }

      // Set to non-default values
      await client.execute('scene', 'change-gizmo-tool', ['rotate']);
      await client.execute('scene', 'change-gizmo-pivot', ['pivot']);
      await client.execute('scene', 'change-gizmo-coordinate', ['local']);
      await client.execute('scene', 'change-is2D', [false]);
      await client.execute('scene', 'set-grid-visible', [false]);
      await client.execute('scene', 'set-icon-gizmo-3d', [true]);
      await client.execute('scene', 'set-icon-gizmo-size', [0.8]);

      // Reset to defaults
      await client.execute('scene', 'change-gizmo-tool', ['move']);
      await client.execute('scene', 'change-gizmo-pivot', ['center']);
      await client.execute('scene', 'change-gizmo-coordinate', ['world']);
      await client.execute('scene', 'change-is2D', [false]);
      await client.execute('scene', 'set-grid-visible', [true]);
      await client.execute('scene', 'set-icon-gizmo-3d', [false]);
      await client.execute('scene', 'set-icon-gizmo-size', [1.0]);

      // Verify defaults
      expect((await client.execute('scene', 'query-gizmo-tool-name')).data).toBe('move');
      expect((await client.execute('scene', 'query-gizmo-pivot')).data).toBe('center');
      expect((await client.execute('scene', 'query-gizmo-coordinate')).data).toBe('world');
      expect((await client.execute('scene', 'query-is2D')).data).toBe(false);
      expect((await client.execute('scene', 'query-is-grid-visible')).data).toBe(true);
      expect((await client.execute('scene', 'query-is-icon-gizmo-3d')).data).toBe(false);
      expect((await client.execute('scene', 'query-icon-gizmo-size')).data).toBe(1.0);
    });
  });
});
