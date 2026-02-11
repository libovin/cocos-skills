/**
 * Preprocessor for scene/set-property
 * 支持通过组件类型批量设置属性
 * 将 { uuid, component, properties } 格式转换为多个 set-property 调用
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * Preprocessor that supports batch property setting by component type
 * Converts { uuid, component, properties } format to standard set-property calls
 */
export declare const sceneSetPropertyPreprocessor: PreprocessorFn;
//# sourceMappingURL=set-property.preprocessor.d.ts.map