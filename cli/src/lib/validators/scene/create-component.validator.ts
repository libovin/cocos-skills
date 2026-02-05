import { ValidationError } from '../error.js';

export function validateCreateComponent(params: unknown[]): void {
  if (params.length !== 1) {
    throw new ValidationError('scene', 'create-component', 'params', '必须提供 1 个参数（JSON 对象）');
  }

  const options = params[0];

  if (typeof options !== 'object' || options === null) {
    throw new ValidationError('scene', 'create-component', 'params', '参数必须是对象类型');
  }

  const { uuid, component } = options as Record<string, unknown>;

  if (typeof uuid !== 'string') {
    throw new ValidationError('scene', 'create-component', 'uuid', '必须是字符串类型');
  }

  if (uuid.trim() === '') {
    throw new ValidationError('scene', 'create-component', 'uuid', '不能为空');
  }

  if (typeof component !== 'string') {
    throw new ValidationError('scene', 'create-component', 'component', '必须是字符串类型');
  }

  if (component.trim() === '') {
    throw new ValidationError('scene', 'create-component', 'component', '不能为空');
  }

  if (!component.startsWith('cc.')) {
    throw new ValidationError('scene', 'create-component', 'component', '必须以 cc. 开头，如 cc.Sprite、cc.Widget');
  }
}
