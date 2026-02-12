/**
 * Validate create-component params
 */
import { ValidationError } from '../error.js';
const USAGE = `用法: cocos-skills scene create-component '<JSON配置>'

示例:
  cocos-skills scene create-component '{"uuid":"xxx","component":"cc.Sprite"}'
  cocos-skills scene create-component '{"uuid":"xxx","component":["cc.Sprite","cc.Widget"]}'

字段说明:
  uuid       - 节点UUID（必填）
  component  - 组件类型，可以是字符串或字符串数组（必填）`;
export function validateCreateComponent(params) {
    if (params.length !== 1) {
        throw new ValidationError('scene', 'create-component', 'usage', `需要提供一个 JSON 配置对象\n\n${USAGE}`);
    }
    const options = params[0];
    if (typeof options !== 'object' || options === null) {
        throw new ValidationError('scene', 'create-component', 'usage', `参数必须是 JSON 对象\n\n${USAGE}`);
    }
    const { uuid, component } = options;
    if (typeof uuid !== 'string' || uuid.trim() === '') {
        throw new ValidationError('scene', 'create-component', 'usage', `uuid 不能为空\n\n${USAGE}`);
    }
    if (typeof component === 'string') {
        if (component.trim() === '') {
            throw new ValidationError('scene', 'create-component', 'usage', `component 不能为空\n\n${USAGE}`);
        }
    }
    else if (Array.isArray(component)) {
        if (component.length === 0) {
            throw new ValidationError('scene', 'create-component', 'usage', `component 数组不能为空\n\n${USAGE}`);
        }
        for (let i = 0; i < component.length; i++) {
            if (typeof component[i] !== 'string' || component[i].trim() === '') {
                throw new ValidationError('scene', 'create-component', 'usage', `component[${i}] 必须是非空字符串\n\n${USAGE}`);
            }
        }
    }
    else {
        throw new ValidationError('scene', 'create-component', 'usage', `component 必须是字符串或字符串数组\n\n${USAGE}`);
    }
}
