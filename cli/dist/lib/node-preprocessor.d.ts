/**
 * Preprocessor for create-node action
 * Handles special node creation logic based on type parameter
 */
/**
 * Child node configuration
 */
interface ChildNodeConfig {
    type: string;
    name?: string;
}
/**
 * Get component list for a specific node type
 * @param type Node type (e.g., 'cc.Canvas', 'cc.Sprite')
 * @returns Array of component names
 */
export declare function getComponentsForNodeType(type: string): string[];
/**
 * Get child node configurations for a specific node type
 * @param type Node type (e.g., 'cc.Canvas')
 * @returns Array of child node configurations
 */
export declare function getChildNodesForNodeType(type: string): ChildNodeConfig[];
/**
 * Check if a type is a known node type
 * @param type Node type to check
 * @returns True if type is known
 */
export declare function isKnownNodeType(type: string): boolean;
/**
 * Preprocess create-node parameters
 * If type is specified, returns the node creation params and component creation params
 * @param params Original parameters
 * @returns Preprocessed parameters
 */
export declare function preprocessCreateNode(params: unknown[]): {
    nodeParams: Record<string, unknown>;
    componentsToAdd?: string[];
    children?: ChildNodeConfig[];
};
export {};
//# sourceMappingURL=node-preprocessor.d.ts.map