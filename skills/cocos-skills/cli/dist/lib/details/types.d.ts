/**
 * Type definitions for action details
 */
/**
 * Parameter definition
 */
export interface ActionParam {
    name: string;
    type: string;
    required: boolean;
    description: string;
}
/**
 * Action details with parameters and examples
 */
export interface ActionDetail {
    description: string;
    parameters: ActionParam[];
    examples: string[];
    notes?: string;
}
/**
 * Action details for a module
 */
export type ModuleActionDetails = Record<string, ActionDetail>;
//# sourceMappingURL=types.d.ts.map