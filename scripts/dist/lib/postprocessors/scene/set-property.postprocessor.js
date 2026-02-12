/**
 * Postprocessor for scene/set-property
 * 执行前置处理器准备好的批量 set-property 调用
 */
/**
 * Postprocessor that executes prepared set-property calls from preprocessor
 */
export const sceneSetPropertyPostprocessor = async (result, originalParams, client) => {
    // Check if there are prepared calls from preprocessor
    const resultData = result.data;
    const calls = resultData?.calls;
    // If no prepared calls, return original result
    if (!calls || !Array.isArray(calls) || calls.length === 0) {
        return result;
    }
    // Execute all prepared set-property calls
    const results = [];
    for (const call of calls) {
        try {
            const setResult = await client.execute('scene', 'set-property', [call], false);
            results.push({
                path: call.path,
                success: setResult.data,
            });
        }
        catch (error) {
            results.push({
                path: call.path,
                success: false,
                error: error instanceof Error ? error.message : String(error),
            });
        }
    }
    // Calculate success count
    const successCount = results.filter((r) => r.success).length;
    // Return merged results
    return {
        success: successCount === calls.length,
        data: {
            totalProperties: calls.length,
            successCount,
            failedCount: calls.length - successCount,
            results,
            message: successCount === calls.length
                ? `All ${calls.length} properties set successfully`
                : `${successCount}/${calls.length} properties set successfully`,
        },
    };
};
