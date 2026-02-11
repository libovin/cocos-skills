/**
 * Postprocessor for scene/query-component
 * 简化 query-component 返回结果
 *
 * 原始结构：{ value: { uuid: { value: "xxx" }, name: { value: "xxx" }, ... }, type: "cc.Label" }
 * 简化后：  { uuid: "xxx", name: "xxx", type: "cc.Label", props: { ... } }
 */
import type { PostprocessorFn } from '../../pipeline/types.js';
/**
 * 简化 query-component 返回结果
 */
export declare const sceneQueryComponentPostprocessor: PostprocessorFn;
//# sourceMappingURL=query-component.postprocessor.d.ts.map