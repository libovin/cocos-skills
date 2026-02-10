import { IUuidService } from './IUuidService.js';
/**
 * UUID 服务实现
 * 提供 UUID 编解码、压缩解压缩功能
 */
export declare class UuidService implements IUuidService {
    /**
     * 生成随机 UUID
     */
    generateUuid(): string;
    /**
     * 将 Base64 编码的 UUID 转换为标准 UUID 格式
     * 参考: cocos-engine/cocos/core/utils/decode-uuid.ts
     *
     * 示例: fcmR3XADNLgJ1ByKhqcC5Z -> fc991dd7-0033-4b80-9d41-c8a86a702e59
     * 示例(带@): 011NMtm8RCxbJkFHS5RrLm@f9941 -> 011NMtm8RCxbJkFHS5RrLm@f9941
     */
    decodeUuid(base64: string): string;
    /**
     * 压缩 UUID (23位)
     * 将标准的 UUID 转换为压缩的 23 位格式
     */
    compressUuid(uuid: string): string;
    /**
     * 解压缩 UUID (22位)
     * 将 22 位格式的 UUID 转换为标准格式
     */
    decompressUuid(uuid: string): string;
    /**
     * 将 23 位 UUID 转换为 22 位格式
     */
    originalUuid(uuid: string): string;
    /**
     * 验证 UUID 格式
     */
    isValidUuid(uuid: string): boolean;
    /**
     * 生成标准 UUID v4
     */
    generateStandardUuid(): string;
    /**
     * 内部方法: 解码单个 22 位 UUID (不包含 @ 符号)
     */
    private _decodeUuidInternal;
    /**
     * 内部方法: 压缩单个 UUID (不包含 @ 符号)
     */
    private _compressUuidInternal;
    /**
     * 内部方法: 解压缩单个 UUID (不包含 @ 符号)
     */
    private _decompressUuidInternal;
    /**
     * 内部方法: 转换单个 UUID (不包含 @ 符号)
     */
    private _originalUuidInternal;
}
//# sourceMappingURL=UuidService.d.ts.map