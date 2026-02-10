/**
 * Validate set-property params
 */
import { ValidationError } from '../error.js';
export function validateSetProperty(params) {
    if (params.length !== 1) {
        throw new ValidationError('scene', 'set-property', 'params', '必须提供 1 个参数（SetPropertyOptions 对象）');
    }
    const options = params[0];
    if (typeof options !== 'object' || options === null) {
        throw new ValidationError('scene', 'set-property', 'params', '参数必须是对象类型');
    }
    const { uuid, path, dump } = options;
    if (typeof uuid !== 'string') {
        throw new ValidationError('scene', 'set-property', 'uuid', '必须是字符串类型');
    }
    if (uuid.trim() === '') {
        throw new ValidationError('scene', 'set-property', 'uuid', '不能为空');
    }
    if (typeof path !== 'string') {
        throw new ValidationError('scene', 'set-property', 'path', '必须是字符串类型');
    }
    if (path.trim() === '') {
        throw new ValidationError('scene', 'set-property', 'path', '不能为空');
    }
    if (dump === undefined) {
        throw new ValidationError('scene', 'set-property', 'dump', '必须提供属性值');
    }
    if (typeof dump !== 'object' || dump === null) {
        throw new ValidationError('scene', 'set-property', 'dump', '必须是对象类型，包含 value 和 type 字段');
    }
    const dumpObj = dump;
    if (!('value' in dumpObj)) {
        throw new ValidationError('scene', 'set-property', 'dump.value', '必须包含 value 字段');
    }
    if (!('type' in dumpObj)) {
        throw new ValidationError('scene', 'set-property', 'dump.type', '必须包含 type 字段');
    }
    if (typeof dumpObj.type !== 'string') {
        throw new ValidationError('scene', 'set-property', 'dump.type', 'type 必须是字符串类型');
    }
    if (dumpObj.type.trim() === '') {
        throw new ValidationError('scene', 'set-property', 'dump.type', 'type 不能为空');
    }
    const validTypes = ['cc.Vec3', 'cc.Quat', 'cc.Vec2', 'cc.Color', 'cc.Size', 'cc.Node', 'cc.String', 'cc.Number', 'cc.Boolean', 'cc.Asset', 'cc.SpriteFrame', 'cc.Material', 'cc.Prefab', 'cc.Texture2D', 'cc.Font', 'cc.AudioClip'];
    if (!validTypes.includes(dumpObj.type)) {
        throw new ValidationError('scene', 'set-property', 'dump.type', `无效的 type 值: ${dumpObj.type}。支持的类型: ${validTypes.join(', ')}`);
    }
}
//# sourceMappingURL=set-property.validator.js.map