/**
 * Validate create-node params
 */
import { ValidationError } from '../error.js';
export function validateCreateNode(params) {
    if (params.length !== 1) {
        throw new ValidationError('scene', 'create-node', 'params', '必须提供 1 个参数（JSON 对象）');
    }
    const options = params[0];
    if (typeof options !== 'object' || options === null) {
        throw new ValidationError('scene', 'create-node', 'params', '参数必须是对象类型');
    }
    const { parent, name, type, components } = options;
    if (parent !== undefined && typeof parent !== 'string') {
        throw new ValidationError('scene', 'create-node', 'parent', '必须是字符串类型');
    }
    if (name !== undefined && typeof name !== 'string') {
        throw new ValidationError('scene', 'create-node', 'name', '必须是字符串类型');
    }
    if (type !== undefined && typeof type !== 'string') {
        throw new ValidationError('scene', 'create-node', 'type', '必须是字符串类型');
    }
    if (components !== undefined) {
        if (!Array.isArray(components)) {
            throw new ValidationError('scene', 'create-node', 'components', '必须是数组类型');
        }
        for (const comp of components) {
            if (typeof comp !== 'string') {
                throw new ValidationError('scene', 'create-node', 'components', '数组元素必须是字符串类型');
            }
        }
    }
}
//# sourceMappingURL=create-node.validator.js.map