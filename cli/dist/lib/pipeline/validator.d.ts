/**
 * Parameter Validator Manager
 * 参数校验器管理
 *
 * 负责管理所有参数校验器
 * 校验器在发送请求前同步执行，验证参数格式、类型、必填项
 */
import type { ValidatorFn } from './types.js';
/**
 * Register a validator
 */
export declare function registerValidator(module: string, action: string, validator: ValidatorFn): void;
/**
 * Get a validator
 */
export declare function getValidator(module: string, action: string): ValidatorFn | undefined;
/**
 * Check if a validator exists
 */
export declare function hasValidator(module: string, action: string): boolean;
/**
 * Get all registered validator keys
 */
export declare function getRegisteredValidators(): string[];
//# sourceMappingURL=validator.d.ts.map