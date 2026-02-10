/**
 * Preprocessor for scene/query-node-tree
 *
 * Removes filter parameters before sending to server
 * The filter is applied client-side in the postprocessor
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * Preprocessor that removes filter parameters
 *
 * The Cocos Creator API doesn't support filter parameters,
 * so we remove them before sending the request and apply
 * filtering in the postprocessor instead.
 *
 * We store the original params in metadata for the postprocessor to use.
 */
export declare const sceneQueryNodeTreePreprocessor: PreprocessorFn;
//# sourceMappingURL=query-node-tree.preprocessor.d.ts.map