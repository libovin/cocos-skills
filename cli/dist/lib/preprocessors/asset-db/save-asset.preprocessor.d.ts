/**
 * Preprocessor for asset-db/save-asset
 * 跳过 API 调用，直接返回成功响应
 *
 * 注意：此 preprocessor 不调用真实的场景接口，直接返回成功
 * 如果需要保存实际场景内容，请使用 scene save-scene 命令
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * Preprocessor for save-asset
 * - 在跳过 API 调用前，检查并保存当前场景的未保存更改
 * - 跳过 API 调用
 * - 直接返回成功响应
 */
export declare const assetDbSaveAssetPreprocessor: PreprocessorFn;
//# sourceMappingURL=save-asset.preprocessor.d.ts.map