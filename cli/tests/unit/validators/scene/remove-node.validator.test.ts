/**
 * Unit tests for remove-node validator
 * Tests for scene/remove-node action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateRemoveNode } from '../../../../src/lib/validators/scene/remove-node.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateRemoveNode', () => {
  describe('valid inputs', () => {
    it('should accept valid node path', () => {
      expect(() => validateRemoveNode(['/Canvas/OldNode'])).not.toThrow();
    });

    it('should accept deeply nested node path', () => {
      expect(() => validateRemoveNode(['/Canvas/Panel/Container/OldNode'])).not.toThrow();
    });

    it('should accept node path with single segment after root', () => {
      expect(() => validateRemoveNode(['/Canvas'])).not.toThrow();
    });

    it('should accept node path with numbers', () => {
      expect(() => validateRemoveNode(['/Canvas/Node123'])).not.toThrow();
    });

    it('should accept node path with special characters', () => {
      expect(() => validateRemoveNode(['/Canvas/Node-测试_123'])).not.toThrow();
    });

    it('should accept multiple paths (params length > 1)', () => {
      expect(() => validateRemoveNode(['/Canvas/Node1', '/Canvas/Node2'])).not.toThrow();
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateRemoveNode([])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for empty params', () => {
      try {
        validateRemoveNode([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('scene');
        expect(error.action).toBe('remove-node');
        expect(error.field).toBe('params');
        expect(error.message).toContain('至少需要 1 个参数');
      }
    });
  });

  describe('path type validation', () => {
    it('should throw ValidationError when path is not a string', () => {
      expect(() => validateRemoveNode([123])).toThrow(ValidationError);
      expect(() => validateRemoveNode([null])).toThrow(ValidationError);
      expect(() => validateRemoveNode([undefined])).toThrow(ValidationError);
      expect(() => validateRemoveNode([{}])).toThrow(ValidationError);
      expect(() => validateRemoveNode([[]])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-string path', () => {
      try {
        validateRemoveNode([123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('字符串类型');
      }
    });
  });

  describe('path format validation', () => {
    it('should throw ValidationError when path does not start with /', () => {
      expect(() => validateRemoveNode(['Canvas/OldNode'])).toThrow(ValidationError);
      expect(() => validateRemoveNode(['Canvas'])).toThrow(ValidationError);
      expect(() => validateRemoveNode(['OldNode'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for path without leading slash', () => {
      try {
        validateRemoveNode(['Canvas/OldNode']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('以 / 开头');
      }
    });

    it('should throw ValidationError when path is just root /', () => {
      expect(() => validateRemoveNode(['/'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for root path', () => {
      try {
        validateRemoveNode(['/']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('不能删除根节点');
      }
    });

    it('should accept path with double slashes (only checks for leading / and not just /)', () => {
      // The validator only checks if path starts with / and is not exactly /
      // It doesn't validate the format beyond that
      expect(() => validateRemoveNode(['//'])).not.toThrow();
      expect(() => validateRemoveNode(['///'])).not.toThrow();
    });

    it('should accept path with trailing slash', () => {
      // This might be considered valid or invalid based on implementation
      // The current validator only checks for starting with / and not being just /
      expect(() => validateRemoveNode(['/Canvas/Node/'])).not.toThrow();
    });

    it('should accept path with double slashes in middle', () => {
      // The current validator only checks if path starts with / and is not just /
      // It doesn't validate the format beyond that
      expect(() => validateRemoveNode(['/Canvas//Node'])).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should accept path with only slash and one character', () => {
      expect(() => validateRemoveNode(['/a'])).not.toThrow();
    });

    it('should accept path with spaces', () => {
      expect(() => validateRemoveNode(['/Canvas/ My Node '])).not.toThrow();
    });

    it('should accept path with unicode characters', () => {
      expect(() => validateRemoveNode(['/Canvas/节点'])).not.toThrow();
    });

    it('should accept very long paths', () => {
      const longPath = '/Canvas/' + 'Level'.repeat(100) + '/Node';
      expect(() => validateRemoveNode([longPath])).not.toThrow();
    });

    it('should handle path that starts with multiple slashes', () => {
      // Only needs to start with /, so multiple slashes might still be valid
      expect(() => validateRemoveNode(['//Canvas/Node'])).not.toThrow();
    });

    it('should throw for relative path', () => {
      expect(() => validateRemoveNode(['../Canvas/Node'])).toThrow(ValidationError);
      expect(() => validateRemoveNode(['./Canvas/Node'])).toThrow(ValidationError);
    });

    it('should throw for path with backslashes', () => {
      // Windows-style paths should not be accepted
      expect(() => validateRemoveNode(['\\Canvas\\Node'])).toThrow(ValidationError);
    });
  });

  describe('real-world scenarios', () => {
    it('should accept typical UI node removal', () => {
      expect(() => validateRemoveNode(['/Canvas/Panel/Button'])).not.toThrow();
    });

    it('should accept deeply nested sprite removal', () => {
      expect(() => validateRemoveNode(['/Canvas/GameScene/Enemies/Enemy1/Sprite'])).not.toThrow();
    });

    it('should accept node removal with underscores in name', () => {
      expect(() => validateRemoveNode(['/Canvas/main_camera'])).not.toThrow();
    });

    it('should accept node removal with hyphens in name', () => {
      expect(() => validateRemoveNode(['/Canvas/bg-image'])).not.toThrow();
    });

    it('should accept node removal with dots in name (but not extension)', () => {
      expect(() => validateRemoveNode(['/Canvas/node.v2'])).not.toThrow();
    });
  });

  describe('multiple paths', () => {
    it('should accept multiple valid paths', () => {
      expect(() => validateRemoveNode(['/Canvas/Node1', '/Canvas/Node2'])).not.toThrow();
    });

    it('should throw when first path is invalid', () => {
      expect(() => validateRemoveNode(['invalid', '/Canvas/Node2'])).toThrow(ValidationError);
    });

    it('should only validate the first path (validator only checks first element)', () => {
      // The validator only validates params[0] (the first path)
      // It doesn't check other paths
      expect(() => validateRemoveNode(['/Canvas/Node', '/'])).not.toThrow();
      expect(() => validateRemoveNode(['/Canvas/Node1', 'Canvas/Node2'])).not.toThrow();
      expect(() => validateRemoveNode(['/Canvas/Node1', 123])).not.toThrow();
    });
  });

  describe('error message quality', () => {
    it('should provide clear error message for missing path parameter', () => {
      try {
        validateRemoveNode([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/remove-node] params: 至少需要 1 个参数：path');
      }
    });

    it('should provide clear error message for invalid path type', () => {
      try {
        validateRemoveNode([123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/remove-node] path: 必须是字符串类型');
      }
    });

    it('should provide clear error message for path without leading slash', () => {
      try {
        validateRemoveNode(['Canvas/Node']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('节点路径');
        expect(error.message).toContain('以 / 开头');
      }
    });

    it('should provide clear error message for root path', () => {
      try {
        validateRemoveNode(['/']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/remove-node] path: 不能删除根节点');
      }
    });
  });
});
