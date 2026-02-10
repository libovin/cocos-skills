/**
 * Postprocessor for scene/query-node-tree
 * 过滤和裁剪节点树数据
 */

import type { PostprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';

/**
 * Node tree structure
 */
interface SceneNode {
  uuid: string;
  name: string;
  path?: string;
  active?: boolean;
  locked?: boolean;
  children?: SceneNode[];
  [key: string]: unknown;
}

/**
 * Preset configurations for common use cases
 */
const PRESETS: Record<string, QueryNodeTreeOptions> = {
  /** Minimal: only uuid and name */
  minimal: {
    only: ['uuid', 'name'],
    withComponents: false,
  },
  /** Basic: uuid, name, path, active */
  basic: {
    only: ['uuid', 'name', 'path', 'active'],
    withComponents: false,
    maxDepth: null,
  },
  /** Shallow: first level only, all fields */
  shallow: {
    maxDepth: 1,
    withComponents: false,
  },
  /** Full: everything (default behavior) */
  full: {
    maxDepth: null,
    withComponents: true,
    onlyActive: false,
  },
};

/**
 * Query options for filtering the node tree
 */
interface QueryNodeTreeOptions {
  /** Maximum depth (null = unlimited, 0 = root only, 1 = root + children, etc.) */
  maxDepth?: number | null;
  /** Fields to include (null = all, can be array or comma-separated string) */
  only?: string[] | string | null;
  /** Include component information */
  withComponents?: boolean;
  /** Only include active nodes */
  onlyActive?: boolean;
}

/**
 * Normalize the `only` parameter to an array
 */
function normalizeOnlyFields(only: string[] | string | null | undefined): string[] | null {
  if (only === null || only === undefined) {
    return null;
  }
  if (typeof only === 'string') {
    return only.split(',').map(s => s.trim()).filter(Boolean);
  }
  return only;
}

/**
 * Parse parameter to options, supporting presets and individual options
 */
function parseOptions(params: unknown): QueryNodeTreeOptions {
  // String parameter - treat as preset name
  if (typeof params === 'string') {
    const preset = PRESETS[params];
    if (preset) {
      return preset;
    }
    // Unknown preset, treat as comma-separated field list
    return { only: params };
  }

  // Object parameter - extract options
  if (params && typeof params === 'object') {
    const obj = params as Record<string, unknown>;
    const options: QueryNodeTreeOptions = {};

    // Support both old and new parameter names
    if ('maxDepth' in obj) options.maxDepth = obj.maxDepth as number | null;
    else if ('depth' in obj) options.maxDepth = obj.depth as number | null;

    if ('only' in obj) options.only = obj.only as string[] | string | null;
    else if ('fields' in obj) options.only = obj.fields as string[] | null;

    if ('withComponents' in obj) options.withComponents = obj.withComponents as boolean;
    else if ('includeComponents' in obj) options.withComponents = obj.includeComponents as boolean;

    if ('onlyActive' in obj) options.onlyActive = obj.onlyActive as boolean;
    else if ('includeInactive' in obj) options.onlyActive = !(obj.includeInactive as boolean);

    return options;
  }

  return {};
}

/**
 * Filter node fields based on the fields list
 */
function filterNodeFields(node: SceneNode, fields: string[]): SceneNode {
  const filtered: SceneNode = { uuid: node.uuid, name: node.name };
  for (const field of fields) {
    if (field in node && field !== 'uuid' && field !== 'name') {
      (filtered as Record<string, unknown>)[field] = node[field];
    }
  }
  return filtered;
}

/**
 * Recursively filter tree nodes
 */
function filterTreeNodes(
  nodes: SceneNode[],
  options: QueryNodeTreeOptions,
  currentDepth: number = 0
): SceneNode[] {
  const onlyFields = normalizeOnlyFields(options.only);
  const maxDepth = options.maxDepth === null || options.maxDepth === undefined ? Infinity : options.maxDepth;
  const onlyActive = options.onlyActive === true;
  const withComponents = options.withComponents === true;

  return nodes
    .filter((node) => {
      // Filter out inactive nodes if requested
      if (onlyActive && node.active === false) {
        return false;
      }
      return true;
    })
    .map((node) => {
      // Filter fields if specified
      let filteredNode: SceneNode;
      if (onlyFields && onlyFields.length > 0) {
        filteredNode = filterNodeFields(node, onlyFields);
      } else {
        // Clone node to avoid mutating original
        const { uuid, name, ...rest } = node;
        filteredNode = { uuid, name, ...rest };
      }

      // Handle children recursively
      if (node.children && node.children.length > 0 && currentDepth < maxDepth) {
        filteredNode.children = filterTreeNodes(node.children, options, currentDepth + 1);
      } else {
        filteredNode.children = [];
      }

      // Remove components if not requested
      if (!withComponents && '__comps__' in filteredNode) {
        delete (filteredNode as Record<string, unknown>).__comps__;
      }

      return filteredNode;
    });
}

/**
 * Check if options have any meaningful values
 */
function hasValidOptions(options: QueryNodeTreeOptions): boolean {
  return (
    options.maxDepth !== undefined ||
    options.only !== undefined ||
    options.withComponents !== undefined ||
    options.onlyActive !== undefined
  );
}

/**
 * Filter and trim node tree data
 * 过滤和裁剪节点树数据
 */
export const sceneQueryNodeTreePostprocessor: PostprocessorFn = async (
  result: ApiResponse,
  processedParams: unknown[],
  _client: CocosClient
): Promise<ApiResponse> => {
  if (!result.success || !result.data) {
    return result;
  }

  // Get original params from metadata (stored by preprocessor)
  const paramsWithMeta = processedParams as unknown[] & { __originalParams?: unknown[] };
  const originalParams = paramsWithMeta.__originalParams ?? [];

  // Parse options from params
  const params = originalParams.length > 0 ? originalParams[0] : undefined;
  const options = parseOptions(params);

  // If no filtering options provided, return original result
  if (!hasValidOptions(options)) {
    return result;
  }

  // The API returns a single root node object, not an array
  // We need to handle the root node's children array
  const rootNode = result.data as SceneNode;

  if (!rootNode.children || rootNode.children.length === 0) {
    // No children, return filtered root node
    const onlyFields = normalizeOnlyFields(options.only);
    if (onlyFields && onlyFields.length > 0) {
      const filteredRoot = filterNodeFields(rootNode, onlyFields);
      filteredRoot.children = [];
      // Remove components if not requested
      if (options.withComponents !== true && '__comps__' in filteredRoot) {
        delete (filteredRoot as Record<string, unknown>).__comps__;
      }
      return {
        ...result,
        data: filteredRoot,
      };
    }
    return result;
  }

  // Filter the children array
  const filteredChildren = filterTreeNodes(rootNode.children, options);

  // Return filtered root node with filtered children
  const onlyFields = normalizeOnlyFields(options.only);
  let filteredRoot: SceneNode;

  if (onlyFields && onlyFields.length > 0) {
    filteredRoot = filterNodeFields(rootNode, onlyFields);
  } else {
    // Clone root node
    const { uuid, name, ...rest } = rootNode;
    filteredRoot = { uuid, name, ...rest };
  }

  filteredRoot.children = filteredChildren;

  // Remove components if not requested
  if (options.withComponents !== true && '__comps__' in filteredRoot) {
    delete (filteredRoot as Record<string, unknown>).__comps__;
  }

  return {
    ...result,
    data: filteredRoot,
  };
};
