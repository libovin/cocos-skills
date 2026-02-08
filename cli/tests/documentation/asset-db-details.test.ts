/**
 * Asset Database module documentation tests
 *
 * Verifies the structure and completeness of assetDbDetails from
 * cli/src/lib/details/asset-db.ts against VALID_MODULES['asset-db']
 */

import { describe, it, expect } from 'vitest';
import { assetDbDetails } from '../../src/lib/details/asset-db.js';
import { VALID_MODULES } from '../../src/types.js';

describe('Asset Database Module Documentation', () => {
  describe('Action details structure', () => {
    const assetDbActions = VALID_MODULES['asset-db'];

    it('should have all actions defined in assetDbDetails', () => {
      // Get all action names from assetDbDetails
      const documentedActions = Object.keys(assetDbDetails);

      // Verify count matches VALID_MODULES['asset-db']
      expect(documentedActions.length).toBe(assetDbActions.length);

      // Verify all VALID_MODULES['asset-db'] actions are documented
      for (const action of assetDbActions) {
        expect(assetDbDetails[action]).toBeDefined();
        expect(documentedActions).toContain(action);
      }
    });

    it('should have no extra actions beyond VALID_MODULES["asset-db"]', () => {
      const documentedActions = Object.keys(assetDbDetails);
      const validActions = VALID_MODULES['asset-db'] as readonly string[];

      // All documented actions should be in VALID_MODULES
      for (const documentedAction of documentedActions) {
        expect(validActions).toContain(documentedAction);
      }
    });
  });

  describe('Individual action detail validation', () => {
    const assetDbActions = VALID_MODULES['asset-db'];

    it('should validate each action has required fields', () => {
      for (const action of assetDbActions) {
        const actionDetail = assetDbDetails[action];

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
      for (const action of assetDbActions) {
        const actionDetail = assetDbDetails[action];

        expect(actionDetail.description).toBeDefined();
        expect(typeof actionDetail.description).toBe('string');
        expect(actionDetail.description.length).toBeGreaterThan(0);
      }
    });

    it('should validate parameters is an array', () => {
      for (const action of assetDbActions) {
        const actionDetail = assetDbDetails[action];

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
      for (const action of assetDbActions) {
        const actionDetail = assetDbDetails[action];

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
      for (const action of assetDbActions) {
        const actionDetail = assetDbDetails[action];

        // Notes is optional, but if present should be a string
        if (actionDetail.notes !== undefined) {
          expect(typeof actionDetail.notes).toBe('string');
        }
      }
    });
  });

  describe('Asset creation and import actions', () => {
    it('should validate create-asset action details', () => {
      const actionDetail = assetDbDetails['create-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('创建');
      expect(actionDetail.parameters).toHaveLength(2);
      expect(actionDetail.parameters[0].name).toBe('path');
      expect(actionDetail.parameters[0].type).toBe('string');
      expect(actionDetail.parameters[0].required).toBe(true);
      expect(actionDetail.parameters[1].name).toBe('data');
      expect(actionDetail.parameters[1].type).toBe('string');
      expect(actionDetail.parameters[1].required).toBe(false);
      expect(actionDetail.examples.length).toBeGreaterThanOrEqual(1);
    });

    it('should validate import-asset action details', () => {
      const actionDetail = assetDbDetails['import-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('导入');
      expect(actionDetail.parameters).toHaveLength(2);
      expect(actionDetail.parameters[0].name).toBe('path');
      expect(actionDetail.parameters[0].required).toBe(true);
      expect(actionDetail.parameters[1].name).toBe('importPath');
      expect(actionDetail.parameters[1].required).toBe(true);
    });
  });

  describe('Asset manipulation actions', () => {
    const manipulationActions = [
      'copy-asset',
      'move-asset',
      'delete-asset',
    ] as const;

    it('should validate copy-asset action details', () => {
      const actionDetail = assetDbDetails['copy-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('复制');
      expect(actionDetail.parameters).toHaveLength(2);
      expect(actionDetail.parameters[0].name).toBe('source');
      expect(actionDetail.parameters[1].name).toBe('target');
    });

    it('should validate move-asset action details', () => {
      const actionDetail = assetDbDetails['move-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('移动');
      expect(actionDetail.parameters).toHaveLength(2);
    });

    it('should validate delete-asset action details', () => {
      const actionDetail = assetDbDetails['delete-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('删除');
      expect(actionDetail.parameters).toHaveLength(1);
      expect(actionDetail.notes).toBeDefined();
      expect(actionDetail.notes).toContain('不可撤销');
    });

    it('should have all manipulation actions in VALID_MODULES', () => {
      for (const action of manipulationActions) {
        expect(VALID_MODULES['asset-db']).toContain(action);
      }
    });
  });

  describe('Asset save and import operations', () => {
    const saveImportActions = [
      'save-asset',
      'save-asset-meta',
      'reimport-asset',
      'refresh-asset',
    ] as const;

    it('should validate save-asset action details', () => {
      const actionDetail = assetDbDetails['save-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('保存');
      expect(actionDetail.parameters).toHaveLength(1);
    });

    it('should validate save-asset-meta action details', () => {
      const actionDetail = assetDbDetails['save-asset-meta'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('meta');
      expect(actionDetail.parameters).toHaveLength(1);
    });

    it('should validate reimport-asset action details', () => {
      const actionDetail = assetDbDetails['reimport-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('重新导入');
      expect(actionDetail.parameters).toHaveLength(1);
    });

    it('should validate refresh-asset action details', () => {
      const actionDetail = assetDbDetails['refresh-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('刷新');
      expect(actionDetail.parameters).toHaveLength(1);
    });

    it('should have all save/import actions in VALID_MODULES', () => {
      for (const action of saveImportActions) {
        expect(VALID_MODULES['asset-db']).toContain(action);
      }
    });
  });

  describe('Query actions', () => {
    const queryActions = [
      'query-ready',
      'query-asset-info',
      'query-missing-asset-info',
      'query-asset-meta',
      'query-asset-users',
      'query-asset-dependencies',
      'query-path',
      'query-url',
      'query-uuid',
      'query-assets',
    ] as const;

    it('should validate query-ready action details', () => {
      const actionDetail = assetDbDetails['query-ready'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('准备就绪');
      expect(actionDetail.parameters).toHaveLength(0);
    });

    it('should validate query-asset-info action details', () => {
      const actionDetail = assetDbDetails['query-asset-info'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('详细信息');
      expect(actionDetail.parameters).toHaveLength(1);
      expect(actionDetail.parameters[0].name).toBe('path');
    });

    it('should validate query-asset-users action details', () => {
      const actionDetail = assetDbDetails['query-asset-users'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('引用');
      expect(actionDetail.parameters).toHaveLength(1);
      expect(actionDetail.parameters[0].name).toBe('uuid');
      expect(actionDetail.notes).toContain('删除');
    });

    it('should validate query-assets action details', () => {
      const actionDetail = assetDbDetails['query-assets'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('列表');
      expect(actionDetail.parameters).toHaveLength(1);
      expect(actionDetail.parameters[0].required).toBe(false);
    });

    it('should have all query actions in VALID_MODULES', () => {
      for (const action of queryActions) {
        expect(VALID_MODULES['asset-db']).toContain(action);
        expect(assetDbDetails[action]).toBeDefined();
      }
    });
  });

  describe('Utility actions', () => {
    it('should validate open-asset action details', () => {
      const actionDetail = assetDbDetails['open-asset'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('打开');
      expect(actionDetail.description).toContain('编辑');
      expect(actionDetail.parameters).toHaveLength(1);
    });

    it('should validate generate-available-url action details', () => {
      const actionDetail = assetDbDetails['generate-available-url'];

      expect(actionDetail).toBeDefined();
      expect(actionDetail.description).toContain('URL');
      expect(actionDetail.description).toContain('命名冲突');
      expect(actionDetail.parameters).toHaveLength(2);
      expect(actionDetail.parameters[0].name).toBe('path');
      expect(actionDetail.parameters[1].name).toBe('isDirectory');
      expect(actionDetail.parameters[1].type).toBe('boolean');
    });
  });

  describe('Documentation consistency', () => {
    it('should ensure all action names use kebab-case', () => {
      const validActionRegex = /^[a-z][a-z0-9-]*$/;

      for (const action of VALID_MODULES['asset-db']) {
        expect(action).toMatch(validActionRegex);
      }
    });

    it('should have consistent example format across actions', () => {
      for (const action of VALID_MODULES['asset-db']) {
        const actionDetail = assetDbDetails[action];

        // All examples should start with 'cocos-skills asset-db '
        for (const example of actionDetail.examples) {
          expect(example).toMatch(/^cocos-skills asset-db /);
        }
      }
    });

    it('should have proper Chinese descriptions', () => {
      // Check that descriptions contain Chinese characters for better UX
      for (const action of VALID_MODULES['asset-db']) {
        const actionDetail = assetDbDetails[action];

        // Most descriptions should contain Chinese characters
        const hasChinese = /[\u4e00-\u9fa5]/.test(actionDetail.description);
        expect(hasChinese).toBe(true);
      }
    });
  });

  describe('Parameter type consistency', () => {
    it('should use consistent type names for common parameters', () => {
      const commonTypes = ['string', 'boolean', 'number'];

      for (const action of VALID_MODULES['asset-db']) {
        const actionDetail = assetDbDetails[action];

        for (const param of actionDetail.parameters) {
          // Type should be one of the common types
          expect(commonTypes).toContain(param.type);
        }
      }
    });

    it('should have proper required flag for parameters', () => {
      for (const action of VALID_MODULES['asset-db']) {
        const actionDetail = assetDbDetails[action];

        for (const param of actionDetail.parameters) {
          // Required should be a boolean
          expect(typeof param.required).toBe('boolean');
        }
      }
    });
  });
});
