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
    description: '打开场景或预制体（支持 UUID 或路径，自动保存当前场景）',
    parameters: [
      { name: 'uuidOrPath', type: 'string', required: true, description: 'UUID 或路径（db://...）' },
    ],
    examples: [
      'cocos-skills scene open-scene db://assets/scenes/Main.scene',
      'cocos-skills scene open-scene <uuid>',
    ],
    notes: `自动识别参数格式。与 asset-db open-asset 功能相同，可互换使用。

自动保存功能：
- 打开新场景前会自动检查当前场景是否有未保存的更改
- 如果有未保存的更改，会自动调用 save-scene 保存当前场景
- 然后再打开新场景

UUID/路径转换：
- UUID → 路径：asset-db query-url <uuid>
- 路径 → UUID：asset-db query-uuid <path>`,
  },
  'save-scene': {
    description: '保存当前场景',
    parameters: [],
    examples: ['cocos-skills scene save-scene'],
    notes: '保存当前打开的场景的所有更改。建议在重要操作后调用',
  },
  'save-as-scene': {
    description: '将当前场景另存为新文件（打开系统保存对话框）',
    parameters: [],
    examples: [
      'cocos-skills scene save-as-scene',
    ],
    notes: `将当前场景另存为新的场景文件，系统会弹出文件保存对话框供用户选择保存位置和文件名。

新场景将成为当前打开的场景，原场景保持不变。此操作创建场景的完整副本，包含所有节点和组件。

适用场景：
- 需要基于当前场景创建变体版本
- 备份场景当前状态
- 创建场景模板用于后续开发`,
  },
  'close-scene': {
    description: '关闭当前场景（自动保存未保存的更改）',
    parameters: [],
    examples: ['cocos-skills scene close-scene'],
    notes: `关闭当前场景。系统会自动打开到默认场景。

自动保存功能：
- 关闭前会自动检查是否有未保存的更改
- 如果有未保存的更改，会自动调用 save-scene 保存
- 然后再关闭场景

注意：原场景文件保持不变，未保存的更改会保存到原文件中`,
  },
  'set-property': {
    description: '设置节点或组件属性值（支持节点属性、组件属性、组件引用绑定等）',
    parameters: [
      { name: 'options', type: 'object', required: true, description: '属性设置选项对象。支持两种格式：1) 传统格式：{uuid, path, dump}；2) 批量格式：{uuid, component, properties}。component 为组件类型（如 cc.Sprite、cc.Label、cc.Node），properties 为属性数组' },
    ],
    examples: [
      // 节点属性示例 - 传统格式
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "position", "dump": {"value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"}}\'',
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "scale", "dump": {"value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}}\'',

      // 批量设置示例 - 新格式（推荐）
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "component": "cc.Node", "properties": [{"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"}, {"name": "scale", "value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}]}\'',
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "component": "cc.Sprite", "properties": [{"name": "_color", "value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"}]}\'',
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "component": "cc.Label", "properties": [{"name": "_string", "value": "Hello World", "type": "cc.String"}, {"name": "_fontSize", "value": 32, "type": "cc.Number"}]}\'',

      // 组件属性示例 - 传统格式
      'cocos-skills scene set-property \'{"uuid": "节点UUID", "path": "__comps__.0._color", "dump": {"value": {"r":255,"g":255,"b":255,"a":255}, "type": "cc.Color"}}\'',

      // 组件引用绑定示例
      'cocos-skills scene set-property \'{"uuid": "父节点UUID", "path": "__comps__.0.target", "dump": {"value": {"uuid": "目标节点UUID"}, "type": "cc.Node"}}\'',
    ],
    notes: `**参数格式详解：**

set-property 支持两种参数格式：**传统格式**和**批量格式**。

**1. 传统格式**（单属性设置）：
\`\`\`json
{
  "uuid": "节点UUID",
  "path": "属性路径",
  "dump": {
    "value": "属性值",
    "type": "类型标识"
  }
}
\`\`\`

**2. 批量格式**（多属性设置，推荐）：
\`\`\`json
{
  "uuid": "节点UUID",
  "component": "组件类型",
  "properties": [
    {"name": "属性名", "value": 属性值, "type": "类型标识"},
    {"name": "属性名", "value": 属性值, "type": "类型标识"}
  ]
}
\`\`\`

**批量格式说明：**
- \`component\`: 组件类型，如 \`cc.Node\`（节点属性）、\`cc.Sprite\`（精灵组件）、\`cc.Label\`（标签组件）等
- \`properties\`: 属性数组，每个元素包含：
  - \`name\`: 属性名（节点属性直接用属性名，组件属性用下划线开头的属性名）
  - \`value\`: 属性值
  - \`type\`: 类型标识

**路径格式说明：**

1. **节点属性**（直接使用属性名）：
   - \`position\`: 节点位置 (cc.Vec3)
   - \`rotation\`: 节点旋转四元数 (cc.Quat)
   - \`scale\`: 节点缩放 (cc.Vec3)
   - \`eulerAngles\`: 欧拉角旋转 (cc.Vec3)
   - \`angle\`: 2D 旋转角度 (cc.Number)
   - \`_contentSize\`: 内容尺寸 (cc.Size) - UITransform 组件属性
   - \`_active\`: 是否激活 (cc.Boolean)

2. **组件属性**（使用 __comps__.索引.属性名 格式，或批量格式的 component 指定）：
   - \`__comps__.0._color\`: 第一个组件的颜色
   - \`__comps__.1._string\`: 第二个组件的文本内容
   - \`__comps__.2.spriteFrame\`: 第三个组件的精灵帧

**批量格式使用示例：**

\`\`\`javascript
// 批量设置节点属性
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Node",
  "properties": [
    {"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"},
    {"name": "scale", "value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}
  ]
}'

// 批量设置 Sprite 组件属性
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Sprite",
  "properties": [
    {"name": "_color", "value": {"r":255,"g":0,"b":0,"a":255}, "type": "cc.Color"},
    {"name": "_useOriginalSize", "value": false, "type": "cc.Boolean"}
  ]
}'

// 批量设置 Label 组件属性
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Label",
  "properties": [
    {"name": "_string", "value": "Hello World", "type": "cc.String"},
    {"name": "_fontSize", "value": 32, "type": "cc.Number"},
    {"name": "_color", "value": {"r":0,"g":255,"b":0,"a":255}, "type": "cc.Color"}
  ]
}'

// 批量设置组件引用
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Button",
  "properties": [
    {"name": "target", "value": {"uuid": "目标节点UUID"}, "type": "cc.Node"}
  ]
}'
\`\`\`

**组件索引查找方法：**
使用 \`cocos-skills scene query-node <节点UUID>\` 查看节点的 components 字段，按照数组顺序确定索引（从 0 开始）。

**支持的 type 类型及格式：**

| 类型 | 格式 | 说明 | 示例 |
|------|------|------|------|
| cc.Vec3 | {"x":0,"y":0,"z":0} | 三维向量 | position, scale |
| cc.Quat | {"x":0,"y":0,"z":0,"w":1} | 四元数（旋转） | rotation |
| cc.Vec2 | {"x":0,"y":0} | 二维向量 | 锚点、尺寸分量 |
| cc.Color | {"r":255,"g":0,"b":0,"a":255} | 颜色 (0-255) | Sprite 颜色 |
| cc.Size | {"width":100,"height":100} | 尺寸 | 内容尺寸 |
| cc.Node | {"uuid":"节点UUID"} | 节点引用 | UI 组件目标节点 |
| cc.String | "任意字符串" | 字符串 | Label 文本 |
| cc.Number | 123 或 123.45 | 数字 | fontSize, angle |
| cc.Boolean | true 或 false | 布尔值 | active, enabled |
| cc.Asset | {"uuid":"资源UUID"} | 资源引用 | spriteFrame, material |
| cc.Prefab | {"uuid":"预制体UUID"} | 预制体引用 | tilePrefab |

**常用属性路径速查表：**

| 组件类型 | 属性路径 | 类型 | 说明 |
|----------|----------|------|------|
| 节点 | position | cc.Vec3 | 世界坐标位置 |
| 节点 | _lpos | cc.Vec3 | 本地坐标位置 |
| 节点 | scale | cc.Vec3 | 缩放比例 |
| 节点 | eulerAngles | cc.Vec3 | 欧拉角旋转（度） |
| UITransform | _contentSize | cc.Size | 内容尺寸 |
| UITransform | _anchorPoint | cc.Vec2 | 锚点位置 |
| Sprite | _color | cc.Color | 颜色 |
| Sprite | spriteFrame | cc.SpriteFrame | 精灵帧 |
| Label | _string | cc.String | 文本内容 |
| Label | _fontSize | cc.Number | 字体大小 |
| Label | _color | cc.Color | 文本颜色 |
| Button | _interactable | cc.Boolean | 是否可交互 |
| Button | clickEvents | Array | 点击事件数组 |

**组件引用绑定示例：**

\`\`\`javascript
// 绑定自定义脚本组件的节点引用
cocos-skills scene set-property '{"uuid":"Game2048节点UUID","path":"__comps__.1.grid","dump":{"value":{"uuid":"GridContainer节点UUID"},"type":"cc.Node"}}'

// 绑定预制体资源引用
cocos-skills scene set-property '{"uuid":"GridContainer节点UUID","path":"__comps__.0.tilePrefab","dump":{"value":{"uuid":"Tile预制体资源UUID"},"type":"cc.Prefab"}}'

// 绑定 Label 文本
cocos-skills scene set-property '{"uuid":"Title节点UUID","path":"__comps__.1._string","dump":{"value":"2048","type":"cc.String"}}'
\`\`\`

**特殊注意事项：**

1. **修改后保存**：修改场景后必须调用 \`save-scene\` 保存到磁盘，否则刷新编辑器后更改会丢失。
2. **组件索引**：组件索引从 0 开始，使用 \`query-node\` 查看完整的组件列表。
3. **类型匹配**：dump.type 必须与 dump.value 的结构匹配，否则会返回错误。
4. **节点 vs 组件属性**：节点属性（如 position）直接使用属性名，组件属性需要加 __comps__.前缀。
5. **引用类型**：绑定节点引用时使用 cc.Node 类型，绑定资源引用时使用对应的资源类型（如 cc.Prefab）。

**完整工作流程示例：**

\`\`\`bash
# 1. 查询节点信息，获取 UUID 和组件列表
cocos-skills scene query-node-tree minimal

# 2. 设置节点位置（传统格式）
cocos-skills scene set-property '{"uuid":"xxx","path":"position","dump":{"value":{"x":100,"y":200,"z":0},"type":"cc.Vec3"}}'

# 3. 设置 Label 文本（传统格式）
cocos-skills scene set-property '{"uuid":"xxx","path":"__comps__.1._string","dump":{"value":"Hello","type":"cc.String"}}'

# 4. 批量设置多个属性（批量格式，推荐）
cocos-skills scene set-property '{
  "uuid": "节点UUID",
  "component": "cc.Node",
  "properties": [
    {"name": "position", "value": {"x":100,"y":200,"z":0}, "type": "cc.Vec3"},
    {"name": "scale", "value": {"x":2,"y":2,"z":1}, "type": "cc.Vec3"}
  ]
}'

# 5. 保存场景
cocos-skills scene save-scene
\`\`\``,
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
      { name: 'uuid', type: 'string', required: true, description: '要复制的节点 UUID' },
    ],
    examples: [
      'cocos-skills scene copy-node <节点UUID>',
    ],
    notes: '将节点复制到系统剪贴板，之后可使用 paste-node 粘贴。包含所有子节点和组件',
  },
  'duplicate-node': {
    description: '复制并粘贴节点（快捷操作）',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '要复制的节点 UUID' },
    ],
    examples: ['cocos-skills scene duplicate-node <节点UUID>'],
    notes: '相当于 copy-node + paste-node 的组合操作。新节点会自动命名',
  },
  'paste-node': {
    description: '粘贴剪贴板中的节点',
    parameters: [
      { name: 'parentUuid', type: 'string', required: true, description: '目标父节点 UUID' },
    ],
    examples: [
      'cocos-skills scene paste-node \'{"uuids":"节点UUID","target":"目标节点UUID"}\'',
      'cocos-skills scene paste-node \'{"uuids":["节点UUID"],"target":"目标节点UUID"}\'',
    ],
    notes: '将剪贴板中的节点粘贴为指定父节点的子节点。需要先使用 copy-node 或 cut-node。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'cut-node': {
    description: '剪切节点',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '要剪切的节点 UUID' },
    ],
    examples: ['cocos-skills scene cut-node <节点UUID>'],
    notes: '将节点剪切到剪贴板，之后可使用 paste-node 移动到新位置',
  },
  'set-parent': {
    description: '设置节点的父节点（移动节点）',
    parameters: [
      { name: 'params', type: 'object', required: true, description: '包含 uuids（节点UUID数组）、parent（父节点UUID）、index（可选，插入位置）的对象' },
    ],
    examples: [
      'cocos-skills scene set-parent \'{"uuids":"节点UUID","parent":"父节点UUID"}\'',
      'cocos-skills scene set-parent \'{"uuids":["节点UUID"],"parent":"父节点UUID"}\'',
    ],
    notes: `改变节点的层级关系，支持批量移动多个节点。uuids 是要移动的节点 UUID 数组，parent 是新父节点的 UUID，index 是可选的插入位置（默认添加到末尾）。

**循环检测校验：**
- 系统会自动检测并阻止会形成循环引用的节点移动操作
- 不能将节点移动到其子孙节点下（例如：不能将父节点移动到其子节点下）
- 如果检测到循环，会抛出错误提示具体的冲突节点

示例错误提示：
"无法将节点 xxx 移动到 yyy 下：节点 xxx 是节点 yyy 的祖先节点，这会形成循环引用"
谨慎操作，避免破坏引用关系
重要：修改场景后需要调用 save-scene 保存到磁盘`,
  },
  'create-node': {
    description: '创建新节点',
    parameters: [
      { name: 'options', type: 'object', required: true, description: '节点配置对象，可选包含 parent(父节点UUID)、name(节点名称)、type(节点类型)、components(组件类型数组) 等' },
    ],
    examples: [
      'cocos-skills scene create-node \'{}\'',
      'cocos-skills scene create-node \'{"name": "NewNode"}\'',
      'cocos-skills scene create-node \'{"parent": "父节点UUID", "name": "ChildNode"}\'',
      'cocos-skills scene create-node \'{"type": "cc.Sprite", "name": "MySprite"}\'',
      'cocos-skills scene create-node \'{"type": "cc.Canvas"}\'',
      'cocos-skills scene create-node \'{"type": "cc.Button", "name": "Btn"}\'',
      'cocos-skills scene create-node \'{"name": "CustomNode", "components": ["cc.Sprite", "cc.Button"]}\'',
    ],
    notes: `创建新节点并返回节点 UUID。

options 可选属性：
- parent: 父节点 UUID，不指定时添加到场景根节点
- name: 节点名称，不指定时自动生成
- type: 节点类型，指定后会自动添加相应组件和子节点
- components: 组件类型数组，创建节点时直接添加指定组件（如 ["cc.Sprite", "cc.Button"]）

支持的 type 类型：
- 基础类型: cc.Camera
- 2D 对象: cc.Graphics, cc.Label, cc.Mask, cc.Sprite, cc.ParticleSystem2D, cc.TiledMap
- UI 组件: cc.Button, cc.Canvas, cc.EditBox, cc.Layout, cc.PageView, cc.ProgressBar, cc.RichText, cc.ScrollView, cc.Slider, cc.Toggle, cc.VideoPlayer, cc.WebView, cc.Widget
- 3D 对象: cc.MeshRenderer, cc.Terrain

使用 type 创建节点时会自动添加所需的组件和子节点结构（如 cc.Button 会自动添加 Sprite 和 Label 子节点）。
使用 components 可以直接指定要添加的组件列表，与 type 参数互不影响，可以同时使用。

默认值：位置(0,0,0)、旋转(0,0,0)、缩放(1,1,1)。重要：修改场景后需要调用 save-scene 保存到磁盘`,
  },
  'remove-node': {
    description: '删除节点及其所有子节点（支持单个或批量删除）',
    parameters: [
      { name: 'params', type: 'object', required: true, description: '包含 uuid（节点UUID字符串或数组）的对象' },
    ],
    examples: [
      'cocos-skills scene remove-node \'{"uuid":"<节点UUID>"}\'',
      'cocos-skills scene remove-node \'{"uuid":["<节点UUID1>","<节点UUID2>"]}\'',
    ],
    notes: `此操作不可撤销。会删除节点及其所有子节点。

参数必须是 JSON 对象格式：
- 单个删除：{"uuid": "节点UUID"}
- 批量删除：{"uuid": ["节点UUID1", "节点UUID2", ...]}

建议删除前确认无引用。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新`,
  },
  'reset-node': {
    description: '重置节点变换为默认值',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID' },
    ],
    examples: [
      'cocos-skills scene reset-node <节点UUID>',
    ],
    notes: '将 position 重置为 (0,0,0)，rotation 重置为 (0,0,0)，scale 重置为 (1,1,1)。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新',
  },
  'reset-component': {
    description: '重置组件属性为默认值',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '组件 UUID（可以通过 query-node-tree 获取节点 components 中的组件 value）' },
    ],
    examples: [
      'cocos-skills scene reset-component <组件UUID>',
      'cocos-skills scene reset-component \'{"uuid": "<组件UUID>"}\'',
    ],
    notes: `将指定组件的所有属性恢复为引擎默认值。

获取组件 UUID 的方法：
1. 使用 query-node-tree 查看场景节点树
2. 从节点 components 字段中找到目标组件的 value 字段 即组件的 uuid
3. 使用组件的 uuid 调用此命令重置`,
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
      { name: 'component', type: 'string', required: true, description: '组件类型，支持内置组件（如 cc.Sprite、cc.Widget）和自定义脚本组件（直接使用脚本类名，如 Game2048）' },
    ],
    examples: [
      'cocos-skills scene create-component \'{"uuid": "节点UUID", "component": "cc.Widget"}\'',
      'cocos-skills scene create-component \'{"uuid": "节点UUID", "component": "cc.Camera"}\'',
      'cocos-skills scene create-component \'{"uuid": "节点UUID", "component": "cc.Animation"}\'',
      'cocos-skills scene create-component \'{"uuid":"2fMrHXUIVPnrsHYNLyMXI6","component": "Game2048"}\'',
    ],
    notes: `参数必须是 JSON 对象格式，包含 uuid 和 component 字段。为节点添加指定类型的组件。

**支持的组件类型：**
1. **内置组件**：使用 cc. 前缀，如 cc.Sprite、cc.Widget、cc.Camera、cc.Animation 等
2. **自定义脚本组件**：使用 @ccclass 装饰器中注册的名称

自定义脚本示例：
\`\`\`typescript
import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('Game2048')  // 这里的名称 'Game2048' 就是 component 参数要使用的值
export class Game2048 extends Component {
    // ...
}
\`\`\`

一个节点可以有多个组件，但每种类型只能有一个（除了 cc.Component）。添加自定义脚本组件时，component 参数使用 @ccclass 装饰器中声明的名称。

重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新`,
  },
  'remove-component': {
    description: '从节点移除组件',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '组件 UUID（可以通过 query-node-tree 获取节点 components 中的组件 value）' },
    ],
    examples: [
      'cocos-skills scene remove-component \'{"uuid": "<组件UUID>"}\'',
    ],
    notes: `移除指定组件。

获取组件 UUID 的方法：
1. 使用 query-node-tree 查看场景节点树
2. 从节点 components 字段中找到目标组件的 value 字段 即组件的 uuid
3. 使用组件的 uuid 调用此命令移除

注意：移除组件可能会影响节点功能。重要：修改场景后需要调用 save-scene 保存到磁盘，否则读取文件时内容不会更新`,
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
      { name: 'uuid', type: 'string', required: true, description: '节点 UUID。可以通过以下方式获取：1) 使用 query-node-tree 命令查看场景节点树，每个节点都包含 uuid 字段；2) 在 Cocos Creator 编辑器中选中节点，在属性检查器中可以看到节点的 UUID；3) 使用 query-nodes-by-asset-uuid 命令查找使用特定资源的节点' },
    ],
    examples: [
      'cocos-skills scene query-node 节点UUID',
      'cocos-skills scene query-node 根节点UUID',
    ],
    notes: '返回节点的详细信息，包括：\n- 基本属性：name（名称）、active（是否激活）、locked（是否锁定）、type（类型）、path（路径）\n- 变换属性：position（位置）、rotation（旋转）、scale（缩放）\n- 组件信息：__comps__ 字段包含所有组件的详细信息，每个组件包含 type（组件类型）、uuid（组件 UUID）、enabled（是否启用）、value（组件属性值）和 extends（继承的类）\n- 预制体信息：prefab 字段包含预制体状态信息\n- 父节点信息：parent 字段包含父节点的 UUID',
  },
  'query-node-tree': {
    description: '查询场景的节点树结构',
    parameters: [
      { name: 'filter', type: 'string|object', required: false, description: '过滤选项。可以是预设名称（minimal/basic/shallow/full）或选项对象。选项对象包含：maxDepth（最大深度）、only（字段列表，字符串或数组）、onlyActive（仅激活节点）' },
    ],
    examples: [
      'cocos-skills scene query-node-tree',
      'cocos-skills scene query-node-tree minimal',
      'cocos-skills scene query-node-tree basic',
      'cocos-skills scene query-node-tree \'{"only":"uuid,name,path"}\'',
      'cocos-skills scene query-node-tree \'{"only":["uuid","name","active"]}\'',
      'cocos-skills scene query-node-tree \'{"onlyActive":true}\'',
    ],
    notes: `返回场景的节点层级结构，每个节点包含 uuid、name、children、components 等属性。

**预设配置 (Presets)：**
- \`minimal\` - 仅 uuid 和 name（最精简）
- \`basic\` - uuid、name、path、active（基本信息）
- \`full\` - 完整信息，含组件（等同于默认行为）

**选项参数：**
- \`only\`: 字符串或数组，指定包含的字段（字符串支持逗号分隔，如 "uuid,name,path"）
- \`onlyActive\`: 布尔值，是否仅包含激活的节点（默认 false）

**使用示例：**
1. 完整树（默认）：\`cocos-skills scene query-node-tree\`
2. 使用预设：\`cocos-skills scene query-node-tree minimal\`
4. 指定字段（字符串）：\`cocos-skills scene query-node-tree '{"only":"uuid,name,active"}'\`
5. 指定字段（数组）：\`cocos-skills scene query-node-tree '{"only":["uuid","name"]}'\`
6. 仅激活节点：\`cocos-skills scene query-node-tree '{"onlyActive":true}'\`
7. 组合选项：\`cocos-skills scene query-node-tree '{"only":"uuid,name","onlyActive":true}'\``,
  },
  'query-nodes-by-asset-uuid': {
    description: '查询所有使用指定资源的节点',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '资源的 UUID。可以通过以下方式获取：1) 使用 asset-db query-asset-info 命令查询资源信息；2) 在 Cocos Creator 编辑器中选中资源，在属性检查器中可以看到资源的 UUID；3) 使用 asset-db query-assets 命令列出所有资源' },
    ],
    examples: [
      'cocos-skills scene query-nodes-by-asset-uuid 资源UUID',
    ],
    notes: '返回所有引用该资源的节点 UUID 列表。常用于查找资源使用情况、删除未使用的资源、重构项目时追踪资源依赖关系。如果返回空数组，说明该资源在当前场景中未被使用。注意：此命令只查询当前打开的场景中的节点，不会查询其他场景或预制体中的使用情况',
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
      { name: 'uuid', type: 'string', required: true, description: '组件 UUID（不是节点 UUID，可以通过 query-node-tree 获取节点 components 中的组件 value）' },
    ],
    examples: [
      'cocos-skills scene query-component <组件UUID>',
    ],
    notes: `返回组件的所有属性及其当前值。

获取组件 UUID 的方法：
1. 使用 query-node-tree 查看场景节点树（默认包含组件信息）
2. 从节点 components 字段中找到目标组件的 value 字段 即组件的 uuid
3. 使用组件的 uuid 字段作为此命令的参数

注意：此命令在某些情况下可能不可用，建议使用 query-node-tree 获取节点组件信息`,
  },
  'query-classes': {
    description: '查询可用的组件类列表',
    parameters: [
      { name: 'extends', type: 'string', required: false, description: '基类过滤（可选），如 cc.Component、cc.Node' },
      { name: 'scriptName', type: 'string', required: false, description: '脚本名称（可选）' },
    ],
    examples: [
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
    description: '查询组件是否为脚本组件',
    parameters: [
      { name: 'uuid', type: 'string', required: true, description: '组件 UUID（不是节点 UUID，可以通过 query-node-tree 获取节点 components 中的组件 value）' },
    ],
    examples: [
      'cocos-skills scene query-component-has-script <组件UUID>',
    ],
    notes: '返回布尔值，true 表示该组件是脚本组件，false 表示不是。注意：此命令在某些情况下可能不可用，建议使用 query-node-tree 获取节点组件信息并检查 components 字段',
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
