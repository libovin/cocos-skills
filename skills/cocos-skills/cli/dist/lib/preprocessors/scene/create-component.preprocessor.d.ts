/**
 * Preprocessor for scene/create-component
 * 检查节点是否已存在指定组件，如果存在则跳过 API 调用
 * 支持 component 为字符串或数组（批量添加）
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * Preprocessor that checks if component already exists on node
 * If component exists, skips the API call and returns success
 * Supports component as string or array for batch adding
 */
export declare const sceneCreateComponentPreprocessor: PreprocessorFn;
//# sourceMappingURL=create-component.preprocessor.d.ts.map