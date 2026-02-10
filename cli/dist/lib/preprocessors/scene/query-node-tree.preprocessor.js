/**
 * Preprocessor for scene/query-node-tree
 *
 * Removes filter parameters before sending to server
 * The filter is applied client-side in the postprocessor
 */
/**
 * Preprocessor that removes filter parameters
 *
 * The Cocos Creator API doesn't support filter parameters,
 * so we remove them before sending the request and apply
 * filtering in the postprocessor instead.
 *
 * We store the original params in metadata for the postprocessor to use.
 */
export const sceneQueryNodeTreePreprocessor = async (params, _client) => {
    // Always return empty array - don't send any params to server
    // Store original params in metadata for postprocessor
    const result = [];
    // Store original params in metadata for postprocessor
    result.__originalParams = params;
    return result;
};
//# sourceMappingURL=query-node-tree.preprocessor.js.map