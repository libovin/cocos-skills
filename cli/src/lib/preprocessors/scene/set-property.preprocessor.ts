/**
 * Preprocessor for scene/set-property
 * 支持通过组件类型批量设置属性
 * 将 { uuid, component, properties } 格式转换为多个 set-property 调用
 */

import type { PreprocessorFn, PipelineResult } from '../../pipeline/types.js';
import type { CocosClient } from '../../client.js';
import { isBuiltinComponent } from '../../validators/scene/component-properties.js';
import { ValidationError } from '../../validators/error.js';

/**
 * Property definition for batch setting
 */
interface PropertyDef {
  name: string;
  value: unknown;
  type: string;
}

/**
 * Component info from simplified query-node response
 */
interface ComponentInfo {
  type: string;
  uuid: string;
  enabled?: boolean;
  props?: Record<string, unknown>;
}

/**
 * Simplified node response from query-node postprocessor
 */
interface SimplifiedNode {
  uuid: string;
  name: string;
  components?: ComponentInfo[];
}

/**
 * Raw property info from query-component response
 */
interface RawPropertyInfo {
  name: string;
  value: unknown;
  type: string;
  visible?: boolean;
  readonly?: boolean;
}

/**
 * Raw component response from query-component
 */
interface RawComponentResponse {
  uuid: string;
  type: string;
  value?: {
    props?: RawPropertyInfo[];
  };
}

/**
 * Property info with name and type
 */
interface PropertyInfo {
  name: string;
  type: string;
}

/**
 * Find component info by type from node data
 */
function findComponentInfo(components: ComponentInfo[] | undefined, componentType: string): ComponentInfo | undefined {
  if (!components || !Array.isArray(components)) {
    return undefined;
  }
  return components.find((comp) => comp.type === componentType);
}

/**
 * Query component properties dynamically
 * Returns property info array with name and type
 */
async function queryComponentProperties(client: CocosClient, componentUuid: string): Promise<PropertyInfo[]> {
  try {
    const result = await client.executeRaw('scene', 'query-component', [componentUuid]);
    
    if (!result.success || !result.data) {
      return [];
    }
    
    const componentData = result.data as RawComponentResponse;
    const props = componentData.value?.props;
    
    if (!props || !Array.isArray(props)) {
      return [];
    }
    
    return props
      .filter((prop) => prop.name && typeof prop.name === 'string')
      .map((prop) => ({ name: prop.name, type: prop.type }));
  } catch {
    return [];
  }
}

/**
 * Preprocessor that supports batch property setting by component type
 * Converts { uuid, component, properties } format to standard set-property calls
 */
export const sceneSetPropertyPreprocessor: PreprocessorFn = async (
  params: unknown[],
  client: CocosClient
): Promise<unknown[] | PipelineResult> => {
  const options = params[0] as Record<string, unknown> | undefined;
  if (!options) {
    return params;
  }

  // Check if using new format (component + properties)
  const { uuid: nodeUuid, component: componentType, properties } = options;

  // If not using new format (no properties array), return original params
  if (typeof nodeUuid !== 'string' || !properties) {
    return params;
  }

  if (!Array.isArray(properties)) {
    return params;
  }

  // Default to cc.Node if component not specified
  const actualComponentType = componentType as string ?? 'cc.Node';

  try {
    // Query node to get component index
    const result = await client.execute(
      'scene',
      'query-node',
      [nodeUuid]
    );

    if (!result.success || !result.data) {
      return params;
    }

    // Determine if this is a node property (cc.Node) or component property
    const isNodeProperty = actualComponentType === 'cc.Node';

    let pathPrefix: string;
    let componentUuid: string | undefined;

    if (isNodeProperty) {
      // Node properties don't have __comps__ prefix
      pathPrefix = '';
    } else {
      // Component properties need __comps__.index prefix
      const nodeData = result.data as SimplifiedNode;
      const components = nodeData.components;

      // Find component info
      const componentInfo = findComponentInfo(components, actualComponentType);

      if (!componentInfo) {
        // Component not found, return original params (will fail in API call)
        return params;
      }

      // Store component UUID for dynamic property query
      componentUuid = componentInfo.uuid;

      // Find component index
      const componentIndex = components!.findIndex((comp) => comp.type === actualComponentType);
      
      // Build property path prefix
      pathPrefix = `__comps__.${componentIndex}.`;
      
      // For non-builtin components, dynamically query and validate properties
      if (!isBuiltinComponent(actualComponentType) && componentUuid) {
        const validProperties = await queryComponentProperties(client, componentUuid);
        const validPropNames = new Set(validProperties.map((p) => p.name));
        
        const invalidProps: string[] = [];
        for (const prop of properties) {
          if (typeof prop === 'object' && prop !== null) {
            const propObj = prop as Record<string, unknown>;
            const propName = propObj.name as string;
            
            if (propName && !validPropNames.has(propName)) {
              invalidProps.push(propName);
            }
          }
        }
        
        if (invalidProps.length > 0) {
          const propList = validProperties
            .map((p) => `  ${p.name}: ${p.type}`)
            .join('\n');
          throw new ValidationError(
            'scene',
            'set-property',
            'usage',
            `属性名 "${invalidProps.join(', ')}" 无效\n\n${actualComponentType} 属性:\n${propList}`
          );
        }
      }
    }

    // Convert properties array to final set-property call structure
    const setPropertyCalls: Array<{ uuid: string; path: string; dump: { value: unknown; type: string } }> = [];
    for (const prop of properties) {
      if (typeof prop === 'object' && prop !== null) {
        const propObj = prop as Record<string, unknown>;
        if (typeof propObj.name === 'string' && 'value' in propObj && typeof propObj.type === 'string') {
          // Build full path: if pathPrefix is empty, use name directly
          const path = pathPrefix ? `${pathPrefix}${propObj.name}` : propObj.name;
          setPropertyCalls.push({
            uuid: nodeUuid,
            path,
            dump: {
              value: propObj.value,
              type: propObj.type,
            },
          });
        }
      }
    }

    if (setPropertyCalls.length === 0) {
      return params;
    }

    // Batch mode: skip original API call and pass prepared calls to postprocessor
    const skipResult: PipelineResult = {
      params,
      skipApiCall: true,
      skipPostProcessor: false,
      skipResponse: {
        success: true,
        data: {
          calls: setPropertyCalls,
          message: `Prepared ${setPropertyCalls.length} set-property calls`,
        },
      },
    };

    return skipResult;
  } catch {
    // If query fails, return original params
    return params;
  }
};
