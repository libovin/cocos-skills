/**
 * Request Preprocessor Manager
 * Centralized management of request preprocessing logic for different module/actions
 */

import { generateDefaultAssetData } from './asset-templates.js';
import { preprocessCreateNode } from './node-preprocessor.js';
import type { ApiResponse } from '../types.js';

/**
 * Preprocessor result
 */
export interface PreprocessorResult {
  params: unknown[];
  postProcess?: (result: ApiResponse) => Promise<ApiResponse>;
}

/**
 * Preprocessor function type
 */
export type PreprocessorFunction = (
  module: string,
  action: string,
  params: unknown[],
  client: any
) => Promise<PreprocessorResult> | PreprocessorResult;

/**
 * Preprocessor registry
 */
class PreprocessorRegistry {
  private preprocessors: Map<string, PreprocessorFunction> = new Map();

  /**
   * Register a preprocessor for a specific module/action
   * @param key Key in format "module:action"
   * @param preprocessor Preprocessor function
   */
  register(key: string, preprocessor: PreprocessorFunction): void {
    this.preprocessors.set(key, preprocessor);
  }

  /**
   * Get a preprocessor for a specific module/action
   * @param module Module name
   * @param action Action name
   * @returns Preprocessor function or undefined
   */
  get(module: string, action: string): PreprocessorFunction | undefined {
    return this.preprocessors.get(`${module}:${action}`);
  }

  /**
   * Check if a preprocessor exists for a specific module/action
   * @param module Module name
   * @param action Action name
   * @returns True if preprocessor exists
   */
  has(module: string, action: string): boolean {
    return this.preprocessors.has(`${module}:${action}`);
  }

  /**
   * Get all registered keys
   * @returns Array of registered keys
   */
  keys(): string[] {
    return Array.from(this.preprocessors.keys());
  }
}

/**
 * Global preprocessor registry instance
 */
const registry = new PreprocessorRegistry();

/**
 * Preprocessor for asset-db/create-asset
 * Generates default asset data if only path is provided
 */
function createAssetPreprocessor(
  module: string,
  action: string,
  params: unknown[]
): PreprocessorResult {
  if (params.length === 1 && typeof params[0] === 'string') {
    const path = params[0] as string;
    const defaultData = generateDefaultAssetData(path);
    return { params: [path, defaultData] };
  }
  return { params };
}

/**
 * Preprocessor for scene/create-node
 * Handles type parameter and adds components after node creation
 */
async function createNodePreprocessor(
  module: string,
  action: string,
  params: unknown[],
  client: any
): Promise<PreprocessorResult> {
  const { nodeParams, componentsToAdd } = preprocessCreateNode(params);
  const processedParams = [nodeParams];

  if (!componentsToAdd || componentsToAdd.length === 0) {
    return { params: processedParams };
  }

  return {
    params: processedParams,
    postProcess: async (result: ApiResponse) => {
      if (!result.success || !result.data) {
        return result;
      }

      // Handle both object { uuid: string } and string uuid formats
      const nodeUuid = typeof result.data === 'string' ? result.data : (result.data as any).uuid;
      if (!nodeUuid) {
        return result;
      }

      const addedComponents: string[] = [];

      for (const component of componentsToAdd) {
        const addResult = await client._request('POST', '/api/scene/create-component', {
          params: [{ uuid: nodeUuid, component }],
        });

        if (addResult.success) {
          addedComponents.push(component);
        }
      }

      // Convert data to object if it's a string
      if (typeof result.data === 'string') {
        result.data = { uuid: result.data };
      }
      (result.data as any).components = addedComponents;
      return result;
    },
  };
}

/**
 * Register all built-in preprocessors
 */
function registerBuiltinPreprocessors(): void {
  registry.register('asset-db:create-asset', createAssetPreprocessor);
  registry.register('scene:create-node', createNodePreprocessor);
}

/**
 * Initialize the preprocessor manager
 */
registerBuiltinPreprocessors();

/**
 * Preprocess a request
 * @param module Module name
 * @param action Action name
 * @param params Request parameters
 * @param client Client instance (for post-processing)
 * @returns Preprocessor result
 */
export function preprocessRequest(
  module: string,
  action: string,
  params: unknown[],
  client: any
): PreprocessorResult | Promise<PreprocessorResult> {
  const preprocessor = registry.get(module, action);
  if (!preprocessor) {
    return { params };
  }
  return preprocessor(module, action, params, client);
}

/**
 * Check if a preprocessor exists for a specific module/action
 * @param module Module name
 * @param action Action name
 * @returns True if preprocessor exists
 */
export function hasPreprocessor(module: string, action: string): boolean {
  return registry.has(module, action);
}

/**
 * Register a custom preprocessor
 * @param module Module name
 * @param action Action name
 * @param preprocessor Preprocessor function
 */
export function registerPreprocessor(
  module: string,
  action: string,
  preprocessor: PreprocessorFunction
): void {
  registry.register(`${module}:${action}`, preprocessor);
}

/**
 * Get all registered preprocessor keys
 * @returns Array of keys in format "module:action"
 */
export function getRegisteredPreprocessors(): string[] {
  return registry.keys();
}
