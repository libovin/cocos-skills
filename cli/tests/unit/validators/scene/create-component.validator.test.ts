/**
 * Unit tests for create-component validator
 * Tests for scene/create-component action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateCreateComponent } from '../../../../src/lib/validators/scene/create-component.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateCreateComponent', () => {
  describe('valid inputs', () => {
    it('should accept valid options with uuid and component', () => {
      const validOptions = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.Sprite'
      };

      expect(() => validateCreateComponent([validOptions])).not.toThrow();
    });

    it('should accept common Cocos components', () => {
      const commonComponents = [
        'cc.Sprite',
        'cc.Widget',
        'cc.Button',
        'cc.Label',
        'cc.RigidBody',
        'cc.Collider',
        'cc.Animation',
        'cc.AudioSource',
        'cc.ParticleSystem',
        'cc.Camera',
        'cc.Canvas',
        'cc.UIOpacity',
        'cc.UITransform',
        'cc.Layout',
        'cc.Scroll_view',
        'cc.SpriteFrame'
      ];

      commonComponents.forEach((component) => {
        const validOptions = {
          uuid: '123e4567-e89b-12d3-a456-426614174000',
          component: component
        };

        expect(() => validateCreateComponent([validOptions])).not.toThrow();
      });
    });

    it('should accept component with namespace', () => {
      const validOptions = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.PhysicsBoxCollider'
      };

      expect(() => validateCreateComponent([validOptions])).not.toThrow();
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateCreateComponent([])).toThrow(ValidationError);
    });

    it('should throw ValidationError when params array has more than 1 element', () => {
      expect(() => validateCreateComponent([{}, {}])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for wrong params count', () => {
      try {
        validateCreateComponent([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('scene');
        expect(error.action).toBe('create-component');
        expect(error.field).toBe('params');
        expect(error.message).toContain('1 个参数');
      }
    });
  });

  describe('options type validation', () => {
    it('should throw ValidationError when options is not an object', () => {
      expect(() => validateCreateComponent(['string'])).toThrow(ValidationError);
      expect(() => validateCreateComponent([123])).toThrow(ValidationError);
      expect(() => validateCreateComponent([null])).toThrow(ValidationError);
      expect(() => validateCreateComponent([undefined])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-object options', () => {
      try {
        validateCreateComponent(['string']);
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
        component: 'cc.Sprite'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when uuid is not a string', () => {
      const options = {
        uuid: 123,
        component: 'cc.Sprite'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when uuid is empty string', () => {
      const options = {
        uuid: '   ',
        component: 'cc.Sprite'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when uuid is null', () => {
      const options = {
        uuid: null,
        component: 'cc.Sprite'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for uuid', () => {
      try {
        validateCreateComponent([{ component: 'cc.Sprite' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('uuid');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should throw ValidationError with correct message for empty uuid', () => {
      try {
        validateCreateComponent([{ uuid: '   ', component: 'cc.Sprite' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('uuid');
        expect(error.message).toContain('不能为空');
      }
    });

    it('should accept uuid with whitespace that gets trimmed (non-empty after trim)', () => {
      const options = {
        uuid: '  123e4567-e89b-12d3-a456-426614174000  ',
        component: 'cc.Sprite'
      };

      // The validator checks for empty string after trim, so this should pass
      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept uuid in various formats', () => {
      const validUuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff'
      ];

      validUuids.forEach((uuid) => {
        const options = {
          uuid: uuid,
          component: 'cc.Sprite'
        };

        expect(() => validateCreateComponent([options])).not.toThrow();
      });
    });
  });

  describe('component validation', () => {
    it('should throw ValidationError when component is missing', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when component is not a string', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 123
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when component is empty string', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: '   '
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when component is null', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: null
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when component does not start with cc.', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'Sprite'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when component starts with CC. (uppercase)', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'CC.Sprite'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError when component starts with Cc. (mixed case)', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'Cc.Sprite'
      };

      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct field name for component', () => {
      try {
        validateCreateComponent([{ uuid: '123e4567-e89b-12d3-a456-426614174000' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('component');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should throw ValidationError with correct message for empty component', () => {
      try {
        validateCreateComponent([{ uuid: '123e4567-e89b-12d3-a456-426614174000', component: '   ' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('component');
        expect(error.message).toContain('不能为空');
      }
    });

    it('should throw ValidationError with correct message for component without cc. prefix', () => {
      try {
        validateCreateComponent([{ uuid: '123e4567-e89b-12d3-a456-426614174000', component: 'Sprite' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('component');
        expect(error.message).toContain('cc. 开头');
      }
    });

    it('should reject component with leading whitespace (does not start with cc.)', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: '  cc.Sprite  '
      };

      // After trim, it starts with cc., but the validator checks the original value
      expect(() => validateCreateComponent([options])).toThrow(ValidationError);
    });
  });

  describe('edge cases', () => {
    it('should accept options with additional unknown properties', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.Sprite',
        unknownProperty: 'value',
        anotherProperty: 123
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept component with sub-namespaces', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.physics.BoxCollider'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept component with multiple dots', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.widget.Constraint'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept component name with numbers', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.MeshRenderer2D'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept component name with underscores', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.spine_Skeleton'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });
  });

  describe('real-world scenarios', () => {
    it('should accept typical sprite component creation', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.Sprite'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept button component creation', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.Button'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept widget component creation', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.Widget'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });

    it('should accept label component creation', () => {
      const options = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        component: 'cc.Label'
      };

      expect(() => validateCreateComponent([options])).not.toThrow();
    });
  });

  describe('error message quality', () => {
    it('should provide clear error message for missing params', () => {
      try {
        validateCreateComponent([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/create-component] params: 必须提供 1 个参数（JSON 对象）');
      }
    });

    it('should provide clear error message for non-object params', () => {
      try {
        validateCreateComponent(['string']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/create-component] params: 参数必须是对象类型');
      }
    });

    it('should provide clear error message for missing uuid', () => {
      try {
        validateCreateComponent([{ component: 'cc.Sprite' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/create-component] uuid: 必须是字符串类型');
      }
    });

    it('should provide clear error message for empty uuid', () => {
      try {
        validateCreateComponent([{ uuid: '   ', component: 'cc.Sprite' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/create-component] uuid: 不能为空');
      }
    });

    it('should provide clear error message for missing component', () => {
      try {
        validateCreateComponent([{ uuid: '123e4567-e89b-12d3-a456-426614174000' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/create-component] component: 必须是字符串类型');
      }
    });

    it('should provide clear error message for empty component', () => {
      try {
        validateCreateComponent([{ uuid: '123e4567-e89b-12d3-a456-426614174000', component: '   ' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[scene/create-component] component: 不能为空');
      }
    });

    it('should provide clear error message for component without cc. prefix', () => {
      try {
        validateCreateComponent([{ uuid: '123e4567-e89b-12d3-a456-426614174000', component: 'Sprite' }]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('cc. 开头');
        expect(error.message).toContain('cc.Sprite');
      }
    });
  });
});
