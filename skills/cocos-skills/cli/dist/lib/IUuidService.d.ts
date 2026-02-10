/**
 * UUID 服务接口
 */
export interface IUuidService {
    /**
     * 生成随机 UUID
     */
    generateUuid(): string;
    /**
     * 解码 Base64 UUID 为标准格式
     */
    decodeUuid(base64: string): string;
    /**
     * 压缩 UUID 到 23 位格式
     */
    compressUuid(uuid: string): string;
    /**
     * 解压缩 UUID
     */
    decompressUuid(uuid: string): string;
    /**
     * 转换 23 位 UUID 到 22 位格式
     */
    originalUuid(uuid: string): string;
    /**
     * 验证 UUID 格式
     */
    isValidUuid(uuid: string): boolean;
}
//# sourceMappingURL=IUuidService.d.ts.map