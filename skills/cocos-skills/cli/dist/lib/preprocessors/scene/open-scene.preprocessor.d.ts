/**
 * Preprocessor for scene/open-scene
 * 支持 UUID 或路径两种参数格式，自动转换并验证资源存在
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * 自动支持 UUID 或路径两种参数格式
 * - 如果是路径，转换为 UUID
 * - 如果是 UUID，验证资源存在
 * - 打开新场景前自动保存当前场景的未保存更改
 */
export declare const sceneOpenScenePreprocessor: PreprocessorFn;
//# sourceMappingURL=open-scene.preprocessor.d.ts.map