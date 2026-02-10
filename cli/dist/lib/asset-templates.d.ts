/**
 * 支持的资源类型扩展名列表
 */
export declare const SUPPORTED_ASSET_EXTENSIONS: readonly [".prefab", ".scene", ".material", ".mtl", ".pmtl", ".anim", ".animask", ".pac", ".labelatlas"];
/**
 * 支持的资源类型扩展名联合类型
 */
export type SupportedAssetExtension = typeof SUPPORTED_ASSET_EXTENSIONS[number];
/**
 * 检查扩展名是否支持
 */
export declare function isSupportedExtension(ext: string): ext is SupportedAssetExtension;
/**
 * Generate default JSON data for create-asset command based on file extension
 */
export declare function generateDefaultAssetData(path: string): string;
//# sourceMappingURL=asset-templates.d.ts.map