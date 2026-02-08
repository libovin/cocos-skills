/**
 * Unit tests for node-preprocessor
 * Tests for scene/create-node action parameter preprocessing
 */

import { describe, it, expect } from 'vitest';
import {
  preprocessCreateNode,
  getComponentsForNodeType,
  isKnownNodeType,
} from '../../../src/lib/node-preprocessor.js';

describe('node-preprocessor', () => {
  describe('preprocessCreateNode', () => {
    it('should return nodeParams without type when type is not specified', () => {
      const params = [{ name: 'TestNode', parent: 'Canvas' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({ name: 'TestNode', parent: 'Canvas' });
      expect(result.componentsToAdd).toBeUndefined();
    });

    it('should return nodeParams with empty object when type is not specified', () => {
      const params = [{}];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toBeUndefined();
    });

    it('should extract components for cc.Canvas type', () => {
      const params = [{ type: 'cc.Canvas', name: 'MyCanvas' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({ name: 'MyCanvas' });
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Canvas', 'cc.Widget']);
      expect(result.children).toEqual([{ type: 'cc.Camera', name: 'Camera' }]);
    });

    it('should extract components for cc.Sprite type', () => {
      const params = [{ type: 'cc.Sprite' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Sprite']);
    });

    it('should extract components for cc.Label type', () => {
      const params = [{ type: 'cc.Label' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Label']);
    });

    it('should extract components for cc.Button type', () => {
      const params = [{ type: 'cc.Button' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Button', 'cc.Sprite']);
    });

    it('should extract components for cc.Layout type', () => {
      const params = [{ type: 'cc.Layout' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Layout']);
    });

    it('should extract components for cc.ScrollView type', () => {
      const params = [{ type: 'cc.ScrollView' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.ScrollView', 'cc.Widget']);
    });

    it('should extract components for cc.EditBox type', () => {
      const params = [{ type: 'cc.EditBox' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Sprite', 'cc.EditBox']);
      expect(result.children).toEqual([
        { type: 'cc.Label', name: 'PLACEHOLDER_LABEL' },
        { type: 'cc.Label', name: 'TEXT_LABEL' },
      ]);
    });

    it('should extract components for cc.Toggle type', () => {
      const params = [{ type: 'cc.Toggle' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Toggle', 'cc.Sprite']);
    });

    it('should extract components for cc.Slider type', () => {
      const params = [{ type: 'cc.Slider' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Slider', 'cc.Sprite']);
    });

    it('should extract components for cc.ProgressBar type', () => {
      const params = [{ type: 'cc.ProgressBar' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.ProgressBar', 'cc.Sprite']);
    });

    it('should extract components for cc.RichText type', () => {
      const params = [{ type: 'cc.RichText' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.RichText']);
    });

    it('should extract components for cc.BlockInputEvents type', () => {
      const params = [{ type: 'cc.BlockInputEvents' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.BlockInputEvents']);
    });

    it('should extract components for cc.Widget type', () => {
      const params = [{ type: 'cc.Widget' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Widget']);
    });

    it('should return empty components for unknown type', () => {
      const params = [{ type: 'cc.UnknownType' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({});
      expect(result.componentsToAdd).toBeUndefined();
    });

    it('should preserve other params when type is specified', () => {
      const params = [{ type: 'cc.Sprite', name: 'MySprite', parent: 'Canvas' }];
      const result = preprocessCreateNode(params);

      expect(result.nodeParams).toEqual({ name: 'MySprite', parent: 'Canvas' });
      expect(result.componentsToAdd).toEqual(['cc.UITransform', 'cc.Sprite']);
    });
  });

  describe('getComponentsForNodeType', () => {
    it('should return correct components for cc.Canvas', () => {
      const components = getComponentsForNodeType('cc.Canvas');
      expect(components).toEqual(['cc.UITransform', 'cc.Canvas', 'cc.Widget']);
    });

    it('should return correct components for cc.Sprite', () => {
      const components = getComponentsForNodeType('cc.Sprite');
      expect(components).toEqual(['cc.UITransform', 'cc.Sprite']);
    });

    it('should return correct components for cc.Label', () => {
      const components = getComponentsForNodeType('cc.Label');
      expect(components).toEqual(['cc.UITransform', 'cc.Label']);
    });

    it('should return empty array for unknown type', () => {
      const components = getComponentsForNodeType('cc.UnknownType');
      expect(components).toEqual([]);
    });
  });

  describe('isKnownNodeType', () => {
    it('should return true for known node types', () => {
      expect(isKnownNodeType('cc.Canvas')).toBe(true);
      expect(isKnownNodeType('cc.Sprite')).toBe(true);
      expect(isKnownNodeType('cc.Label')).toBe(true);
      expect(isKnownNodeType('cc.Button')).toBe(true);
      expect(isKnownNodeType('cc.Layout')).toBe(true);
    });

    it('should return false for unknown node types', () => {
      expect(isKnownNodeType('cc.UnknownType')).toBe(false);
      expect(isKnownNodeType('SomeRandomType')).toBe(false);
    });
  });
});
