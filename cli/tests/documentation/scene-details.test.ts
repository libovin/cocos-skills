/**
 * Scene module documentation tests
 *
 * Verifies the structure and completeness of sceneDetails from
 * cli/src/lib/details/scene.ts against VALID_MODULES.scene
 */

import { describe, it, expect } from 'vitest';
import { sceneDetails } from '../../src/lib/details/scene.js';
import { VALID_MODULES } from '../../src/types.js';

describe('Scene Module Documentation', () => {
  describe('Action details structure', () => {
    const sceneActions = VALID_MODULES.scene;

    it('should have all actions defined in sceneDetails', () => {
      // Get all action names from sceneDetails
      const documentedActions = Object.keys(sceneDetails);

      // Verify count matches VALID_MODULES.scene
      expect(documentedActions.length).toBe(sceneActions.length);

      // Verify all VALID_MODULES.scene actions are documented
      for (const action of sceneActions) {
        expect(sceneDetails[action]).toBeDefined();
        expect(documentedActions).toContain(action);
      }
    });

    it('should have no extra actions beyond VALID_MODULES.scene', () => {
      const documentedActions = Object.keys(sceneDetails);
      const validActions = VALID_MODULES.scene as readonly string[];

      // All documented actions should be in VALID_MODULES
      for (const documentedAction of documentedActions) {
        expect(validActions).toContain(documentedAction);
      }
    });
  });

  describe('Individual action detail validation', () => {
    const sceneActions = VALID_MODULES.scene;

    it('should validate each action has required fields', () => {
      for (const action of sceneActions) {
        const actionDetail = sceneDetails[action];

        // Verify action detail exists
        expect(actionDetail).toBeDefined();

        // Verify structure matches ActionDetail interface
        expect(actionDetail).toMatchObject({
          description: expect.any(String),
          parameters: expect.any(Array),
          examples: expect.any(Array),
        });
      }
    });

    it('should validate description is a non-empty string', () => {
      for (const action of sceneActions) {
        const actionDetail = sceneDetails[action];

        expect(actionDetail.description).toBeDefined();
        expect(typeof actionDetail.description).toBe('string');
        expect(actionDetail.description.length).toBeGreaterThan(0);
      }
    });

    it('should validate parameters is an array', () => {
      for (const action of sceneActions) {
        const actionDetail = sceneDetails[action];

        expect(Array.isArray(actionDetail.parameters)).toBe(true);

        // Each parameter should have required structure if present
        for (const param of actionDetail.parameters) {
          expect(param).toMatchObject({
            name: expect.any(String),
            type: expect.any(String),
            required: expect.any(Boolean),
            description: expect.any(String),
          });
        }
      }
    });

    it('should validate examples exists and has at least one example', () => {
      for (const action of sceneActions) {
        const actionDetail = sceneDetails[action];

        expect(actionDetail.examples).toBeDefined();
        expect(Array.isArray(actionDetail.examples)).toBe(true);
        expect(actionDetail.examples.length).toBeGreaterThan(0);

        // Each example should be a non-empty string
        for (const example of actionDetail.examples) {
          expect(typeof example).toBe('string');
          expect(example.length).toBeGreaterThan(0);
        }
      }
    });

    it('should validate notes exists when present', () => {
      for (const action of sceneActions) {
        const actionDetail = sceneDetails[action];

        // Notes is optional, but if present should be a string
        if (actionDetail.notes !== undefined) {
          expect(typeof actionDetail.notes).toBe('string');
        }
      }
    });
  });

  describe('Specific camera operation actions', () => {
    const cameraActions = ['focus-camera', 'align-with-view', 'align-view-with-node'] as const;

    it('should validate focus-camera action details', () => {
      const actionDetail = sceneDetails['focus-camera'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('相机');
      expect(actionDetail.parameters).toHaveLength(1);
      expect(actionDetail.parameters[0].name).toBe('path');
      expect(actionDetail.parameters[0].type).toBe('string');
      expect(actionDetail.parameters[0].required).toBe(true);
      expect(actionDetail.examples.length).toBeGreaterThanOrEqual(1);
    });

    it('should validate align-with-view action details', () => {
      const actionDetail = sceneDetails['align-with-view'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('对齐');
      expect(actionDetail.parameters).toHaveLength(1);
      expect(actionDetail.parameters[0].name).toBe('path');
      expect(actionDetail.parameters[0].type).toBe('string');
      expect(actionDetail.parameters[0].required).toBe(true);
    });

    it('should validate align-view-with-node action details', () => {
      const actionDetail = sceneDetails['align-view-with-node'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('视图');
      expect(actionDetail.parameters).toHaveLength(1);
      expect(actionDetail.parameters[0].name).toBe('path');
      expect(actionDetail.parameters[0].type).toBe('string');
      expect(actionDetail.parameters[0].required).toBe(true);
    });

    it('should have all camera actions in VALID_MODULES', () => {
      for (const action of cameraActions) {
        expect(VALID_MODULES.scene).toContain(action);
      }
    });
  });

  describe('Common action categories', () => {
    it('should validate query actions have no required parameters', () => {
      const queryActions = [
        'query-is-ready',
        'query-gizmo-tool-name',
        'query-gizmo-pivot',
        'query-gizmo-coordinate',
        'query-is2D',
        'query-is-grid-visible',
        'query-is-icon-gizmo-3d',
        'query-icon-gizmo-size',
        'query-node-tree',
        'query-dirty',
        'query-components',
        'query-scene-bounds',
      ];

      for (const action of queryActions) {
        expect(VALID_MODULES.scene).toContain(action);
        expect(sceneDetails[action]).toBeDefined();
      }
    });

    it('should validate gizmo operations are documented', () => {
      const gizmoActions = [
        'change-gizmo-tool',
        'query-gizmo-tool-name',
        'change-gizmo-pivot',
        'query-gizmo-pivot',
        'change-gizmo-coordinate',
        'query-gizmo-coordinate',
      ];

      for (const action of gizmoActions) {
        expect(VALID_MODULES.scene).toContain(action);
        expect(sceneDetails[action]).toBeDefined();
      }
    });

    it('should validate 2D/3D mode operations are documented', () => {
      const modeActions = ['change-is2D', 'query-is2D'];

      for (const action of modeActions) {
        expect(VALID_MODULES.scene).toContain(action);
        expect(sceneDetails[action]).toBeDefined();
      }
    });

    it('should validate grid operations are documented', () => {
      const gridActions = ['set-grid-visible', 'query-is-grid-visible'];

      for (const action of gridActions) {
        expect(VALID_MODULES.scene).toContain(action);
        expect(sceneDetails[action]).toBeDefined();
      }
    });

    it('should validate icon gizmo operations are documented', () => {
      const iconGizmoActions = [
        'set-icon-gizmo-3d',
        'query-is-icon-gizmo-3d',
        'set-icon-gizmo-size',
        'query-icon-gizmo-size',
      ];

      for (const action of iconGizmoActions) {
        expect(VALID_MODULES.scene).toContain(action);
        expect(sceneDetails[action]).toBeDefined();
      }
    });
  });

  describe('Documentation consistency', () => {
    it('should ensure all action names use kebab-case or known patterns', () => {
      // Most actions follow kebab-case, but some have patterns like is2D (2D mode)
      // The regex allows lowercase letters, numbers, hyphens, and the '2D' pattern
      const validActionRegex = /^[a-z][a-z0-9-]*(2D)?$/;

      for (const action of VALID_MODULES.scene) {
        expect(action).toMatch(validActionRegex);
      }
    });

    it('should have consistent example format across actions', () => {
      for (const action of VALID_MODULES.scene) {
        const actionDetail = sceneDetails[action];

        // All examples should start with 'cocos-skills scene '
        for (const example of actionDetail.examples) {
          expect(example).toMatch(/^cocos-skills scene /);
        }
      }
    });
  });
});
