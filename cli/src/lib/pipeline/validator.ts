/**
 * Parameter Validator Manager
 * 参数校验器管理
 *
 * 负责管理所有参数校验器
 * 校验器在发送请求前同步执行，验证参数格式、类型、必填项
 */

import type { ValidatorFn } from './types.js';

/**
 * Validator registry
 */
class ValidatorRegistry {
  private validators: Map<string, ValidatorFn> = new Map();

  /**
   * Register a validator for a specific module/action
   * @param key Key in format "module:action"
   * @param validator Validator function
   */
  register(key: string, validator: ValidatorFn): void {
    this.validators.set(key, validator);
  }

  /**
   * Get a validator for a specific module/action
   * @param module Module name
   * @param action Action name
   * @returns Validator function or undefined
   */
  get(module: string, action: string): ValidatorFn | undefined {
    return this.validators.get(`${module}:${action}`);
  }

  /**
   * Check if a validator exists
   */
  has(module: string, action: string): boolean {
    return this.validators.has(`${module}:${action}`);
  }

  /**
   * Get all registered keys
   */
  keys(): string[] {
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
export function registerValidator(
  module: string,
  action: string,
  validator: ValidatorFn
): void {
  registry.register(`${module}:${action}`, validator);
}

/**
 * Get a validator
 */
export function getValidator(module: string, action: string): ValidatorFn | undefined {
  return registry.get(module, action);
}

/**
 * Check if a validator exists
 */
export function hasValidator(module: string, action: string): boolean {
  return registry.has(module, action);
}

/**
 * Get all registered validator keys
 */
export function getRegisteredValidators(): string[] {
  return registry.keys();
}
