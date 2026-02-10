/**
 * Preprocessor for asset-db/save-asset
 * 跳过 API 调用，直接返回成功响应
 *
 * 注意：此 preprocessor 不调用真实的场景接口，直接返回成功
 * 如果需要保存实际场景内容，请使用 scene save-scene 命令
 */
/**
 * Preprocessor for save-asset
 * - 在跳过 API 调用前，检查并保存当前场景的未保存更改
 * - 跳过 API 调用
 * - 直接返回成功响应
 */
export const assetDbSaveAssetPreprocessor = async (params, client) => {
    // 0. 在返回成功前，检查并保存当前场景的未保存更改
    try {
        const dirtyResponse = await client._request('POST', '/api/scene/query-dirty', {
            params: [],
        });
        if (dirtyResponse.success && dirtyResponse.data?.result === true) {
            console.log('检测到当前场景有未保存的更改，正在自动保存...');
            const saveResponse = await client._request('POST', '/api/scene/save-scene', {
                params: [],
            });
            if (saveResponse.success) {
                console.log('当前场景已自动保存');
            }
            else {
                console.warn('自动保存当前场景失败，但将继续保存资源');
            }
        }
    }
    catch (error) {
        // 如果检查或保存失败，记录警告但继续
        console.warn('检查当前场景状态时出错，将继续保存资源:', error instanceof Error ? error.message : error);
    }
    // 返回 PipelineResult，跳过 API 调用并直接返回成功
    return {
        params: [],
        skipApiCall: true,
        skipResponse: {
            success: true,
            data: params[0] || null,
        },
    };
};
//# sourceMappingURL=save-asset.preprocessor.js.map