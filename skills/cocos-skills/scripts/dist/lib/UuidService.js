import stringRandom from 'string-random';
import { v4 as uuidv4 } from 'uuid';
// Base64 编码映射表
const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
// 创建 Base64 值映射数组
const BASE64_VALUES = new Array(123); // max char code in base64Keys
for (let i = 0; i < 123; ++i)
    BASE64_VALUES[i] = 64; // 填充占位符('=')索引
for (let i = 0; i < 64; ++i)
    BASE64_VALUES[BASE64_KEYS.charCodeAt(i)] = i;
// 十六进制字符数组
const HexChars = '0123456789abcdef'.split('');
// UUID 模板构建
const _t = ['', '', '', ''];
const UuidTemplate = _t.concat(_t, '-', _t, '-', _t, '-', _t, '-', _t, _t, _t);
const Indices = UuidTemplate.map((x, i) => x === '-' ? NaN : i).filter(isFinite);
/**
 * UUID 服务实现
 * 提供 UUID 编解码、压缩解压缩功能
 */
export class UuidService {
    /**
     * 生成随机 UUID
     */
    generateUuid() {
        return stringRandom(22);
    }
    /**
     * 将 Base64 编码的 UUID 转换为标准 UUID 格式
     * 参考: cocos-engine/cocos/core/utils/decode-uuid.ts
     *
     * 示例: fcmR3XADNLgJ1ByKhqcC5Z -> fc991dd7-0033-4b80-9d41-c8a86a702e59
     * 示例(带@): 011NMtm8RCxbJkFHS5RrLm@f9941 -> 011NMtm8RCxbJkFHS5RrLm@f9941
     */
    decodeUuid(base64) {
        // 参数检查
        if (typeof base64 !== 'string') {
            console.warn('解码 UUID 失败: 输入必须是字符串');
            return '';
        }
        const separator = '@';
        const strs = base64.split(separator);
        const uuid = strs[0];
        // 长度检查：只有22位的才需要解码
        if (uuid.length !== 22) {
            return base64;
        }
        // 解码 UUID 部分
        const decodedUuid = this._decodeUuidInternal(uuid);
        // 使用 replace 方法保留 @suffix 部分（与引擎源码一致）
        return base64.replace(uuid, decodedUuid);
    }
    /**
     * 压缩 UUID (23位)
     * 将标准的 UUID 转换为压缩的 23 位格式
     */
    compressUuid(uuid) {
        // 处理包含 @ 符号的 UUID
        if (uuid.includes('@')) {
            const parts = uuid.split('@');
            const uuidPart = parts[0];
            const suffix = parts.slice(1).join('@');
            // 压缩 UUID 部分
            const compressed = this._compressUuidInternal(uuidPart);
            return compressed + '@' + suffix;
        }
        return this._compressUuidInternal(uuid);
    }
    /**
     * 解压缩 UUID (22位)
     * 将 22 位格式的 UUID 转换为标准格式
     */
    decompressUuid(uuid) {
        // 处理包含 @ 符号的 UUID
        if (uuid.includes('@')) {
            const parts = uuid.split('@');
            const uuidPart = parts[0];
            const suffix = parts.slice(1).join('@');
            // 解压缩 UUID 部分
            const decompressed = this._decompressUuidInternal(uuidPart);
            return decompressed + '@' + suffix;
        }
        return this._decompressUuidInternal(uuid);
    }
    /**
     * 将 23 位 UUID 转换为 22 位格式
     */
    originalUuid(uuid) {
        // 处理包含 @ 符号的 UUID
        if (uuid.includes('@')) {
            const parts = uuid.split('@');
            const uuidPart = parts[0];
            const suffix = parts.slice(1).join('@');
            // 转换 UUID 部分
            const converted = this._originalUuidInternal(uuidPart);
            return converted + '@' + suffix;
        }
        return this._originalUuidInternal(uuid);
    }
    /**
     * 验证 UUID 格式
     */
    isValidUuid(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
    /**
     * 生成标准 UUID v4
     */
    generateStandardUuid() {
        return uuidv4();
    }
    /**
     * 内部方法: 解码单个 22 位 UUID (不包含 @ 符号)
     */
    _decodeUuidInternal(uuid) {
        try {
            // 清空模板中需要填充的位置（只清空非连字符位置）
            for (let i = 0; i < Indices.length; i++) {
                UuidTemplate[Indices[i]] = '';
            }
            // 填充模板的前两个字符
            UuidTemplate[0] = uuid[0];
            UuidTemplate[1] = uuid[1];
            // 解码剩余字符
            for (let i = 2, j = 2; i < 22; i += 2) {
                const lhs = BASE64_VALUES[uuid.charCodeAt(i)];
                const rhs = BASE64_VALUES[uuid.charCodeAt(i + 1)];
                UuidTemplate[Indices[j++]] = HexChars[lhs >> 2];
                UuidTemplate[Indices[j++]] = HexChars[((lhs & 3) << 2) | rhs >> 4];
                UuidTemplate[Indices[j++]] = HexChars[rhs & 0xF];
            }
            // 返回标准 UUID
            return UuidTemplate.join('');
        }
        catch (err) {
            console.error('解码 UUID 时出错:', err);
            return uuid; // 出错时返回原始值
        }
    }
    /**
     * 内部方法: 压缩单个 UUID (不包含 @ 符号)
     */
    _compressUuidInternal(uuid) {
        try {
            // 分离 UUID 前缀和内容
            const header = uuid.slice(0, 5);
            const content = uuid.slice(5).replace(/-/g, '') + 'f';
            // 转换内容为字节数组
            const byteArray = [];
            for (let i = 0; i < content.length - 1; i += 2) {
                byteArray.push(parseInt(content.slice(i, i + 2), 16));
            }
            // 转换为 Base64 并返回结果
            const base64Content = Buffer.from(byteArray).toString('base64');
            return header + base64Content.slice(0, base64Content.length - 2);
        }
        catch (err) {
            console.error('压缩 UUID 时出错:', err);
            return uuid; // 出错时返回原始值
        }
    }
    /**
     * 内部方法: 解压缩单个 UUID (不包含 @ 符号)
     */
    _decompressUuidInternal(uuid) {
        try {
            // 分离 UUID 前缀和内容
            const header = uuid.slice(0, 2);
            const content = uuid.slice(2).replace(/-/g, '') + 'f';
            // 转换内容为字节数组
            const byteArray = [];
            for (let i = 0; i < content.length - 1; i += 2) {
                byteArray.push(parseInt(content.slice(i, i + 2), 16));
            }
            // 转换为 Base64 并返回结果
            const base64Content = Buffer.from(byteArray).join('.');
            return header + base64Content;
        }
        catch (err) {
            console.error('解压缩 UUID 时出错:', err);
            return uuid; // 出错时返回原始值
        }
    }
    /**
     * 内部方法: 转换单个 UUID (不包含 @ 符号)
     */
    _originalUuidInternal(uuid) {
        try {
            // 转换成长的 UUID
            const header = uuid.slice(0, 5);
            const end = uuid.slice(5);
            // 处理 Base64 填充
            let temp = end;
            if (end.length % 3 === 1) {
                temp += '==';
            }
            else if (end.length % 3 === 2) {
                temp += '=';
            }
            // 转换为十六进制
            const base64Content = Buffer.from(temp, 'base64').toString('hex');
            const longUuid = header + base64Content;
            // 返回转换后的 UUID
            const result = this._decompressUuidInternal(longUuid).slice(0, 4) + end;
            return result;
        }
        catch (err) {
            console.error('转换 UUID 格式时出错:', err);
            return uuid; // 出错时返回原始值
        }
    }
}
