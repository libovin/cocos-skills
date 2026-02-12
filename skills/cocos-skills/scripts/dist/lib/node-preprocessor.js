/**
 * Preprocessor for create-node action
 * Handles special node creation logic based on type parameter
 */
/**
 * Node type to component mapping
 */
const NODE_TYPE_CONFIGS = {
    'cc.Camera': {
        components: ['cc.Camera'],
    },
    // 2D Object 节点
    'cc.Graphics': {
        components: ['cc.Graphics'],
    },
    'cc.Label': {
        components: ['cc.Label'],
    },
    'cc.Mask': {
        components: ['cc.Mask', 'cc.Graphics'],
    },
    'cc.Sprite': {
        components: ['cc.Sprite'],
    },
    'cc.ParticleSystem2D': {
        components: ['cc.ParticleSystem2D'],
    },
    'cc.TiledMap': {
        components: ['cc.TiledMap'],
    },
    // UI 组件 节点
    'cc.Button': {
        components: ['cc.Button', 'cc.Sprite'],
        children: [{ type: 'cc.Label', name: 'Label' }],
    },
    'cc.Canvas': {
        components: ['cc.Canvas', 'cc.Widget'],
        children: [{ type: 'cc.Camera', name: 'Camera' }],
    },
    'cc.EditBox': {
        components: ['cc.Sprite', 'cc.EditBox'],
        children: [{ type: 'cc.Label', name: 'PLACEHOLDER_LABEL' }, { type: 'cc.Label', name: 'TEXT_LABEL' }],
    },
    'cc.Layout': {
        components: ['cc.Layout'],
    },
    'cc.PageView': {
        components: ['cc.Sprite', 'cc.PageView'],
        children: [{ type: 'PageViewMask', name: 'view' }, { type: 'cc.PageViewIndicator', name: 'indicator' }],
    },
    'cc.PageViewIndicator': {
        components: ['cc.PageViewIndicator'],
    },
    'PageViewMask': {
        components: ['cc.Mask', 'cc.Graphics'],
        children: [{ type: 'PageViewLayout', name: 'content' }],
    },
    'PageViewLayout': {
        components: ['cc.Layout'],
        children: [{ type: 'PageViewItem', name: 'page1' }, { type: 'PageViewItem', name: 'page2' }, { type: 'PageViewItem', name: 'page3' }],
    },
    'PageViewItem': {
        components: ['cc.Sprite'],
    },
    'cc.ProgressBar': {
        components: ['cc.Sprite', 'cc.ProgressBar'],
        children: [{ type: 'cc.Sprite', name: 'Bar' }],
    },
    'cc.RichText': {
        components: ['cc.RichText'],
    },
    'cc.ScrollView': {
        components: ['cc.Sprite', 'cc.ScrollView',],
        children: [{ type: 'ScrollViewBar', name: 'scrollBar' }, { type: 'ScrollViewMask', name: 'view' }],
    },
    'ScrollViewBar': {
        components: ['cc.Sprite', 'cc.Widget'],
        children: [{ type: 'ScrollViewSubBar', name: 'bar' }],
    },
    'ScrollViewSubBar': {
        components: ['cc.Sprite', 'cc.Widget'],
    },
    'ScrollViewMask': {
        components: ['cc.Mask', 'cc.Graphics'],
        children: [{ type: 'ScrollViewContent', name: 'content' }],
    },
    'ScrollViewContent': {
        components: ['cc.Layout'],
        children: [{ type: 'ScrollViewContentItem', name: 'item' }],
    },
    'ScrollViewContentItem': {
        components: ['cc.Label'],
    },
    'cc.Slider': {
        components: ['cc.Sprite', 'cc.Slider'],
        children: [{ type: 'ScrollHandle', name: 'Handle' }],
    },
    'ScrollHandle': {
        components: ['cc.Sprite', 'cc.Button'],
    },
    'cc.Toggle': {
        components: ['cc.Sprite', 'cc.Toggle'],
        children: [{ type: 'ToggleCheckmark', name: 'Checkmark' }],
    },
    'ToggleCheckmark': {
        components: ['cc.Sprite'],
    },
    'cc.ToggleGroupContainer': {
        components: ['cc.ToggleGroupContainer'],
        children: [{ type: 'cc.Toggle', name: 'Toggle1' }, { type: 'cc.Toggle', name: 'Toggle2' }, { type: 'cc.Toggle', name: 'Toggle3' }],
    },
    'cc.VideoPlayer': {
        components: ['cc.VideoPlayer'],
    },
    'cc.WebView': {
        components: ['cc.WebView'],
    },
    'cc.Widget': {
        components: ['cc.Widget'],
    },
    'cc.MeshRenderer': {
        components: ['cc.MeshRenderer'],
    },
    'cc.Terrain': {
        components: ['cc.Terrain'],
    },
};
/**
 * Get component list for a specific node type
 * @param type Node type (e.g., 'cc.Canvas', 'cc.Sprite')
 * @returns Array of component names
 */
export function getComponentsForNodeType(type) {
    const config = NODE_TYPE_CONFIGS[type];
    return config ? config.components : [];
}
/**
 * Get child node configurations for a specific node type
 * @param type Node type (e.g., 'cc.Canvas')
 * @returns Array of child node configurations
 */
export function getChildNodesForNodeType(type) {
    const config = NODE_TYPE_CONFIGS[type];
    return config?.children || [];
}
/**
 * Check if a type is a known node type
 * @param type Node type to check
 * @returns True if type is known
 */
export function isKnownNodeType(type) {
    return type in NODE_TYPE_CONFIGS;
}
/**
 * Preprocess create-node parameters
 * If type is specified, returns the node creation params and component creation params
 * @param params Original parameters
 * @returns Preprocessed parameters
 */
export function preprocessCreateNode(params) {
    const options = params[0];
    const { type, ...nodeParams } = options;
    if (type && typeof type === 'string') {
        const components = getComponentsForNodeType(type);
        const children = getChildNodesForNodeType(type);
        return {
            nodeParams,
            componentsToAdd: components.length > 0 ? components : undefined,
            children: children.length > 0 ? children : undefined,
        };
    }
    return {
        nodeParams,
    };
}
