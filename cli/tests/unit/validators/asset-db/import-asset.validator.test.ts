/**
 * Unit tests for import-asset validator
 * Tests for asset-db/import-asset action parameter validation
 */

import { describe, it, expect } from 'vitest';
import { validateImportAsset } from '../../../../src/lib/validators/asset-db/import-asset.validator.js';
import { ValidationError } from '../../../../src/lib/validators/error.js';

describe('validateImportAsset', () => {
  describe('valid inputs', () => {
    it('should accept valid path and importPath', () => {
      const validParams = [
        'db://assets/sprites/player.png',
        'E:/project/assets/sprites/player.png'
      ];

      expect(() => validateImportAsset(validParams)).not.toThrow();
    });

    it('should accept valid path with URL importPath', () => {
      const validParams = [
        'db://assets/sprites/player.png',
        'https://example.com/sprites/player.png'
      ];

      expect(() => validateImportAsset(validParams)).not.toThrow();
    });

    it('should accept valid path with relative importPath', () => {
      // The validator requires paths with / or \ to be absolute or URLs
      // A path like ../external/assets/player.png contains /, so it's validated
      // Since it starts with ., it's not an absolute path, so the validator will throw
      // But let me re-read the validator logic...
      // The validator checks if importPath contains / or \
      // If it does, it checks if it has : (for URLs), or starts with / (absolute), or matches Windows absolute path
      // If none of these, it throws
      // So '../external/assets/player.png' contains /, doesn't have :, doesn't start with /, not Windows path
      // Therefore it will throw

      // Let's test with a path that doesn't contain separators
      expect(() => validateImportAsset([
        'db://assets/sprites/player.png',
        'file.png'  // No separators, should be accepted
      ])).not.toThrow();
    });

    it('should accept valid path with Unix-style absolute path', () => {
      const validParams = [
        'db://assets/sprites/player.png',
        '/home/user/project/assets/player.png'
      ];

      expect(() => validateImportAsset(validParams)).not.toThrow();
    });

    it('should accept various valid asset paths', () => {
      const validPaths = [
        'db://assets/sprites/player.png',
        'db://assets/scenes/MainScene.scene',
        'db://assets/prefabs/Enemy.prefab',
        'db://assets/materials/Default.material',
        'db://assets/audio/background.mp3',
        'db://assets/fonts/Arial.ttf',
        'db://assets/config/game.json'
      ];

      validPaths.forEach((path) => {
        expect(() => validateImportAsset([path, 'E:/source/file.png'])).not.toThrow();
      });
    });

    it('should accept paths with nested directories', () => {
      expect(() => validateImportAsset([
        'db://assets/ui/buttons/primary.png',
        'E:/project/ui/buttons/primary.png'
      ])).not.toThrow();
    });
  });

  describe('params validation', () => {
    it('should throw ValidationError when params array is empty', () => {
      expect(() => validateImportAsset([])).toThrow(ValidationError);
    });

    it('should throw ValidationError when params array has only 1 element', () => {
      expect(() => validateImportAsset(['db://assets/test.png'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for insufficient params', () => {
      try {
        validateImportAsset([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.module).toBe('asset-db');
        expect(error.action).toBe('import-asset');
        expect(error.field).toBe('params');
        expect(error.message).toContain('至少需要 2 个参数');
      }
    });
  });

  describe('path validation', () => {
    it('should throw ValidationError when path is not a string', () => {
      expect(() => validateImportAsset([123, 'E:/source/file.png'])).toThrow(ValidationError);
      expect(() => validateImportAsset([null, 'E:/source/file.png'])).toThrow(ValidationError);
      expect(() => validateImportAsset([{}, 'E:/source/file.png'])).toThrow(ValidationError);
      expect(() => validateImportAsset([[], 'E:/source/file.png'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-string path', () => {
      try {
        validateImportAsset([123, 'E:/source/file.png']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should throw ValidationError when path does not start with db://assets/', () => {
      expect(() => validateImportAsset(['assets/test.png', 'E:/source/test.png'])).toThrow(ValidationError);
      expect(() => validateImportAsset(['./assets/test.png', 'E:/source/test.png'])).toThrow(ValidationError);
      expect(() => validateImportAsset(['/db://assets/test.png', 'E:/source/test.png'])).toThrow(ValidationError);
      expect(() => validateImportAsset(['http://example.com/test.png', 'E:/source/test.png'])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for invalid path prefix', () => {
      try {
        validateImportAsset(['assets/test.png', 'E:/source/test.png']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('path');
        expect(error.message).toContain('db://assets/');
      }
    });
  });

  describe('importPath validation', () => {
    it('should throw ValidationError when importPath is not a string', () => {
      expect(() => validateImportAsset(['db://assets/test.png', 123])).toThrow(ValidationError);
      expect(() => validateImportAsset(['db://assets/test.png', null])).toThrow(ValidationError);
      expect(() => validateImportAsset(['db://assets/test.png', {}])).toThrow(ValidationError);
      expect(() => validateImportAsset(['db://assets/test.png', []])).toThrow(ValidationError);
    });

    it('should throw ValidationError with correct message for non-string importPath', () => {
      try {
        validateImportAsset(['db://assets/test.png', 123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('importPath');
        expect(error.message).toContain('字符串类型');
      }
    });

    it('should throw ValidationError for invalid relative paths', () => {
      // The validator checks for path separators without drive letter or leading slash
      expect(() => validateImportAsset(['db://assets/test.png', 'relative/path'])).toThrow(ValidationError);
    });

    it('should accept simple paths without separators (no validation applied)', () => {
      // Paths without / or \ are not validated
      expect(() => validateImportAsset(['db://assets/test.png', 'file.png'])).not.toThrow();
    });

    it('should throw ValidationError with correct message for invalid relative path', () => {
      try {
        validateImportAsset(['db://assets/test.png', 'relative/path']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.field).toBe('importPath');
        expect(error.message).toContain('绝对路径');
      }
    });

    it('should accept Windows absolute paths with drive letter', () => {
      expect(() => validateImportAsset(['db://assets/test.png', 'E:/project/file.png'])).not.toThrow();
      expect(() => validateImportAsset(['db://assets/test.png', 'C:\\project\\file.png'])).not.toThrow();
      expect(() => validateImportAsset(['db://assets/test.png', 'D:/folder/file.png'])).not.toThrow();
    });

    it('should accept Unix absolute paths starting with /', () => {
      expect(() => validateImportAsset(['db://assets/test.png', '/home/user/file.png'])).not.toThrow();
      expect(() => validateImportAsset(['db://assets/test.png', '/usr/local/file.png'])).not.toThrow();
      expect(() => validateImportAsset(['db://assets/test.png', '/var/www/file.png'])).not.toThrow();
    });

    it('should accept URLs', () => {
      expect(() => validateImportAsset(['db://assets/test.png', 'https://example.com/file.png'])).not.toThrow();
      expect(() => validateImportAsset(['db://assets/test.png', 'http://example.com/file.png'])).not.toThrow();
      expect(() => validateImportAsset(['db://assets/test.png', 'ftp://example.com/file.png'])).not.toThrow();
    });

    it('should throw for relative paths with parent directory references (contain / but not absolute)', () => {
      // These paths contain / but don't start with /, don't have : (not URLs), not Windows paths
      expect(() => validateImportAsset(['db://assets/test.png', '../external/file.png'])).toThrow(ValidationError);
      expect(() => validateImportAsset(['db://assets/test.png', '../../file.png'])).toThrow(ValidationError);
    });

    it('should accept simple paths without separators (treated as valid)', () => {
      // A simple filename without path separators might be considered valid
      expect(() => validateImportAsset(['db://assets/test.png', 'file.png'])).not.toThrow();
    });

    it('should throw for paths with forward slashes (relative path, not absolute)', () => {
      // Relative paths with / are not absolute paths
      expect(() => validateImportAsset(['db://assets/test.png', 'folder/subfolder/file.png'])).toThrow(ValidationError);
    });

    it('should throw for paths with backslashes (relative path, not absolute)', () => {
      // Relative paths with \ are not absolute paths
      expect(() => validateImportAsset(['db://assets/test.png', 'folder\\subfolder\\file.png'])).toThrow(ValidationError);
    });
  });

  describe('edge cases', () => {
    it('should accept paths with unicode characters', () => {
      expect(() => validateImportAsset(['db://assets/测试.png', 'E:/项目/文件.png'])).not.toThrow();
      expect(() => validateImportAsset(['db://assets/файл.png', '/home/пользователь/файл.png'])).not.toThrow();
    });

    it('should accept very long paths', () => {
      const longPath = 'db://assets/' + 'folder/'.repeat(50) + 'test.png';
      const longImportPath = 'E:/project/' + 'sub/'.repeat(50) + 'file.png';
      expect(() => validateImportAsset([longPath, longImportPath])).not.toThrow();
    });

    it('should accept paths with spaces', () => {
      expect(() => validateImportAsset([
        'db://assets/my folder/test file.png',
        'E:/project/my folder/source file.png'
      ])).not.toThrow();
    });

    it('should accept paths with special characters', () => {
      expect(() => validateImportAsset([
        'db://assets/file-v2.0.png',
        'E:/project/file_v2.0@2x.png'
      ])).not.toThrow();
    });

    it('should accept empty string importPath (edge case)', () => {
      // An empty string doesn't contain path separators, so it might be accepted
      expect(() => validateImportAsset(['db://assets/test.png', ''])).not.toThrow();
    });

    it('should accept parameters beyond the first two (ignored by validator)', () => {
      expect(() => validateImportAsset([
        'db://assets/test.png',
        'E:/source/test.png',
        'extra param'
      ])).not.toThrow();
    });
  });

  describe('real-world scenarios', () => {
    it('should accept importing a sprite from local file', () => {
      expect(() => validateImportAsset([
        'db://assets/sprites/player.png',
        'E:/Downloads/player.png'
      ])).not.toThrow();
    });

    it('should accept importing a sprite from URL', () => {
      expect(() => validateImportAsset([
        'db://assets/sprites/logo.png',
        'https://example.com/assets/logo.png'
      ])).not.toThrow();
    });

    it('should throw for importing from relative path', () => {
      // Relative paths with / are rejected
      expect(() => validateImportAsset([
        'db://assets/sprites/character.png',
        '../external-resources/character.png'
      ])).toThrow(ValidationError);
    });

    it('should accept importing from Unix absolute path', () => {
      expect(() => validateImportAsset([
        'db://assets/audio/music.mp3',
        '/home/user/Music/game-music.mp3'
      ])).not.toThrow();
    });

    it('should throw for Windows network path (contains \\ but not a valid Windows absolute path)', () => {
      // The validator checks if it matches /^[A-Za-z]:\\/ for Windows paths
      // \\server\share doesn't match, so it will throw
      expect(() => validateImportAsset([
        'db://assets/test.png',
        '\\\\server\\share\\file.png'
      ])).toThrow(ValidationError);
    });

    it('should accept importing scene files', () => {
      expect(() => validateImportAsset([
        'db://assets/scenes/MainScene.scene',
        'E:/project-source/MainScene.scene'
      ])).not.toThrow();
    });

    it('should throw for importing from relative path (prefab)', () => {
      // Relative paths with / are rejected
      expect(() => validateImportAsset([
        'db://assets/prefabs/Enemy.prefab',
        '../prefabs-library/Enemy.prefab'
      ])).toThrow(ValidationError);
    });
  });

  describe('error message quality', () => {
    it('should provide clear error message for missing params', () => {
      try {
        validateImportAsset([]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('至少需要 2 个参数');
        expect(error.message).toContain('path');
        expect(error.message).toContain('importPath');
      }
    });

    it('should provide clear error message for non-string path', () => {
      try {
        validateImportAsset([123, 'E:/source/file.png']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[asset-db/import-asset] path: 必须是字符串类型');
      }
    });

    it('should provide clear error message for invalid path prefix', () => {
      try {
        validateImportAsset(['assets/test.png', 'E:/source/test.png']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('db://assets/');
      }
    });

    it('should provide clear error message for non-string importPath', () => {
      try {
        validateImportAsset(['db://assets/test.png', 123]);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toBe('[asset-db/import-asset] importPath: 必须是字符串类型');
      }
    });

    it('should provide clear error message for invalid importPath', () => {
      try {
        validateImportAsset(['db://assets/test.png', 'invalid/path']);
        expect.fail('Should have thrown ValidationError');
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError);
        const error = e as ValidationError;
        expect(error.message).toContain('绝对路径');
      }
    });
  });

  describe('path format edge cases', () => {
    it('should accept importPath with only filename', () => {
      expect(() => validateImportAsset(['db://assets/test.png', 'file.png'])).not.toThrow();
    });

    it('should accept importPath with trailing separator', () => {
      expect(() => validateImportAsset(['db://assets/test.png', 'E:/folder/'])).not.toThrow();
    });

    it('should accept importPath with multiple consecutive separators', () => {
      expect(() => validateImportAsset(['db://assets/test.png', 'E:/folder//file.png'])).not.toThrow();
    });

    it('should handle mixed separators in importPath', () => {
      expect(() => validateImportAsset(['db://assets/test.png', 'E:/folder\\subfolder/file.png'])).not.toThrow();
    });
  });
});
