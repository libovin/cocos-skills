/**
 * Preprocessor for scene/set-parent
 * 为 set-parent 检测循环引用
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * Validate that moving nodes won't create a cycle in the node hierarchy
 * 验证移动节点不会在节点层级中形成循环
 */
export declare const sceneSetParentPreprocessor: PreprocessorFn;
//# sourceMappingURL=set-parent.preprocessor.d.ts.map