/**
 * Preprocessor for asset-db/open-asset
 * 支持 UUID 或路径两种参数格式，自动转换
 */
import type { PreprocessorFn } from '../../pipeline/types.js';
/**
 * 将 UUID 转换为路径
 * 自动支持 UUID 或路径两种参数格式
 * 打开资源前自动保存当前场景的未保存更改
 */
export declare const assetDbOpenAssetPreprocessor: PreprocessorFn;
//# sourceMappingURL=open-asset.preprocessor.d.ts.map