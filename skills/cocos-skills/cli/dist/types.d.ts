/**
 * Type definitions for Cocos Creator HTTP API
 * Ported from scripts/client.py
 */
/**
 * API Response structure
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}
/**
 * Cocos HTTP configuration file structure
 */
export interface CocosHttpConfig {
    currentProject?: string;
    projects: Record<string, ProjectConfig>;
}
/**
 * Project configuration
 */
export interface ProjectConfig {
    serverUrl: string;
}
/**
 * Valid modules and their actions
 * Ported from scripts/client.py:20-154
 */
export declare const VALID_MODULES: {
    readonly scene: readonly ["open-scene", "save-scene", "save-as-scene", "close-scene", "set-property", "reset-property", "move-array-element", "remove-array-element", "copy-node", "duplicate-node", "paste-node", "cut-node", "set-parent", "create-node", "remove-node", "reset-node", "reset-component", "restore-prefab", "create-component", "remove-component", "execute-component-method", "execute-scene-script", "snapshot", "snapshot-abort", "soft-reload", "change-gizmo-tool", "query-gizmo-tool-name", "change-gizmo-pivot", "query-gizmo-pivot", "change-gizmo-coordinate", "query-gizmo-coordinate", "change-is2D", "query-is2D", "set-grid-visible", "query-is-grid-visible", "set-icon-gizmo-3d", "query-is-icon-gizmo-3d", "set-icon-gizmo-size", "query-icon-gizmo-size", "focus-camera", "align-with-view", "align-view-with-node", "query-is-ready", "query-node", "query-component", "query-node-tree", "query-nodes-by-asset-uuid", "query-dirty", "query-classes", "query-components", "query-component-has-script", "query-scene-bounds", "is-native"];
    readonly 'asset-db': readonly ["query-ready", "create-asset", "import-asset", "copy-asset", "move-asset", "delete-asset", "open-asset", "save-asset", "save-asset-meta", "reimport-asset", "refresh-asset", "query-asset-info", "query-missing-asset-info", "query-asset-meta", "query-asset-users", "query-asset-dependencies", "query-path", "query-url", "query-uuid", "query-assets", "generate-available-url"];
    readonly project: readonly ["open-settings", "query-config", "set-config"];
    readonly builder: readonly ["open", "query-worker-ready"];
    readonly engine: readonly ["query-info", "query-engine-info"];
    readonly information: readonly ["query-information", "open-information-dialog", "has-dialog", "close-dialog"];
    readonly preferences: readonly ["open-settings", "query-config", "set-config"];
    readonly program: readonly ["query-program-info", "open-program", "open-url"];
    readonly programming: readonly ["query-shared-settings", "query-sorted-plugins"];
    readonly server: readonly ["query-ip-list", "query-port"];
    readonly device: readonly ["query"];
    readonly extension: readonly ["create-extension-template"];
};
/**
 * Module names
 */
export type ModuleName = keyof typeof VALID_MODULES;
/**
 * Actions for each module
 */
export type SceneAction = typeof VALID_MODULES.scene[number];
export type AssetDbAction = typeof VALID_MODULES['asset-db'][number];
export type ProjectAction = typeof VALID_MODULES.project[number];
export type BuilderAction = typeof VALID_MODULES.builder[number];
export type EngineAction = typeof VALID_MODULES.engine[number];
export type InformationAction = typeof VALID_MODULES.information[number];
export type PreferencesAction = typeof VALID_MODULES.preferences[number];
export type ProgramAction = typeof VALID_MODULES.program[number];
export type ProgrammingAction = typeof VALID_MODULES.programming[number];
export type ServerAction = typeof VALID_MODULES.server[number];
export type DeviceAction = typeof VALID_MODULES.device[number];
export type ExtensionAction = typeof VALID_MODULES.extension[number];
/**
 * Union type of all actions for a given module
 */
export type ActionForModule<M extends ModuleName> = typeof VALID_MODULES[M][number];
/**
 * All valid modules as an array
 */
export declare const MODULE_NAMES: ModuleName[];
//# sourceMappingURL=types.d.ts.map