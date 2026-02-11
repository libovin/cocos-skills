/**
 * Postprocessor for scene/query-node
 * 简化 query-node 返回结果
 *
 * 原始结构：{ uuid: { value: "xxx" }, name: { value: "xxx" }, position: { x, y, z }, components: [{ type: "xxx" }] }
 * 简化后：  { uuid: "xxx", name: "xxx", position: { x, y, z }, components: ["xxx"] }
 */
import type { PostprocessorFn } from '../../pipeline/types.js';
/**
 * 简化 query-node 返回结果
 */
export declare const sceneQueryNodePostprocessor: PostprocessorFn;
//# sourceMappingURL=query-node.postprocessor.d.ts.map