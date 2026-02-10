/**
 * Postprocessor for scene/query-node-tree
 * 过滤和裁剪节点树数据
 */
/**
 * Preset configurations for common use cases
 */
const PRESETS = {
    /** Minimal: only uuid and name */
    minimal: {
        only: ['uuid', 'name'],
        withComponents: false,
    },
    /** Basic: uuid, name, path, active */
    basic: {
        only: ['uuid', 'name', 'path', 'active'],
        withComponents: false,
    },
    /** Full: everything (default behavior) */
    full: {
        withComponents: true,
        onlyActive: false,
    },
};
/**
 * Normalize the `only` parameter to an array
 */
function normalizeOnlyFields(only) {
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
function parseOptions(params) {
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
        const obj = params;
        const options = {};
        if ('only' in obj)
            options.only = obj.only;
        else if ('fields' in obj)
            options.only = obj.fields;
        if ('withComponents' in obj)
            options.withComponents = obj.withComponents;
        else if ('includeComponents' in obj)
            options.withComponents = obj.includeComponents;
        if ('onlyActive' in obj)
            options.onlyActive = obj.onlyActive;
        else if ('includeInactive' in obj)
            options.onlyActive = !obj.includeInactive;
        return options;
    }
    return {};
}
/**
 * Filter node fields based on the fields list
 */
function filterNodeFields(node, fields) {
    const filtered = { uuid: node.uuid, name: node.name };
    for (const field of fields) {
        if (field in node && field !== 'uuid' && field !== 'name') {
            filtered[field] = node[field];
        }
    }
    return filtered;
}
/**
 * Recursively filter tree nodes
 */
function filterTreeNodes(nodes, options) {
    const onlyFields = normalizeOnlyFields(options.only);
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
        let filteredNode;
        if (onlyFields && onlyFields.length > 0) {
            filteredNode = filterNodeFields(node, onlyFields);
        }
        else {
            // Clone node to avoid mutating original (excluding children which will be added below if needed)
            const { uuid, name, children, ...rest } = node;
            filteredNode = { uuid, name, ...rest };
        }
        // Handle children recursively
        if (node.children && node.children.length > 0) {
            const childNodes = filterTreeNodes(node.children, options);
            // Only set children if non-empty
            if (childNodes.length > 0) {
                filteredNode.children = childNodes;
            }
        }
        // Remove components if not requested
        if (!withComponents && '__comps__' in filteredNode) {
            delete filteredNode.__comps__;
        }
        return filteredNode;
    });
}
/**
 * Check if options have any meaningful values
 */
function hasValidOptions(options) {
    return (options.only !== undefined ||
        options.withComponents !== undefined ||
        options.onlyActive !== undefined);
}
/**
 * Filter and trim node tree data
 * 过滤和裁剪节点树数据
 */
export const sceneQueryNodeTreePostprocessor = async (result, processedParams, _client) => {
    if (!result.success || !result.data) {
        return result;
    }
    // Get original params from metadata (stored by preprocessor)
    const paramsWithMeta = processedParams;
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
    const rootNode = result.data;
    const onlyFields = normalizeOnlyFields(options.only);
    let filteredRoot;
    if (onlyFields && onlyFields.length > 0) {
        filteredRoot = filterNodeFields(rootNode, onlyFields);
    }
    else {
        // Clone root node
        const { uuid, name, children, ...rest } = rootNode;
        filteredRoot = { uuid, name, ...rest };
    }
    // Filter children if they exist
    if (rootNode.children && rootNode.children.length > 0) {
        const filteredChildren = filterTreeNodes(rootNode.children, options);
        // Only set children if non-empty
        if (filteredChildren.length > 0) {
            filteredRoot.children = filteredChildren;
        }
    }
    // Remove components if not requested
    if (options.withComponents !== true && '__comps__' in filteredRoot) {
        delete filteredRoot.__comps__;
    }
    return {
        ...result,
        data: filteredRoot,
    };
};
//# sourceMappingURL=query-node-tree.postprocessor.js.map