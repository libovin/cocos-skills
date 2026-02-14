/**
 * Postprocessor for scene/create-node
 * 在创建节点后添加组件和子节点
 */

import { getComponentsForNodeType, getChildNodesForNodeType } from '../../node-preprocessor.js';
import type { PostprocessorFn } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import type { ApiResponse } from '../../../types.js';
import { createComponentForNode } from '../../utils/component-creation.js';

/**
 * Add components and child nodes after node creation
 * 在创建节点后添加组件和子节点
 */
export const sceneCreateNodePostprocessor: PostprocessorFn = async (
  result: ApiResponse,
  params: unknown[],
  client: CocosClient
): Promise<ApiResponse> => {
  if (!result.success || !result.data) {
    return result;
  }

  // Handle both object { uuid: string } and string uuid formats
  const nodeUuid = typeof result.data === 'string' ? result.data : (result.data as any).uuid;
  if (!nodeUuid) {
    return result;
  }

  // Get options from original params (not processed params)
  const options = params[0] as Record<string, unknown> | undefined;
  const type = options?.type;
  const customComponents = options?.components;

  // Get components and children for the node type
  const typeComponents = type && typeof type === 'string' ? getComponentsForNodeType(type) : [];
  const childrenToCreate = type && typeof type === 'string' ? getChildNodesForNodeType(type) : [];

  // Get custom components from params
  const customComponentsList: string[] = [];
  if (customComponents && Array.isArray(customComponents)) {
    for (const comp of customComponents) {
      if (typeof comp === 'string') {
        customComponentsList.push(comp);
      }
    }
  }

  // Combine type components and custom components (remove duplicates)
  const componentsToAdd = [...new Set([...typeComponents, ...customComponentsList])];

  if (componentsToAdd.length === 0 && childrenToCreate.length === 0) {
    return result;
  }

  // Convert data to object if it's a string
  if (typeof result.data === 'string') {
    result.data = { uuid: result.data };
  }

  // Add components
  if (componentsToAdd.length > 0) {
    const addedComponents: string[] = [];

    for (const component of componentsToAdd) {
      const addResult = await createComponentForNode(client, nodeUuid, component);
      if (addResult.success) {
        addedComponents.push(component);
      }
    }

    (result.data as any).components = addedComponents;
  }

  // Add child nodes (if type requires children)
  if (childrenToCreate.length > 0) {
    const createdChildren: Array<{ type: string; name?: string; uuid: string }> = [];

    for (const childConfig of childrenToCreate) {
      const childParams: Record<string, unknown> = { parent: nodeUuid, type: childConfig.type };
      if (childConfig.name) {
        childParams.name = childConfig.name;
      }

      const childResult = await client.execute(
        'scene',
        'create-node',
        [childParams],
        false
      );

      const childUuid = typeof childResult.data === 'string' ? childResult.data : (childResult.data as any)?.uuid;
      if (childResult.success && childUuid) {
        createdChildren.push({ type: childConfig.type, name: childConfig.name, uuid: childUuid });
      }
    }

    if (createdChildren.length > 0) {
      (result.data as any).children = createdChildren;
    }
  }

  return result;
};
