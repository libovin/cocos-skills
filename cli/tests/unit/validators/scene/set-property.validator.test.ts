/**
 * Unit tests for set-property validator
 * Tests for scene/set-property action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateSetProperty } from '../../../../src/lib/validators/scene/set-property.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateSetProperty', () => {
  describe('valid inputs', () => {
    it('should accept valid set-property options with cc.Vec3 type', () => {
      const validOptions = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_lpos',
        dump: {
          value: { x: 0, y: 0, z: 0 },
          type: 'cc.Vec3'
        }
      };

      expect(() => validateSetProperty([validOptions])).not.toThrow();
    });

    it('should accept valid set-property options with cc.String type', () => {
      const validOptions = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: {
          value: 'NewName',
          type: 'cc.String'
        }
      };

      expect(() => validateSetProperty([validOptions])).not.toThrow();
    });

    it('should accept valid set-property options with cc.Number type', () => {
      const validOptions = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_layer',
        dump: {
          value: 5,
          type: 'cc.Number'
        }
      };

      expect(() => validateSetProperty([validOptions])).not.toThrow();
    });

    it('should accept valid set-property options with cc.Boolean type', () => {
      const validOptions = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_active',
        dump: {
          value: true,
          type: 'cc.Boolean'
        }
      };

      expect(() => validateSetProperty([validOptions])).not.toThrow();
    });

    it('should accept all valid type values', () => {
      const validTypes = [
        'cc.Vec3', 'cc.Quat', 'cc.Vec2', 'cc.Color', 'cc.Size',
        'cc.Node', 'cc.String', 'cc.Number', 'cc.Boolean', 'cc.Asset',
        'cc.SpriteFrame', 'cc.Material', 'cc.Prefab', 'cc.Texture2D',
        'cc.Font', 'cc.AudioClip'
      ];

      validTypes.forEach((type) => {
        const validOptions = {
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          path: '_test',
          dump: {
            value: null,
            type: type
          }
        };

        expect(() => validateSetProperty([validOptions])).not.toThrow();
      });
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateSetProperty([])).toThrow(ValidationError);
    });

    it('should throw ValidationError when params array has more than 1 element', () => {
      expect(() => validateSetProperty([{}, {}])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for wrong params count', () => {
      try {
        validateSetProperty([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('scene');
        expect(error.action).toBe('set-property');
        expect(error.field).toBe('params');
      }
    });
  });

  describe('options type validation', () => {
    it('should throw ValidationError when options is not an object', () => {
      expect(() => validateSetProperty(['string'])).toThrow(ValidationError);
      expect(() => validateSetProperty([123])).toThrow(ValidationError);
      expect(() => validateSetProperty([null])).toThrow(ValidationError);
      expect(() => validateSetProperty([undefined])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-object options', () => {
      try {
        validateSetProperty(['string']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('params');
        expect(error.message).toContain('对象类型');
      }
    });
  });

  describe('uuid validation', () => {
    it('should throw ValidationError when uuid is missing', () => {
      const options = {
        path: '_name',
        dump: { value: 'test', type: 'cc.String' }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when uuid is not a string', () => {
      const options = {
        uuid: 123,
        path: '_name',
        dump: { value: 'test', type: 'cc.String' }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when uuid is empty string', () => {
      const options = {
        uuid: '   ',
        path: '_name',
        dump: { value: 'test', type: 'cc.String' }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for uuid', () => {
      try {
        validateSetProperty([{ path: '_name', dump: { value: 'test', type: 'cc.String' } }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('uuid');
      }
    });
  });

  describe('path validation', () => {
    it('should throw ValidationError when path is missing', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        dump: { value: 'test', type: 'cc.String' }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when path is not a string', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: 123,
        dump: { value: 'test', type: 'cc.String' }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when path is empty string', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '   ',
        dump: { value: 'test', type: 'cc.String' }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for path', () => {
      try {
        validateSetProperty([{ uuid: '123e4567-e89b-12d3-a456-426614174000', dump: { value: 'test', type: 'cc.String' } }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
      }
    });
  });

  describe('dump validation', () => {
    it('should throw ValidationError when dump is missing', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name'
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when dump is not an object', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: 'string'
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when dump is null', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: null
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when dump is an array', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: []
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for dump', () => {
      try {
        validateSetProperty([{ uuid: '123e4567-e89b-12d3-a456-426614174000', path: '_name' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('dump');
      }
    });
  });

  describe('dump.value validation', () => {
    it('should throw ValidationError when dump.value is missing', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: {
          type: 'cc.String'
        }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for dump.value', () => {
      try {
        validateSetProperty([{
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          path: '_name',
          dump: { type: 'cc.String' }
        }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('dump.value');
      }
    });
  });

  describe('dump.type validation', () => {
    it('should throw ValidationError when dump.type is missing', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: {
          value: 'test'
        }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when dump.type is not a string', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: {
          value: 'test',
          type: 123
        }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when dump.type is empty string', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: {
          value: 'test',
          type: '   '
        }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when dump.type is invalid', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: {
          value: 'test',
          type: 'cc.InvalidType'
        }
      };

      expect(() => validateSetProperty([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with list of valid types when type is invalid', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '_name',
        dump: {
          value: 'test',
          type: 'cc.InvalidType'
        }
      };

      try {
        validateSetProperty([options]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('dump.type');
        expect(error.message).toContain('cc.Vec3');
        expect(error.message).toContain('cc.String');
      }
    });

    it('should throw ValidationError with correct field name for dump.type', () => {
      try {
        validateSetProperty([{
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          path: '_name',
          dump: { value: 'test' }
        }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('dump.type');
      }
    });
  });

  describe('edge cases', () => {
    it('should accept uuid with whitespace that gets trimmed', () => {
      const options = {
        uuid: '  123e4567-e89b-12d3-a456-426614174000  ',
        path: '_name',
        dump: {
          value: 'test',
          type: 'cc.String'
        }
      };

      // The validator checks for empty string after trim, so this should pass
      expect(() => validateSetProperty([options])).not.toThrow();
    });

    it('should accept path with whitespace that gets trimmed', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        path: '  _name  ',
        dump: {
          value: 'test',
          type: 'cc.String'
        }
      };

      expect(() => validateSetProperty([options])).not.toThrow();
    });

    it('should accept dump.value as any type (null, string, number, boolean, object, array)', () => {
      const testCases = [
        { value: null, type: 'cc.Asset' },
        { value: 'string', type: 'cc.String' },
        { value: 123, type: 'cc.Number' },
        { value: true, type: 'cc.Boolean' },
        { value: { x: 0, y: 0, z: 0 }, type: 'cc.Vec3' },
        { value: [1, 2, 3], type: 'cc.Asset' }
      ];

      testCases.forEach(({ value, type }) => {
        const options = {
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          path: '_test',
          dump: { value, type }
        };

        expect(() => validateSetProperty([options])).not.toThrow();
      });
    });
  });
});
