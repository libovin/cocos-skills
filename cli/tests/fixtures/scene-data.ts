/**
 * Test fixtures for scene-related tests
 * Provides mock data structures for nodes, components, and scenes
 */

/**
 * Test scene path constant
 */
export const TEST_SCENE_PATH = 'db://assets/SceneTest.scene';

/**
 * Test node UUID constant
 */
export const TEST_NODE_UUID = 'test-node-uuid-12345';

/**
 * Test component UUID constant
 */
export const TEST_COMPONENT_UUID = 'test-component-uuid-67890';

/**
 * Test asset UUID constant
 */
export const TEST_ASSET_UUID = 'test-asset-uuid-abcde';

/**
 * Mock node data structure
 */
export interface MockNodeData {
  uuid: string;
  name: string;
  parent: string | null;
  children: string[];
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  active: boolean;
  components: MockComponentData[];
}

/**
 * Mock component data structure
 */
export interface MockComponentData {
  uuid: string;
  type: string;
  enabled: boolean;
  properties: Record<string, unknown>;
}

/**
 * Mock scene data structure
 */
export interface MockSceneData {
  path: string;
  name: string;
  uuid: string;
  nodes: MockNodeData[];
  dirty: boolean;
}

/**
 * Default mock node data
 */
export const DEFAULT_MOCK_NODE: MockNodeData = {
  uuid: TEST_NODE_UUID,
  name: 'TestNode',
  parent: null,
  children: [],
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0, w: 1 },
  scale: { x: 1, y: 1, z: 1 },
  active: true,
  components: [],
};

/**
 * Default mock component data (Sprite)
 */
export const DEFAULT_MOCK_SPRITE_COMPONENT: MockComponentData = {
  uuid: TEST_COMPONENT_UUID,
  type: 'cc.Sprite',
  enabled: true,
  properties: {
    _color: { r: 255, g: 255, b: 255, a: 255 },
    spriteFrame: null,
    sizeMode: 0,
  },
};

/**
 * Default mock component data (UITransform)
 */
export const DEFAULT_MOCK_UI_TRANSFORM_COMPONENT: MockComponentData = {
  uuid: 'test-ui-transform-uuid',
  type: 'cc.UITransform',
  enabled: true,
  properties: {
    _contentSize: { width: 100, height: 100 },
    _anchorPoint: { x: 0.5, y: 0.5 },
  },
};

/**
 * Default mock component data (Label)
 */
export const DEFAULT_MOCK_LABEL_COMPONENT: MockComponentData = {
  uuid: 'test-label-uuid',
  type: 'cc.Label',
  enabled: true,
  properties: {
    string: 'Test Label',
    _color: { r: 255, g: 255, b: 255, a: 255 },
    fontSize: 40,
  },
};

/**
 * Default mock scene data
 */
export const DEFAULT_MOCK_SCENE: MockSceneData = {
  path: TEST_SCENE_PATH,
  name: 'SceneTest',
  uuid: 'test-scene-uuid',
  nodes: [DEFAULT_MOCK_NODE],
  dirty: false,
};

/**
 * Mock node tree data (parent-child relationships)
 */
export const MOCK_NODE_TREE: Record<string, MockNodeData> = {
  'canvas-uuid': {
    uuid: 'canvas-uuid',
    name: 'Canvas',
    parent: null,
    children: ['parent-node-uuid', 'child-node-uuid-1'],
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    active: true,
    components: [DEFAULT_MOCK_UI_TRANSFORM_COMPONENT],
  },
  'parent-node-uuid': {
    uuid: 'parent-node-uuid',
    name: 'ParentNode',
    parent: 'canvas-uuid',
    children: ['child-node-uuid-2'],
    position: { x: 100, y: 100, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    active: true,
    components: [
      DEFAULT_MOCK_SPRITE_COMPONENT,
      DEFAULT_MOCK_UI_TRANSFORM_COMPONENT,
    ],
  },
  'child-node-uuid-1': {
    uuid: 'child-node-uuid-1',
    name: 'ChildNode1',
    parent: 'canvas-uuid',
    children: [],
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    active: true,
    components: [DEFAULT_MOCK_LABEL_COMPONENT],
  },
  'child-node-uuid-2': {
    uuid: 'child-node-uuid-2',
    name: 'ChildNode2',
    parent: 'parent-node-uuid',
    children: [],
    position: { x: 50, y: 50, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    scale: { x: 0.5, y: 0.5, z: 1 },
    active: true,
    components: [
      DEFAULT_MOCK_SPRITE_COMPONENT,
      DEFAULT_MOCK_UI_TRANSFORM_COMPONENT,
    ],
  },
};

/**
 * Mock component types list
 */
export const MOCK_COMPONENT_TYPES = [
  'cc.Sprite',
  'cc.UITransform',
  'cc.Label',
  'cc.Button',
  'cc.Widget',
  'cc.Layout',
  'cc.Animation',
  'cc.RigidBody2D',
  'cc.BoxCollider2D',
];

/**
 * Helper function to create a mock node with custom properties
 */
export function createMockNode(
  overrides: Partial<MockNodeData> = {}
): MockNodeData {
  return {
    ...DEFAULT_MOCK_NODE,
    uuid: `node-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    ...overrides,
  };
}

/**
 * Helper function to create a mock component with custom properties
 */
export function createMockComponent(
  type: string,
  overrides: Partial<MockComponentData> = {}
): MockComponentData {
  return {
    uuid: `comp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    type,
    enabled: true,
    properties: {},
    ...overrides,
  };
}

/**
 * Helper function to create a nested node tree
 */
export function createMockNodeTree(depth: number, childrenPerNode: number): MockNodeData[] {
  const nodes: MockNodeData[] = [];
  let nodeCount = 0;

  function createNode(parent: string | null, currentDepth: number): string {
    const uuid = `tree-node-${nodeCount++}`;
    const node: MockNodeData = {
      uuid,
      name: `TreeNode${nodeCount}`,
      parent,
      children: [],
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 1, y: 1, z: 1 },
      active: true,
      components: [],
    };

    nodes.push(node);

    if (currentDepth < depth) {
      for (let i = 0; i < childrenPerNode; i++) {
        const childUuid = createNode(uuid, currentDepth + 1);
        node.children.push(childUuid);
      }
    }

    return uuid;
  }

  createNode(null, 0);
  return nodes;
}
