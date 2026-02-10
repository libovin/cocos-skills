/**
 * Parameter Validator Manager
 * 参数校验器管理
 *
 * 负责管理所有参数校验器
 * 校验器在发送请求前同步执行，验证参数格式、类型、必填项
 */
/**
 * Validator registry
 */
class ValidatorRegistry {
    validators = new Map();
    /**
     * Register a validator for a specific module/action
     * @param key Key in format "module:action"
     * @param validator Validator function
     */
    register(key, validator) {
        this.validators.set(key, validator);
    }
    /**
     * Get a validator for a specific module/action
     * @param module Module name
     * @param action Action name
     * @returns Validator function or undefined
     */
    get(module, action) {
        return this.validators.get(`${module}:${action}`);
    }
    /**
     * Check if a validator exists
     */
    has(module, action) {
        return this.validators.has(`${module}:${action}`);
    }
    /**
     * Get all registered keys
     */
    keys() {
        return Array.from(this.validators.keys());
    }
}
/**
 * Global validator registry instance
 */
const registry = new ValidatorRegistry();
/**
 * Register a validator
 */
export function registerValidator(module, action, validator) {
    registry.register(`${module}:${action}`, validator);
}
/**
 * Get a validator
 */
export function getValidator(module, action) {
    return registry.get(module, action);
}
/**
 * Check if a validator exists
 */
export function hasValidator(module, action) {
    return registry.has(module, action);
}
/**
 * Get all registered validator keys
 */
export function getRegisteredValidators() {
    return registry.keys();
}
//# sourceMappingURL=validator.js.map