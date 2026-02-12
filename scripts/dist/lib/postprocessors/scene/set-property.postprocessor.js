/**
 * Postprocessor for scene/set-property
 * 执行前置处理器准备好的批量 set-property 调用
 */
/**
 * Postprocessor that executes prepared set-property calls from preprocessor
 */
export const sceneSetPropertyPostprocessor = async (result, originalParams, client) => {
    const resultData = result.data;
    const calls = resultData?.calls;
    if (!calls || !Array.isArray(calls) || calls.length === 0) {
        return result;
    }
    const results = [];
    let successCount = 0;
    for (const call of calls) {
        try {
            const setResult = await client.executeRaw('scene', 'set-property', [call]);
            results.push({ call, result: setResult });
            if (setResult.success)
                successCount++;
        }
        catch (error) {
            results.push({
                call,
                result: {
                    success: false,
                    error: error instanceof Error ? error.message : String(error),
                },
            });
        }
    }
    const failedCount = calls.length - successCount;
    return {
        success: failedCount === 0,
        data: {
            success: successCount,
            failed: failedCount,
            results,
        },
    };
};
