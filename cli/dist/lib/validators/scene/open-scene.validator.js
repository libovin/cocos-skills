/**
 * Validate open-scene params
 */
import { ValidationError } from '../error.js';
const USAGE = `用法: cocos-skills scene open-scene <场景UUID或路径>

示例:
  cocos-skills scene open-scene db://assets/scenes/Main.scene
  cocos-skills scene open-scene 9f9d4dcb-2795-4781-aaea-c3d31ce699a1`;
export function validateOpenScene(params) {
    if (params.length < 1) {
        throw new ValidationError('scene', 'open-scene', 'usage', `缺少场景标识\n\n${USAGE}`);
    }
    const [uuid] = params;
    if (typeof uuid !== 'string') {
        throw new ValidationError('scene', 'open-scene', 'usage', `场景标识必须是字符串\n\n${USAGE}`);
    }
}
//# sourceMappingURL=open-scene.validator.js.map