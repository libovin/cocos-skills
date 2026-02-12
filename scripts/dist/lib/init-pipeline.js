/**
 * Initialize Pipeline
 * 初始化处理管道
 *
 * 注册所有内置的校验器、前置处理器、后置处理器
 */
import { registerBuiltinValidators } from './validators/registry.js';
import { registerBuiltinPreprocessors } from './preprocessors/index.js';
import { registerBuiltinPostprocessors } from './postprocessors/index.js';
let initialized = false;
/**
 * Initialize the pipeline (register all built-in processors)
 * Should be called once at application startup
 */
export function initPipeline() {
    if (initialized) {
        return;
    }
    registerBuiltinValidators();
    registerBuiltinPreprocessors();
    registerBuiltinPostprocessors();
    initialized = true;
}
/**
 * Check if pipeline has been initialized
 */
export function isPipelineInitialized() {
    return initialized;
}
