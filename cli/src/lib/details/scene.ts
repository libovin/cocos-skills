/**
 * Scene module action details
 */

import type { ActionDetail, ModuleActionDetails } from './types.js';

export const sceneDetails: ModuleActionDetails = {
  'query-is-ready': {
    description: '查询场景是否准备就绪',
    parameters: [],
    examples: ['cocos-skills scene query-is-ready'],
    notes: '在执行场景操作前建议检查此状态，确保场景已加载完成',
  },
  'open-scene': {
    description: '打开指定路径的场景文件',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '场景文件路径，格式: db://assets/xxx.scene' },
    ],
    examples: [
      'cocos-skills scene open-scene db://assets/Main.scene',
      'cocos-skills scene open-scene "db://assets/scenes/Level 1.scene"',
      'cocos-skills scene open-scene db://assets/scenes/Loading.scene',
    ],
    notes: '当前场景会被自动关闭。场景路径必须以 db://assets/ 开头',
  },
  'save-scene': {
    description: '保存当前场景',
    parameters: [],
    examples: ['cocos-skills scene save-scene'],
    notes: '保存当前打开的场景的所有更改。建议在重要操作后调用',
  },
  'save-as-scene': {
    description: '将场景另存为新文件',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '新场景文件路径' },
    ],
    examples: [
      'cocos-skills scene save-as-scene db://assets/MainCopy.scene',
      'cocos-skills scene save-as-scene db://assets/scenes/Level2.scene',
    ],
    notes: '创建场景副本，新场景将成为当前打开的场景',
  },
  'close-scene': {
    description: '关闭当前场景',
    parameters: [],
    examples: ['cocos-skills scene close-scene'],
    notes: '关闭当前场景，如果有未保存的更改会提示保存',
  },
  'set-property': {
    description: '设置节点或组件属性值',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
      { name: 'path', type: 'string', required: true, description: '属性路径。节点属性直接使用属性名（如 position、rotation、scale），组件属性使用 __comps__.索引.属性名（如 __comps__.0._color、__comps__.1._contentSize）' },
      { name: 'dump', type: 'object', required: true, description: '属性值对象，必须包含 value 和 type 字段。例如：{"value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"}' },
    ],
    examples: [
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "position", "dump": {"value": {"x":0,"y":0,"z":10}, "type": "cc.Vec3"}}\'',
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "rotation", "dump": {"value": {"x":0,"y":0,"z":0,"w":1}, "type": "cc.Quat"}}\'',
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "scale", "dump": {"value": {"x":1,"y":1,"z":1}, "type": "cc.Vec3"}}\'',
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "__comps__.0._color", "dump": {"value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"}}\'',
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "__comps__.1._contentSize", "dump": {"value": {"width":200,"height":200}, "type": "cc.Size"}}\'',
    ],
    notes: `参数必须是 JSON 对象格式，包含 uuid、path 和 dump 字段。dump 必须包含 value 和 type 字段。

路径格式说明：
- 节点属性：直接使用属性名，如 position、rotation、scale、eulerAngles、angle
- 组件属性：使用 __comps__.索引.属性名 格式，如 __comps__.0._color、__comps__.1._contentSize
- 组件索引从 0 开始，需要先使用 query-node 获取组件列表

支持的 type 类型：
- cc.Vec3: 三维向量，用于 position、scale 等，格式 {"x":0,"y":0,"z":0}
- cc.Quat: 四元数，用于 rotation，格式 {"x":0,"y":0,"z":0,"w":1}
- cc.Vec2: 二维向量，格式 {"x":0,"y":0}
- cc.Color: 颜色，格式 {"r":255,"g":0,"b":0,"a":255}，范围 0-255
- cc.Size: 尺寸，格式 {"width":100,"height":100}
- cc.Node: 节点引用，格式 {"uuid":"节点UUID"}
- cc.String: 字符串
- cc.Number: 数字
- cc.Boolean: 布尔值
- cc.Asset: 资源引用，格式 {"uuid":"资源UUID"}
- cc.SpriteFrame: 精灵帧引用
- cc.Material: 材质引用
- cc.Prefab: 预制体引用
- cc.Texture2D: 纹理引用
- cc.Font: 字体引用
- cc.AudioClip: 音频片段引用

常用节点属性示例：
- position: 节点位置
- rotation: 节点旋转（四元数）
- scale: 节点缩放
- eulerAngles: 欧拉角旋转
- angle: 二维旋转角度

常用组件属性示例：
- cc.Sprite._color: 精灵颜色
- cc.Sprite.spriteFrame: 精灵帧
- cc.UITransform._contentSize: 内容尺寸
- cc.UITransform._anchorPoint: 锚点
- cc.Label.string: 文本内容
- cc.Label.fontSize: 字体大小

重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新`,
  },
  'reset-property': {
    description: '重置属性为默认值',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
      { name: 'path', type: 'string', required: true, description: '属性路径' },
      { name: 'dump', type: 'any', required: true, description: '属性值（通常为 null 或 undefined）' },
    ],
    examples: [
      'cocos-skills scene reset-property \'{"uuid": "节点UUID", "path": "color", "dump": null}\'',
      'cocos-skills scene reset-property \'{"uuid": "节点UUID", "path": "size.width", "dump": null}\'',
      'cocos-skills scene reset-property \'{"uuid": "节点UUID", "path": "position", "dump": null}\'',
    ],
    notes: '将属性恢复为引擎默认值，通常用于清除自定义设置。参数必须是 JSON 对象格式，包含 uuid、path 和 dump 字段。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'move-array-element': {
    description: '移动数组元素位置',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
      { name: 'path', type: 'string', required: true, description: '数组属性路径，如 children' },
      { name: 'target', type: 'number', required: true, description: '目标索引位置' },
      { name: 'offset', type: 'number', required: true, description: '偏移量' },
    ],
    examples: [
      'cocos-skills scene move-array-element \'{"uuid": "节点UUID", "path": "children", "target": 5, "offset": 0}\'',
      'cocos-skills scene move-array-element \'{"uuid": "节点UUID", "path": "children", "target": 1, "offset": 3}\'',
    ],
    notes: '常用于调整子节点顺序或数组元素顺序。参数必须是 JSON 对象格式。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'remove-array-element': {
    description: '删除数组元素',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
      { name: 'path', type: 'string', required: true, description: '数组属性路径' },
      { name: 'index', type: 'number', required: true, description: '要删除的索引位置' },
    ],
    examples: [
      'cocos-skills scene remove-array-element \'{"uuid": "节点UUID", "path": "children", "index": 0}\'',
      'cocos-skills scene remove-array-element \'{"uuid": "节点UUID", "path": "children", "index": 2}\'',
    ],
    notes: '删除指定索引的数组元素。后续元素会自动前移。参数必须是 JSON 对象格式。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'copy-node': {
    description: '复制节点到剪贴板',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '要复制的节点路径' },
    ],
    examples: [
      'cocos-skills scene copy-node /Canvas/Sprite',
      'cocos-skills scene copy-node /UI/Panel',
    ],
    notes: '将节点复制到系统剪贴板，之后可使用 paste-node 粘贴。包含所有子节点和组件',
  },
  'duplicate-node': {
    description: '复制并粘贴节点（快捷操作）',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '要复制的节点路径' },
    ],
    examples: ['cocos-skills scene duplicate-node /Canvas/Sprite'],
    notes: '相当于 copy-node + paste-node 的组合操作。新节点会自动命名',
  },
  'paste-node': {
    description: '粘贴剪贴板中的节点',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '目标父节点路径' },
    ],
    examples: [
      'cocos-skills scene paste-node /Canvas',
      'cocos-skills scene paste-node /UI/Container',
    ],
    notes: '将剪贴板中的节点粘贴为指定父节点的子节点。需要先使用 copy-node 或 cut-node。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'cut-node': {
    description: '剪切节点',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '要剪切的节点路径' },
    ],
    examples: ['cocos-skills scene cut-node /Canvas/Sprite'],
    notes: '将节点剪切到剪贴板，之后可使用 paste-node 或 set-parent 移动到新位置',
  },
  'set-parent': {
    description: '设置节点的父节点（移动节点）',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '要移动的节点路径' },
      { name: 'parentPath', type: 'string', required: true, description: '新父节点路径' },
      { name: 'index', type: 'number', required: false, description: '插入位置（可选），默认添加到末尾' },
    ],
    examples: [
      'cocos-skills scene set-parent /Canvas/Sprite /Container',
      'cocos-skills scene set-parent /Canvas/Sprite /Container 0',
      'cocos-skills scene set-parent /OldParent/Child /NewParent',
    ],
    notes: '改变节点的层级关系。会保留节点的世界变换（如果可能）。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'create-node': {
    description: '创建新节点',
    parameters: [
      { name: 'parent', type: 'string', required: false, description: '父节点 UUID 或路径（可选）' },
      { name: 'name', type: 'string', required: false, description: '节点名称（可选），不指定时自动生成' },
      { name: 'type', type: 'string', required: false, description: '组件类型（可选），如 cc.Sprite、cc.Label' },
      { name: 'position', type: 'object', required: false, description: '节点位置（可选），格式: {x, y, z}' },
    ],
    examples: [
      'cocos-skills scene create-node \'{"parent": "/Canvas", "name": "NewNode"}\'',
      'cocos-skills scene create-node \'{"parent": "/Canvas", "name": "Sprite", "type": "cc.Sprite"}\'',
      'cocos-skills scene create-node \'{"parent": "/Camera", "name": "CameraNode", "type": "cc.Camera"}\'',
      'cocos-skills scene create-node \'{"parent": "/UI", "name": "Button"}\'',
      'cocos-skills scene create-node \'{"parent": "/UI", "name": "Label", "type": "cc.Label"}\'',
      'cocos-skills scene create-node \'{"parent": "/Node", "name": "Child", "position": {"x": 100, "y": 200, "z": 0}}\'',
    ],
    notes: '参数必须是 JSON 对象格式。不指定名称时自动生成（如 New Node）。可以同时添加组件。常用组件: cc.Sprite, cc.Label, cc.Button, cc.Widget。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'remove-node': {
    description: '删除节点及其所有子节点',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '要删除的节点路径' },
    ],
    examples: [
      'cocos-skills scene remove-node /Canvas/OldNode',
      'cocos-skills scene remove-node /TempNode',
    ],
    notes: '此操作不可撤销。会删除节点及其所有子节点。建议删除前确认无引用。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'reset-node': {
    description: '重置节点变换为默认值',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '节点路径' },
    ],
    examples: [
      'cocos-skills scene reset-node /Canvas/Sprite',
      'cocos-skills scene reset-node /Camera',
    ],
    notes: '将 position 重置为 (0,0,0)，rotation 重置为 (0,0,0)，scale 重置为 (1,1,1)。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'reset-component': {
    description: '重置组件属性为默认值',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '节点路径' },
      { name: 'component', type: 'string', required: true, description: '组件名称，如 cc.Sprite' },
    ],
    examples: [
      'cocos-skills scene reset-component /Canvas/Sprite cc.Sprite',
      'cocos-skills scene reset-component /UI/Button cc.Button',
    ],
    notes: '将指定组件的所有属性恢复为引擎默认值',
  },
  'restore-prefab': {
    description: '恢复预制体实例到原始状态',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '预制体实例节点路径' },
    ],
    examples: ['cocos-skills scene restore-prefab /Canvas/PrefabInstance'],
    notes: '放弃对预制体实例的所有修改，恢复为预制体资源定义的状态',
  },
  'create-component': {
    description: '添加组件到节点',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
      { name: 'component', type: 'string', required: true, description: '组件类型，如 cc.Sprite、cc.Widget' },
    ],
    examples: [
      'cocos-skills scene create-component \'{"uuid": "节点UUID", "component": "cc.Widget"}\'',
      'cocos-skills scene create-component \'{"uuid": "节点UUID", "component": "cc.Camera"}\'',
      'cocos-skills scene create-component \'{"uuid": "节点UUID", "component": "cc.Animation"}\'',
    ],
    notes: '参数必须是 JSON 对象格式，包含 uuid 和 component 字段。为节点添加指定类型的组件。一个节点可以有多个组件，但每种类型只能有一个（除了 cc.Component）。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'remove-component': {
    description: '从节点移除组件',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
      { name: 'component', type: 'string', required: true, description: '组件类型（cid），如 cc.Sprite、cc.Widget' },
    ],
    examples: [
      'cocos-skills scene remove-component \'{"uuid": "节点UUID", "component": "cc.Widget"}\'',
      'cocos-skills scene remove-component \'{"uuid": "节点UUID", "component": "cc.BoxCollider2D"}\'',
    ],
    notes: '移除指定组件。component 参数使用组件类型（cid），如 cc.Sprite、cc.Widget。注意：移除组件可能会影响节点功能。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新。注意：在某些情况下，remove-component 命令可能不会立即生效，或者无法移除组件。如果遇到这种情况，请尝试在 Cocos Creator 编辑器中手动移除组件',
  },
  'execute-component-method': {
    description: '调用组件的方法',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
      { name: 'component', type: 'string', required: true, description: '组件类型（cid），如 cc.Sprite、cc.Label' },
      { name: 'method', type: 'string', required: true, description: '方法名称' },
      { name: 'args', type: 'array', required: false, description: '方法参数数组（可选）' },
    ],
    examples: [
      'cocos-skills scene execute-component-method \'{"uuid": "节点UUID", "component": "cc.Sprite", "method": "setContentSize", "args": [100, 100]}\'',
      'cocos-skills scene execute-component-method \'{"uuid": "节点UUID", "component": "cc.Label", "method": "string", "args": ["Hello World"]}\'',
    ],
    notes: '动态调用组件的公共方法。component 参数使用组件类型（cid），如 cc.Sprite、cc.Label。args 参数是方法参数数组，如 [100, 100] 或 ["Hello World"]',
  },
  'execute-scene-script': {
    description: '在场景上下文中执行 JavaScript 脚本',
    parameters: [
      { name: 'name', type: 'string', required: true, description: '脚本名称（通常为 cocos-mcp-server）' },
      { name: 'method', type: 'string', required: true, description: '方法名称' },
      { name: 'args', type: 'array', required: false, description: '方法参数数组（可选）' },
    ],
    examples: [
      'cocos-skills scene execute-scene-script \'{"name": "cocos-mcp-server", "method": "getNodeInfo", "args": ["节点UUID"]}\'',
      'cocos-skills scene execute-scene-script \'{"name": "cocos-mcp-server", "method": "addComponentToNode", "args": ["节点UUID", "cc.Sprite"]}\'',
    ],
    notes: '在编辑器场景上下文中执行 JavaScript 脚本方法。需要先在场景中注册相应的脚本方法。常用于复杂的批量操作或调试',
  },
  'query-node': {
    description: '查询节点的详细信息',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
    ],
    examples: [
      'cocos-skills scene query-node "节点UUID"',
      'cocos-skills scene query-node "根节点UUID"',
    ],
    notes: '返回节点的名称、位置、旋转、缩放、组件列表等信息。返回的 data 包含 __comps__ 字段，其中包含所有组件的详细信息。每个组件包含 type（组件类型）、uuid（组件 UUID）、enabled（是否启用）和 value（组件属性）',
  },
  'query-node-tree': {
    description: '查询场景的完整节点树结构',
    parameters: [],
    examples: ['cocos-skills scene query-node-tree'],
    notes: '返回场景的完整层级结构，包含所有节点和子节点关系',
  },
  'query-nodes-by-asset-uuid': {
    description: '查询所有使用指定资源的节点',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '资源的 UUID' },
    ],
    examples: ['cocos-skills scene query-nodes-by-asset-uuid "uuid-string-here"'],
    notes: '返回所有引用该资源的节点列表，常用于查找资源使用情况',
  },
  'query-dirty': {
    description: '查询场景是否有未保存的修改',
    parameters: [],
    examples: ['cocos-skills scene query-dirty'],
    notes: '返回布尔值，true 表示场景有未保存的更改',
  },
  'query-component': {
    description: '查询组件的详细信息',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
    ],
    examples: [
      'cocos-skills scene query-component "节点UUID"',
      'cocos-skills scene query-component "根节点UUID"',
    ],
    notes: '返回组件的所有属性及其当前值。注意：此命令可能不可用，建议使用 query-node 获取节点组件信息（从 __comps__ 字段）',
  },
  'query-classes': {
    description: '查询可用的组件类列表',
    parameters: [
      { name: 'extends', type: 'string', required: false, description: '基类过滤（可选），如 cc.Component、cc.Node' },
      { name: 'scriptName', type: 'string', required: false, description: '脚本名称（可选）' },
    ],
    examples: [
      'cocos-skills scene query-classes \'{}\'',
      'cocos-skills scene query-classes \'{"extends": "cc.Component"}\'',
      'cocos-skills scene query-classes \'{"extends": "cc.Node"}\'',
      'cocos-skills scene query-classes \'{"extends": "cc.Sprite"}\'',
      'cocos-skills scene query-classes \'{"extends": "cc.Renderer"}\''
    ],
    notes: '返回所有可用的组件类型。参数必须是 JSON 对象格式，使用 extends 字段过滤继承自指定基类的组件类。常用的基类包括：cc.Component（所有组件）、cc.Node（节点类型）、cc.Sprite（精灵组件）等',
  },
  'query-components': {
    description: '查询所有可用的组件类列表',
    parameters: [],
    examples: [
      'cocos-skills scene query-components',
    ],
    notes: '返回所有可用的组件类型列表，包含内置组件和自定义脚本组件。每个组件包含 name、cid、path 等信息。与 query-classes 不同，此命令返回更详细的组件信息，包括组件的路径和资源 UUID',
  },
  'query-component-has-script': {
    description: '查询节点是否有脚本组件',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
    ],
    examples: [
      'cocos-skills scene query-component-has-script "节点UUID"',
      'cocos-skills scene query-component-has-script "根节点UUID"',
    ],
    notes: '返回布尔值，true 表示节点有脚本组件，false 表示没有。注意：此命令可能不可用，建议使用 query-node 获取节点组件信息并检查 __comps__ 字段',
  },
  'query-scene-bounds': {
    description: '查询场景的边界信息',
    parameters: [],
    examples: ['cocos-skills scene query-scene-bounds'],
    notes: '返回场景的包围盒信息，包括最小点和最大点坐标',
  },
  'is-native': {
    description: '查询节点是否为原生对象',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '节点路径' },
    ],
    examples: ['cocos-skills scene is-native /Canvas/Sprite'],
    notes: '返回布尔值，判断节点是否为 C++ 原生实现的对象',
  },
  // Gizmo 相关
  'change-gizmo-tool': {
    description: '切换场景编辑器的 Gizmo 工具',
    parameters: [
      { name: 'tool', type: 'string', required: true, description: '工具类型：move（移动）、rotate（旋转）、scale（缩放）' },
    ],
    examples: [
      'cocos-skills scene change-gizmo-tool move',
      'cocos-skills scene change-gizmo-tool rotate',
      'cocos-skills scene change-gizmo-tool scale',
    ],
    notes: '改变场景编辑器中显示的变换工具。快捷键对应: W(move)、E(rotate)、R(scale)',
  },
  'query-gizmo-tool-name': {
    description: '查询当前 Gizmo 工具类型',
    parameters: [],
    examples: ['cocos-skills scene query-gizmo-tool-name'],
    notes: '返回当前激活的 Gizmo 工具名称',
  },
  'change-gizmo-pivot': {
    description: '切换 Gizmo 变换中心点',
    parameters: [
      { name: 'pivot', type: 'string', required: true, description: '中心点类型：center（中心）、pivot（轴心）' },
    ],
    examples: [
      'cocos-skills scene change-gizmo-pivot center',
      'cocos-skills scene change-gizmo-pivot pivot',
    ],
    notes: 'center 模式以对象包围盒中心为变换点，pivot 模式以节点设定的轴心为变换点',
  },
  'query-gizmo-pivot': {
    description: '查询当前 Gizmo 变换中心点设置',
    parameters: [],
    examples: ['cocos-skills scene query-gizmo-pivot'],
    notes: '返回当前变换中心点的类型',
  },
  'change-gizmo-coordinate': {
    description: '切换 Gizmo 坐标系模式',
    parameters: [
      { name: 'coordinate', type: 'string', required: true, description: '坐标系：world（世界坐标）、local（本地坐标）' },
    ],
    examples: [
      'cocos-skills scene change-gizmo-coordinate world',
      'cocos-skills scene change-gizmo-coordinate local',
    ],
    notes: 'world 模式使用世界坐标系变换，local 模式使用本地坐标系（有父子关系时更直观）',
  },
  'query-gizmo-coordinate': {
    description: '查询当前 Gizmo 坐标系模式',
    parameters: [],
    examples: ['cocos-skills scene query-gizmo-coordinate'],
  },
  // 2D/3D
  'change-is2D': {
    description: '切换场景编辑器的 2D/3D 模式',
    parameters: [
      { name: 'is2D', type: 'boolean', required: true, description: 'true 为 2D 模式，false 为 3D 模式' },
    ],
    examples: [
      'cocos-skills scene change-is2D true',
      'cocos-skills scene change-is2D false',
    ],
    notes: '2D 模式下相机默认沿 Z 轴观察，适合 2D 游戏开发',
  },
  'query-is2D': {
    description: '查询是否为 2D 编辑模式',
    parameters: [],
    examples: ['cocos-skills scene query-is2D'],
  },
  // 网格
  'set-grid-visible': {
    description: '设置场景网格的可见性',
    parameters: [
      { name: 'visible', type: 'boolean', required: true, description: 'true 显示网格，false 隐藏网格' },
    ],
    examples: [
      'cocos-skills scene set-grid-visible true',
      'cocos-skills scene set-grid-visible false',
    ],
    notes: '网格有助于对齐和定位节点',
  },
  'query-is-grid-visible': {
    description: '查询网格是否可见',
    parameters: [],
    examples: ['cocos-skills scene query-is-grid-visible'],
  },
  // 图标 Gizmo
  'set-icon-gizmo-3d': {
    description: '设置节点图标 Gizmo 的显示模式',
    parameters: [
      { name: 'is3D', type: 'boolean', required: true, description: 'true 为 3D 模式，false 为 2D 模式' },
    ],
    examples: [
      'cocos-skills scene set-icon-gizmo-3d true',
      'cocos-skills scene set-icon-gizmo-3d false',
    ],
    notes: '3D 模式下图标会随相机旋转，2D 模式图标始终面向屏幕',
  },
  'query-is-icon-gizmo-3d': {
    description: '查询图标 Gizmo 是否为 3D 模式',
    parameters: [],
    examples: ['cocos-skills scene query-is-icon-gizmo-3d'],
  },
  'set-icon-gizmo-size': {
    description: '设置节点图标 Gizmo 的显示大小',
    parameters: [
      { name: 'size', type: 'number', required: true, description: '图标缩放值，1.0 为默认大小' },
    ],
    examples: [
      'cocos-skills scene set-icon-gizmo-size 1.5',
      'cocos-skills scene set-icon-gizmo-size 0.8',
    ],
    notes: '调整节点在场景视图中显示的图标大小',
  },
  'query-icon-gizmo-size': {
    description: '查询当前图标 Gizmo 的缩放值',
    parameters: [],
    examples: ['cocos-skills scene query-icon-gizmo-size'],
  },
  // 相机
  'focus-camera': {
    description: '将场景编辑器相机聚焦到指定节点',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '节点路径' },
    ],
    examples: [
      'cocos-skills scene focus-camera /Canvas/Sprite',
      'cocos-skills scene focus-camera /Player',
    ],
    notes: '移动编辑器相机使指定节点居中显示',
  },
  'align-with-view': {
    description: '将选中节点对齐到当前视图方向',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '节点路径' },
    ],
    examples: ['cocos-skills scene align-with-view /Canvas/Sprite'],
    notes: '调整节点的旋转使其面向当前相机视角',
  },
  'align-view-with-node': {
    description: '将场景视图对齐到选中节点的方向',
    parameters: [
      { name: 'path', type: 'string', required: true, description: '节点路径' },
    ],
    examples: ['cocos-skills scene align-view-with-node /Canvas/Sprite'],
    notes: '移动相机到节点前方，使相机沿节点的正 Z 轴方向观察',
  },
  // 快照
  'snapshot': {
    description: '创建场景快照（保存当前状态）',
    parameters: [],
    examples: ['cocos-skills scene snapshot'],
    notes: '保存场景的当前状态，可用于撤销操作',
  },
  'snapshot-abort': {
    description: '中止快照操作',
    parameters: [],
    examples: ['cocos-skills scene snapshot-abort'],
    notes: '取消当前的快照操作',
  },
  'soft-reload': {
    description: '软重载场景（刷新但不重新加载）',
    parameters: [],
    examples: ['cocos-skills scene soft-reload'],
    notes: '刷新场景显示但不重新加载资源，比完整重载更快',
  },
};
