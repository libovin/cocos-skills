/**
 * Preprocessor for asset-db/create-asset
 * 自动生成默认资源数据
 */
import { generateDefaultAssetData } from '../../asset-templates.js';
/**
 * 自动生成默认资源数据
 * 系统根据文件扩展名自动生成对应的默认 JSON 数据
 */
export const assetDbCreateAssetPreprocessor = async (params, _client) => {
    const [path] = params;
    if (typeof path !== 'string') {
        return params;
    }
    // 自动生成默认数据
    const defaultData = generateDefaultAssetData(path);
    return [path, defaultData];
};
//# sourceMappingURL=create-asset.preprocessor.js.map