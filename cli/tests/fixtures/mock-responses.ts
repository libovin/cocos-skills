/**
 * Mock API responses for testing
 * Provides helper functions and predefined mock responses for Cocos Creator HTTP API
 */

import type { ApiResponse } from '../../src/types.js';
import {
  TEST_SCENE_PATH,
  TEST_NODE_UUID,
  TEST_COMPONENT_UUID,
  DEFAULT_MOCK_NODE,
  DEFAULT_MOCK_SCENE,
  MOCK_NODE_TREE,
  MOCK_COMPONENT_TYPES,
} from './scene-data.js';

/**
 * Create a successful API response
 */
export function successResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Create an error API response
 */
export function errorResponse(message: string): ApiResponse {
  return {
    success: false,
    error: message,
  };
}

// ============================================================================
// Scene operation mock responses
// ============================================================================

export const mockOpenSceneResponse = successResponse({
  path: TEST_SCENE_PATH,
  name: 'SceneTest',
  loaded: true,
});

export const mockSaveSceneResponse = successResponse({
  path: TEST_SCENE_PATH,
  saved: true,
});

export const mockSaveAsSceneResponse = successResponse({
  path: 'db://assets/NewScene.scene',
  created: true,
});

export const mockCloseSceneResponse = successResponse({
  closed: true,
});

export const mockQueryIsReadyResponse = successResponse({
  ready: true,
});

// ============================================================================
// Property operation mock responses
// ============================================================================

export const mockSetPropertyResponse = successResponse({
  uuid: TEST_NODE_UUID,
  path: 'position',
  updated: true,
});

export const mockResetPropertyResponse = successResponse({
  uuid: TEST_NODE_UUID,
  path: 'position',
  reset: true,
});

export const mockMoveArrayElementResponse = successResponse({
  moved: true,
  fromIndex: 0,
  toIndex: 2,
});

export const mockRemoveArrayElementResponse = successResponse({
  removed: true,
  index: 1,
});

// ============================================================================
// Node operation mock responses
// ============================================================================

export const mockCreateNodeResponse = successResponse({
  uuid: TEST_NODE_UUID,
  name: 'NewNode',
  created: true,
});

export const mockRemoveNodeResponse = successResponse({
  uuid: TEST_NODE_UUID,
  removed: true,
});

export const mockResetNodeResponse = successResponse({
  uuid: TEST_NODE_UUID,
  reset: true,
});

export const mockCopyNodeResponse = successResponse({
  uuid: `${TEST_NODE_UUID}-copy`,
  originalUuid: TEST_NODE_UUID,
  copied: true,
});

export const mockDuplicateNodeResponse = successResponse({
  uuid: `${TEST_NODE_UUID}-duplicate`,
  originalUuid: TEST_NODE_UUID,
  duplicated: true,
});

export const mockPasteNodeResponse = successResponse({
  uuid: `${TEST_NODE_UUID}-pasted`,
  pasted: true,
});

export const mockCutNodeResponse = successResponse({
  uuid: TEST_NODE_UUID,
  cut: true,
});

export const mockSetParentResponse = successResponse({
  uuid: TEST_NODE_UUID,
  parentUuid: 'parent-node-uuid',
  updated: true,
});

// ============================================================================
// Component operation mock responses
// ============================================================================

export const mockCreateComponentResponse = successResponse({
  uuid: TEST_COMPONENT_UUID,
  type: 'cc.Sprite',
  created: true,
});

export const mockRemoveComponentResponse = successResponse({
  uuid: TEST_COMPONENT_UUID,
  removed: true,
});

export const mockResetComponentResponse = successResponse({
  uuid: TEST_COMPONENT_UUID,
  reset: true,
});

export const mockExecuteComponentMethodResponse = successResponse({
  uuid: TEST_COMPONENT_UUID,
  method: 'someMethod',
  result: null,
});

export const mockRestorePrefabResponse = successResponse({
  uuid: TEST_NODE_UUID,
  restored: true,
});

// ============================================================================
// Query operation mock responses
// ============================================================================

export const mockQueryNodeResponse = successResponse({
  ...DEFAULT_MOCK_NODE,
});

export const mockQueryComponentResponse = successResponse({
  uuid: TEST_COMPONENT_UUID,
  type: 'cc.Sprite',
  enabled: true,
  properties: {
    _color: { r: 255, g: 255, b: 255, a: 255 },
  },
});

export const mockQueryNodeTreeResponse = successResponse({
  nodes: Object.values(MOCK_NODE_TREE),
});

export const mockQueryNodesByAssetUuidResponse = successResponse({
  uuids: [TEST_NODE_UUID, `${TEST_NODE_UUID}-2`, `${TEST_NODE_UUID}-3`],
  count: 3,
});

export const mockQueryDirtyResponse = successResponse({
  dirty: false,
});

export const mockQueryClassesResponse = successResponse({
  classes: MOCK_COMPONENT_TYPES,
});

export const mockQueryComponentsResponse = successResponse({
  components: MOCK_COMPONENT_TYPES,
});

export const mockQueryComponentHasScriptResponse = successResponse({
  hasScript: true,
  scriptPath: 'db://assets/scripts/MyComponent.ts',
});

export const mockQuerySceneBoundsResponse = successResponse({
  min: { x: -100, y: -100, z: 0 },
  max: { x: 100, y: 100, z: 0 },
});

export const mockIsNativeResponse = successResponse({
  isNative: false,
});

// ============================================================================
// Gizmo operation mock responses
// ============================================================================

export const mockChangeGizmoToolResponse = successResponse({
  tool: 'move',
  changed: true,
});

export const mockQueryGizmoToolNameResponse = successResponse({
  tool: 'move',
});

export const mockChangeGizmoPivotResponse = successResponse({
  pivot: 'center',
  changed: true,
});

export const mockQueryGizmoPivotResponse = successResponse({
  pivot: 'center',
});

export const mockChangeGizmoCoordinateResponse = successResponse({
  coordinate: 'world',
  changed: true,
});

export const mockQueryGizmoCoordinateResponse = successResponse({
  coordinate: 'world',
});

// ============================================================================
// View and display operation mock responses
// ============================================================================

export const mockChangeIs2DResponse = successResponse({
  is2D: true,
  changed: true,
});

export const mockQueryIs2DResponse = successResponse({
  is2D: false,
});

export const mockSetGridVisibleResponse = successResponse({
  visible: true,
  set: true,
});

export const mockQueryIsGridVisibleResponse = successResponse({
  visible: true,
});

export const mockSetIconGizmo3DResponse = successResponse({
  is3D: true,
  set: true,
});

export const mockQueryIsIconGizmo3DResponse = successResponse({
  is3D: false,
});

export const mockSetIconGizmoSizeResponse = successResponse({
  size: 10,
  set: true,
});

export const mockQueryIconGizmoSizeResponse = successResponse({
  size: 8,
});

// ============================================================================
// Camera operation mock responses
// ============================================================================

export const mockFocusCameraResponse = successResponse({
  uuid: TEST_NODE_UUID,
  focused: true,
});

export const mockAlignWithViewResponse = successResponse({
  aligned: true,
});

export const mockAlignViewWithNodeResponse = successResponse({
  uuid: TEST_NODE_UUID,
  aligned: true,
});

// ============================================================================
// Script execution mock responses
// ============================================================================

export const mockExecuteSceneScriptResponse = successResponse({
  result: 'script executed successfully',
});

// ============================================================================
// Snapshot operation mock responses
// ============================================================================

export const mockSnapshotResponse = successResponse({
  snapshotId: 'snapshot-123',
  created: true,
});

export const mockSnapshotAbortResponse = successResponse({
  aborted: true,
});

export const mockSoftReloadResponse = successResponse({
  reloaded: true,
});

// ============================================================================
// Asset database mock responses
// ============================================================================

export const mockQueryReadyResponse = successResponse({
  ready: true,
});

export const mockCreateAssetResponse = successResponse({
  path: 'db://assets/NewAsset.json',
  uuid: 'new-asset-uuid',
  created: true,
});

export const mockImportAssetResponse = successResponse({
  path: '/path/to/file.png',
  imported: true,
});

export const mockCopyAssetResponse = successResponse({
  fromPath: 'db://assets/OldAsset.json',
  toPath: 'db://assets/NewAsset.json',
  copied: true,
});

export const mockMoveAssetResponse = successResponse({
  fromPath: 'db://assets/OldLocation/Asset.json',
  toPath: 'db://assets/NewLocation/Asset.json',
  moved: true,
});

export const mockDeleteAssetResponse = successResponse({
  path: 'db://assets/DeletedAsset.json',
  deleted: true,
});

export const mockOpenAssetResponse = successResponse({
  path: 'db://assets/Asset.json',
  opened: true,
});

export const mockSaveAssetResponse = successResponse({
  path: 'db://assets/Asset.json',
  saved: true,
});

export const mockReimportAssetResponse = successResponse({
  path: 'db://assets/Asset.json',
  reimported: true,
});

export const mockRefreshAssetResponse = successResponse({
  path: 'db://assets/Asset.json',
  refreshed: true,
});

export const mockQueryAssetInfoResponse = successResponse({
  path: 'db://assets/Asset.json',
  uuid: 'asset-uuid',
  type: 'asset',
  imported: true,
});

export const mockQueryAssetMetaResponse = successResponse({
  path: 'db://assets/Asset.json',
  meta: {
    imported: true,
    uuid: 'asset-uuid',
  },
});

export const mockQueryAssetUsersResponse = successResponse({
  users: ['db://assets/Scene1.scene', 'db://assets/Scene2.scene'],
  count: 2,
});

export const mockQueryAssetDependenciesResponse = successResponse({
  dependencies: [
    { path: 'db://assets/Dep1.asset', uuid: 'dep1-uuid' },
    { path: 'db://assets/Dep2.asset', uuid: 'dep2-uuid' },
  ],
  count: 2,
});

export const mockQueryPathResponse = successResponse({
  path: '/absolute/path/to/assets/Asset.json',
});

export const mockQueryUrlResponse = successResponse({
  url: 'db://assets/Asset.json',
});

export const mockQueryUuidResponse = successResponse({
  uuid: 'asset-uuid',
});

export const mockQueryAssetsResponse = successResponse({
  assets: [
    { path: 'db://assets/Asset1.json', uuid: 'asset1-uuid' },
    { path: 'db://assets/Asset2.json', uuid: 'asset2-uuid' },
  ],
  count: 2,
});

export const mockGenerateAvailableUrlResponse = successResponse({
  url: 'db://assets/NewAsset (1).json',
});

// ============================================================================
// Project operation mock responses
// ============================================================================

export const mockQueryConfigResponse = successResponse({
  config: {
    key: 'value',
  },
});

export const mockSetConfigResponse = successResponse({
  updated: true,
});

// ============================================================================
// Server operation mock responses
// ============================================================================

export const mockHealthCheckResponse = successResponse({
  status: 'ok',
  timestamp: Date.now(),
});

export const mockGetStatusResponse = successResponse({
  version: '1.0.0',
  running: true,
});

export const mockGetModulesResponse = successResponse({
  modules: ['scene', 'asset-db', 'project', 'builder', 'engine', 'information', 'preferences', 'program', 'programming', 'server', 'device', 'extension'],
});

export const mockGetModuleActionsResponse = successResponse({
  module: 'scene',
  actions: ['open-scene', 'save-scene', 'create-node', 'remove-node'],
});

// ============================================================================
// Error responses
// ============================================================================

export const mockInvalidModuleResponse = errorResponse('Invalid module: unknown-module');

export const mockInvalidActionResponse = errorResponse('Invalid action: unknown-action for module: scene');

export const mockInvalidParamsResponse = errorResponse('Invalid parameters: missing required parameter "uuid"');

export const mockNodeNotFoundResponse = errorResponse('Node not found: ' + TEST_NODE_UUID);

export const mockAssetNotFoundResponse = errorResponse('Asset not found: db://assets/MissingAsset.json');

export const mockSceneNotReadyResponse = errorResponse('Scene not ready');

export const mockNetworkErrorResponse = errorResponse('Network error: Failed to connect to server');

export const mockTimeoutErrorResponse = errorResponse('Request timeout: Server did not respond in time');
