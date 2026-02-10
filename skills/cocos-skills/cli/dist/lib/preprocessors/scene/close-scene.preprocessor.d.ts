/**
 * Preprocessor for scene/close-scene
 * 在关闭场景前自动检查并保存未保存的更改
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * Close scene preprocessor
 * 在关闭场景前：
 * 1. 调用 query-dirty 检查是否有未保存的更改
 * 2. 如果有更改，自动调用 save-scene 保存
 * 3. 然后继续执行 close-scene
 */
export declare const sceneCloseScenePreprocessor: PreprocessorFn;
//# sourceMappingURL=close-scene.preprocessor.d.ts.map