/**
 * Unit tests for create-node validator
 * Tests for scene/create-node action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateCreateNode } from '../../../../src/lib/validators/scene/create-node.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateCreateNode', () => {
  describe('valid inputs', () => {
    it('should accept valid options with parent and name', () => {
      const validOptions = {
        parent: 'Canvas',
        name: 'NewNode'
      };

      expect(() => validateCreateNode([validOptions])).not.toThrow();
    });

    it('should accept valid options with only parent', () => {
      const validOptions = {
        parent: 'Canvas'
      };

      expect(() => validateCreateNode([validOptions])).not.toThrow();
    });

    it('should accept valid options with only name', () => {
      const validOptions = {
        name: 'NewNode'
      };

      expect(() => validateCreateNode([validOptions])).not.toThrow();
    });

    it('should accept valid options with empty object', () => {
      const validOptions = {};

      expect(() => validateCreateNode([validOptions])).not.toThrow();
    });

    it('should accept parent as uuid string', () => {
      const validOptions = {
        parent: '123e4567-e89b-12d3-a456-426614174000'
      };

      expect(() => validateCreateNode([validOptions])).not.toThrow();
    });

    it('should accept name with special characters', () => {
      const validOptions = {
        parent: 'Canvas',
        name: 'Node-123_测试'
      };

      expect(() => validateCreateNode([validOptions])).not.toThrow();
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateCreateNode([])).toThrow(ValidationError);
    });

    it('should throw ValidationError when params array has more than 1 element', () => {
      expect(() => validateCreateNode([{}, {}])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for wrong params count', () => {
      try {
        validateCreateNode([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('scene');
        expect(error.action).toBe('create-node');
        expect(error.field).toBe('params');
        expect(error.message).toContain('1 个参数');
      }
    });
  });

  describe('options type validation', () => {
    it('should throw ValidationError when options is not an object', () => {
      expect(() => validateCreateNode(['string'])).toThrow(ValidationError);
      expect(() => validateCreateNode([123])).toThrow(ValidationError);
      expect(() => validateCreateNode([null])).toThrow(ValidationError);
      expect(() => validateCreateNode([undefined])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-object options', () => {
      try {
        validateCreateNode(['string']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('params');
        expect(error.message).toContain('对象类型');
      }
    });
  });

  describe('parent validation', () => {
    it('should throw ValidationError when parent is not a string', () => {
      const options = {
        parent: 123
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when parent is null', () => {
      const options = {
        parent: null
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when parent is array', () => {
      const options = {
        parent: ['Canvas']
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for parent', () => {
      try {
        validateCreateNode([{ parent: 123 }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('parent');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should accept parent as undefined (optional field)', () => {
      const options = {
        name: 'NewNode'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });
  });

  describe('name validation', () => {
    it('should throw ValidationError when name is not a string', () => {
      const options = {
        name: 123
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when name is null', () => {
      const options = {
        name: null
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when name is array', () => {
      const options = {
        name: ['NewNode']
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for name', () => {
      try {
        validateCreateNode([{ name: 123 }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('name');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should accept name as undefined (optional field)', () => {
      const options = {
        parent: 'Canvas'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should accept empty string as name', () => {
      const options = {
        name: ''
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should accept name with leading/trailing whitespace', () => {
      const options = {
        name: '  NewNode  '
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should accept options with additional unknown properties', () => {
      const options = {
        parent: 'Canvas',
        name: 'NewNode',
        unknownProperty: 'value',
        anotherProperty: 123
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should accept parent as node path', () => {
      const options = {
        parent: '/Canvas/ParentNode'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should accept parent as uuid', () => {
      const options = {
        parent: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should accept both parent and name as empty strings', () => {
      const options = {
        parent: '',
        name: ''
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should handle zero values correctly', () => {
      const options = {
        parent: '0',
        name: '0'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should handle boolean false values (should throw as not strings)', () => {
      const options = {
        parent: false,
        name: false
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });

    it('should handle boolean true values (should throw as not strings)', () => {
      const options = {
        parent: true,
        name: true
      };

      expect(() => validateCreateNode([options])).toThrow(ValidationError);
    });
  });

  describe('real-world scenarios', () => {
    it('should accept typical node creation under Canvas', () => {
      const options = {
        parent: 'Canvas',
        name: 'Sprite'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should accept node creation with nested parent path', () => {
      const options = {
        parent: '/Canvas/Panel/Container',
        name: 'Button'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });

    it('should accept node creation with uuid parent', () => {
      const options = {
        parent: 'd8f7e6c5-b4a3-4210-9876-fedcba543210',
        name: 'ChildNode'
      };

      expect(() => validateCreateNode([options])).not.toThrow();
    });
  });
});
